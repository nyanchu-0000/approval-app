# 承認アプリ

承認欲求を満たすスマホWebアプリ - 2人だけのプライベートなSNS

## 🎯 概要

このアプリは、フレンドとの間で投稿を共有し、承認（いいね）を送り合うことができるプライベートなSNSアプリです。
Instagram のような機能を2人だけで楽しむことができます。

## ✨ 機能

- 📝 **投稿機能**: テキスト・画像付きで投稿を作成
- 👍 **承認機能**: フレンドの投稿に承認（いいね）を送信
- 📱 **スマホ最適化**: モバイルブラウザに最適化されたUI
- 🖼️ **画像アップロード**: スマホのフォトアプリから画像を選択
- 👥 **フレンド管理**: 特定のフレンドとだけ投稿を共有

## 📱 画面構成

1. **ローディング画面** - アプリ起動時のスプラッシュ画面
2. **ホーム画面** - 投稿・承認ボタンを配置
3. **投稿作成画面** - タイトル、画像、本文を入力
4. **投稿完了画面** - 投稿成功の通知
5. **投稿一覧画面** - 自分の投稿を一覧表示
6. **承認一覧画面** - フレンドの投稿を一覧表示
7. **プロフィール画面** - ユーザー情報とフレンド管理

## 🛠️ 技術スタック

- **フロントエンド**:
  - React 19
  - TypeScript
  - React Router
  - Zustand (状態管理)
  - date-fns (日付処理)
  - Vite (ビルドツール)

- **予定している追加技術**:
  - Firebase Authentication (認証)
  - Firestore (データベース)
  - Firebase Storage (画像保存)

## 🚀 開発環境のセットアップ

### 必要要件

- Node.js 18以上
- npm または yarn

### インストール

```bash
# リポジトリのクローン
git clone [your-repo-url]
cd approval-app

# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev
```

開発サーバーは `http://localhost:3000` で起動します。

### ビルド

```bash
# 本番用ビルド
npm run build

# プレビュー
npm run preview
```

## 📁 プロジェクト構成

```
src/
├── components/
│   ├── common/         # 共通コンポーネント
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Button.tsx
│   │   └── ProfileIcon.tsx
│   ├── post/          # 投稿関連コンポーネント
│   │   ├── PostCard.tsx
│   │   └── ImageUpload.tsx
│   └── approval/      # 承認関連コンポーネント
│       └── ApprovalButton.tsx
├── pages/             # ページコンポーネント
│   ├── LoadingPage.tsx
│   ├── HomePage.tsx
│   ├── CreatePostPage.tsx
│   ├── PostSuccessPage.tsx
│   ├── PostListPage.tsx
│   ├── ApprovalListPage.tsx
│   └── ProfilePage.tsx
├── types/             # TypeScript型定義
│   ├── user.ts
│   ├── post.ts
│   └── approval.ts
├── hooks/             # カスタムフック（予定）
├── store/             # 状態管理（予定）
├── services/          # API・Firebase連携（予定）
└── utils/             # ユーティリティ関数（予定）
```

## 🌿 ブランチ戦略

```
main (本番環境)
  └── develop (開発環境)
       ├── feature/setup-project ✅ 完了
       ├── feature/firebase-setup (次のステップ)
       ├── feature/authentication
       └── ...
```

## 🎨 デザイン

- カラースキーム:
  - プライマリカラー: `#4a9d8f` (ターコイズグリーン)
  - 背景色: `#f0f4f8` (ライトグレー)
  - アクセントカラー: `#ffd700` (ゴールド)

## 📝 TODO

### Phase 1: プロジェクトセットアップ ✅
- [x] 必要なパッケージのインストール
- [x] フォルダ構成の作成
- [x] 基本コンポーネントの実装
- [x] ルーティング設定
- [x] 全ページの基本UI実装

### Phase 2: Firebase統合（次のステップ）
- [ ] Firebaseプロジェクトの作成
- [ ] Authentication設定
- [ ] Firestore設定
- [ ] Storage設定

### Phase 3: 認証機能
- [ ] ログイン・サインアップ画面
- [ ] 認証状態管理
- [ ] プロフィール設定

### Phase 4: データ連携
- [ ] 投稿のFirestore保存
- [ ] 画像のStorage保存
- [ ] リアルタイムデータ取得

### Phase 5: 承認機能の実装
- [ ] 承認ボタンの動作実装
- [ ] 承認状態の管理
- [ ] 通知機能（オプション）

## 🤝 コントリビューション

現在は個人プロジェクトです。

## 📄 ライセンス

MIT

## 👨‍💻 開発者

[Your Name]

---

**現在のステータス**: Phase 1 完了 🎉

次は Firebase のセットアップを行い、実際のデータベース連携を実装していきます！
