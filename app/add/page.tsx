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
    <main className="min-h-screen bg-[#f3f4f6] px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-[24px] bg-white p-7 shadow-sm">
          <p className="text-sm text-gray-500">Portfolio App</p>
          <h1 className="mt-1 text-5xl font-extrabold tracking-tight text-slate-900">
            習慣を追加
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            継続したい習慣を登録して、AIコーチに分析してもらおう
          </p>

          <div className="mt-10">
            <label className="block text-xl font-bold text-slate-900">
              習慣名
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例：筋トレ、英語、読書"
              className="mt-3 w-full rounded-2xl border border-gray-300 px-5 py-4 text-lg outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={addHabit}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-4 text-lg font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "追加中..." : "追加する"}
            </button>

            <a
              href="/"
              className="inline-flex items-center justify-center rounded-2xl border border-gray-300 px-6 py-4 text-lg font-bold text-gray-700 transition hover:bg-gray-50"
            >
              戻る
            </a>
          </div>

          <div className="mt-10 rounded-[24px] bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 p-6 text-white shadow-sm">
            <h2 className="text-3xl font-extrabold">追加のヒント</h2>
            <p className="mt-3 whitespace-pre-wrap text-lg leading-8 text-purple-100">
              ・最初は1〜3個に絞る
              {"\n"}・毎日できる小さい習慣から始める
              {"\n"}・時間やタイミングも決めると続きやすい
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}