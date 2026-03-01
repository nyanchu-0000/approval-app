import React, { useRef, useState } from 'react';
import heic2any from 'heic2any';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  preview?: string;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, preview, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(preview);
  const [isConverting, setIsConverting] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsConverting(true);
      let processedFile = file;

      if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
        const convertedBlob = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.8
        });

        const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
        processedFile = new File(
          [blob],
          file.name.replace(/\.heic$/i, '.jpg'),
          { type: 'image/jpeg' }
        );
      }

      onImageSelect(processedFile);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(processedFile);
    } catch (error) {
      console.error('画像の処理に失敗しました:', error);
      alert('画像の処理に失敗しました。別の画像を選択してください。');
    } finally {
      setIsConverting(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-upload-container">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.heic"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        disabled={disabled || isConverting}
      />
      
      <div 
        className="upload-area"
        onClick={handleClick}
        style={{
          width: '100%',
          minHeight: '200px',
          border: '2px dashed #ccc',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: (disabled || isConverting) ? 'not-allowed' : 'pointer',
          backgroundColor: '#f9f9f9',
          transition: 'all 0.2s',
          opacity: (disabled || isConverting) ? 0.6 : 1
        }}
      >
        {isConverting ? (
          <div style={{ textAlign: 'center', color: '#4a9d8f', padding: '20px' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>画像を変換中...</div>
            <div style={{ fontSize: '12px', marginTop: '8px', color: '#666' }}>
              HEIC形式の画像をJPEGに変換しています
            </div>
          </div>
        ) : previewUrl ? (
          <img 
            src={previewUrl} 
            alt="プレビュー" 
            style={{
              maxWidth: '100%',
              maxHeight: '300px',
              borderRadius: '8px'
            }}
          />
        ) : (
          <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}></div>
            <p style={{ margin: 0, fontSize: '14px' }}>タップして画像を選択</p>
          </div>
        )}
      </div>
    </div>
  );
};



