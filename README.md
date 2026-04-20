# AI習慣コーチ

習慣を記録し、AIから改善アドバイスを受けられるWebアプリです。  
小さな行動の継続をサポートし、習慣化を促進することを目的としています。

---

## 🌐 デモ
https://ai-habit-coach-delta.vercel.app

---

## 🛠 使用技術

- **フロントエンド**
  - Next.js（App Router）
  - TypeScript
  - Tailwind CSS

- **バックエンド**
  - Next.js API Routes

- **データベース**
  - Supabase（PostgreSQL）

- **AI**
  - OpenAI API

---

## ✨ 主な機能

- 習慣の追加・一覧表示・削除
- 習慣の記録（ワンクリック）
- AIによる改善アドバイス生成
- データの永続化（Supabase）

---

## 📸 画面イメージ

※スクリーンショットをここに貼る

---

## 🚀 こだわり・工夫した点

- **シンプルなUI/UX**
  - ワンクリックで記録できる設計
  - 状態に応じて「記録済み」を表示

- **フルスタック構成**
  - フロント・API・DBをNext.js + Supabaseで統一

- **AI活用**
  - OpenAI APIを使い、習慣データから改善提案を生成
  - 改行や見出しを整形して読みやすく表示

---

## ⚠️ 苦労した点

- Supabase接続エラー（URLミス・環境変数）
- APIレスポンス処理（JSONエラー）
- Vercelデプロイ時の環境変数設定

---

## 🔧 セットアップ方法

```bash
git clone https://github.com/yoshidayuudai/ai-habit-coach.git
cd ai-habit-coach
npm install
npm run dev