"use client";

import { useState } from "react";

export default function AddPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const addHabit = async () => {
    if (!name.trim()) {
      alert("習慣名を入力してください");
      return;
    }

    try {
      setLoading(true);

      await fetch("/api/habits", {
        method: "POST",
        body: JSON.stringify({ name }),
      });

      alert("追加しました！");
      setName("");
      window.location.href = "/";
    } catch (error) {
      console.error("追加エラー:", error);
      alert("追加に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 px-4 py-8 md:py-12">
      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-[28px] border border-white/60 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur">
          <div className="border-b border-slate-100 bg-white px-6 py-6 md:px-8 md:py-7">
            <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
              Portfolio App
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
              習慣を追加
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
              継続したい習慣を登録して、AIコーチに分析してもらおう。
              まずは小さく始められるものを1つ入れるのがおすすめです。
            </p>
          </div>

          <div className="px-6 py-6 md:px-8 md:py-8">
            <div>
              <label className="block text-lg font-bold text-slate-900 md:text-xl">
                習慣名
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例：筋トレ、英語、読書"
                className="mt-3 w-full rounded-2xl border border-slate-300 bg-white px-5 py-4 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 md:text-lg"
              />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={addHabit}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-blue-200 transition hover:translate-y-[-1px] hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "追加中..." : "追加する"}
              </button>

              <a
                href="/"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-4 text-base font-bold text-slate-700 transition hover:bg-slate-50"
              >
                戻る
              </a>
            </div>

            <div className="mt-8 overflow-hidden rounded-[28px] bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 p-6 text-white shadow-[0_18px_40px_rgba(109,40,217,0.28)]">
              <div className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-white/90">
                Tips
              </div>
              <h2 className="mt-3 text-2xl font-extrabold md:text-3xl">
                追加のヒント
              </h2>
              <div className="mt-4 space-y-2 text-sm leading-7 text-purple-100 md:text-base">
                <p>・最初は1〜3個に絞る</p>
                <p>・毎日できる小さい習慣から始める</p>
                <p>・時間やタイミングも決めると続きやすい</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}