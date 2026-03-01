import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

type UserConfig = {
  name: string;
  email: string;
};

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');

  // 環境変数から2人のユーザー情報を取得
  const users: UserConfig[] = [
    {
      name: import.meta.env.VITE_USER1_NAME || 'ユーザー1',
      email: import.meta.env.VITE_USER1_EMAIL || '',
    },
    {
      name: import.meta.env.VITE_USER2_NAME || 'ユーザー2',
      email: import.meta.env.VITE_USER2_EMAIL || '',
    },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    // 2人のユーザーを順番に試す
    let loginSuccess = false;
    let lastError: any = null;

    for (const user of users) {
      if (!user.email) continue;

      try {
        await authService.signIn(user.email, password);
        loginSuccess = true;
        navigate('/');
        break;
      } catch (err: any) {
        lastError = err;
        // 次のユーザーを試す
        continue;
      }
    }

    if (!loginSuccess && lastError) {
      console.error('Login error:', lastError);
      let errorMessage = lastError.message || lastError.error_description || 'ログインに失敗しました';
      
      // エラーメッセージを日本語でわかりやすく
      if (errorMessage.includes('Email logins are disabled')) {
        errorMessage = 'メールログインが無効になっています。Supabaseダッシュボードで「Authentication」→「Providers」→「Email」を有効にしてください。';
      } else if (lastError.status === 406 || errorMessage.includes('Email not confirmed')) {
        errorMessage = 'メールアドレスが確認されていません。Supabaseダッシュボードで「Authentication」→「Users」から該当ユーザーのメール確認を完了させてください。';
      } else if (errorMessage.includes('Invalid login credentials')) {
        errorMessage = 'パスワードが正しくありません。';
      } else if (errorMessage.includes('User not found')) {
        errorMessage = 'ユーザーが見つかりません。';
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#D4E7F5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '40px',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '8px',
          textAlign: 'center',
        }}>
          ログイン
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#666',
          marginBottom: '32px',
          textAlign: 'center',
        }}>
          2人だけのプライベートSNS
        </p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '8px',
              color: '#333',
            }}>
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="current-password"
              autoFocus
              placeholder="パスワードを入力してください"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '16px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <div style={{
              padding: '12px',
              backgroundColor: '#fee',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              color: '#c33',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#B8D4E8',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>
      </div>
    </div>
  );
};

