import React, { useRef, useState } from 'react';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  preview?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, preview }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(preview);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
      
      // プレビュー表示
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
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
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
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
          cursor: 'pointer',
          backgroundColor: '#f9f9f9',
          transition: 'all 0.2s'
        }}
      >
        {previewUrl ? (
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


