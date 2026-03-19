"use client";

import { useEffect, useState } from "react";

type Habit = {
  id: number;
  name: string;
};

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [advice, setAdvice] = useState("");

  const fetchHabits = async () => {
    const res = await fetch("/api/habits");
    const data = await res.json();
    console.log("習慣データ:", data);
    setHabits(data);
  };

  const checkHabit = async (id: number) => {
    await fetch("/api/logs", {
      method: "POST",
      body: JSON.stringify({ habitId: id }),
    });
    alert("記録しました！");
  };

  const getAdvice = async () => {
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        body: JSON.stringify({ habits }),
      });

      const data = await res.json();
      console.log("AIレスポンス:", data);

      setAdvice(
        data?.choices?.[0]?.message?.content || "取得できませんでした"
      );
    } catch (error) {
      console.error("エラー:", error);
      setAdvice("エラーが発生しました");
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">習慣一覧</h1>

      <a href="/add" className="text-blue-500 underline">
        ＋追加
      </a>

      <ul className="mt-4 space-y-2">
        {habits.map((h) => (
          <li key={h.id} className="flex justify-between border p-2">
            {h.name}
            <button
              onClick={() => checkHabit(h.id)}
              className="bg-green-500 text-white px-2"
            >
              ✔
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={getAdvice}
        className="bg-purple-500 text-white px-4 py-2 mt-4"
      >
        AIアドバイス
      </button>

      <p className="mt-4 whitespace-pre-wrap">{advice}</p>
    </div>
  );
}