"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddPage() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleAdd = async () => {
    if (!name.trim()) {
      alert("習慣名を入力してください");
      return;
    }

    const res = await fetch("/api/habits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();
    console.log("追加レスポンス:", data);

    if (!res.ok || data?.error) {
      alert("追加に失敗しました");
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 px-4 py-8 md:py-12">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-[28px] border border-white/60 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur md:p-8">
          <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
            Add Habit
          </div>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            習慣を追加
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600 md:text-base">
            毎日続けたい習慣を登録しよう。
          </p>

          <div className="mt-8">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              習慣名
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: 筋トレ"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleAdd}
              className="rounded-2xl bg-blue-600 px-5 py-3 text-base font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
            >
              追加する
            </button>

            <button
              onClick={() => router.push("/")}
              className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-base font-bold text-slate-700 transition hover:bg-slate-50"
            >
              戻る
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}