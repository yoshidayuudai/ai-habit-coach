"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("登録しました。確認メールが必要な場合はメールを確認してください。");
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-6 shadow-lg">
        <h1 className="text-3xl font-extrabold text-slate-900">ログイン</h1>

        <div className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900"
          />

          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900"
          />
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleLogin}
            className="rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white"
          >
            ログイン
          </button>

          <button
            onClick={handleSignUp}
            className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700"
          >
            新規登録
          </button>
        </div>
      </div>
    </main>
  );
}