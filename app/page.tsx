"use client";

import { useEffect, useState } from "react";

type Habit = {
  id: number;
  name: string;
};

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [advice, setAdvice] = useState("");
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const fetchHabits = async () => {
    try {
      const res = await fetch("/api/habits");
      const data = await res.json();
      setHabits(data);
    } catch (error) {
      console.error("習慣取得エラー:", error);
    }
  };

  const checkHabit = async (id: number) => {
    try {
      await fetch("/api/logs", {
        method: "POST",
        body: JSON.stringify({ habitId: id }),
      });
      alert("記録しました！");
    } catch (error) {
      console.error("記録エラー:", error);
      alert("記録に失敗しました");
    }
  };

  const getAdvice = async () => {
    try {
      setLoadingAdvice(true);

      const res = await fetch("/api/ai", {
        method: "POST",
        body: JSON.stringify({ habits }),
      });

      const data = await res.json();

      if (data?.error?.message) {
        setAdvice("AIエラー: " + data.error.message);
        return;
      }

      setAdvice(
        data?.choices?.[0]?.message?.content || "取得できませんでした"
      );
    } catch (error) {
      console.error("AI取得エラー:", error);
      setAdvice("エラーが発生しました");
    } finally {
      setLoadingAdvice(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  return (
    <main className="min-h-screen bg-[#f3f4f6] px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-[24px] bg-white p-7 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm text-gray-500">Portfolio App</p>
              <h1 className="mt-1 text-5xl font-extrabold tracking-tight text-slate-900">
                AI習慣コーチ
              </h1>
              <p className="mt-3 text-lg text-gray-600">
                習慣を記録して、AIから改善アドバイスを受けよう
              </p>
            </div>

            <a
              href="/add"
              className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-4 text-lg font-bold text-white shadow-sm transition hover:bg-blue-700"
            >
              習慣を追加
            </a>
          </div>

          <section className="mt-10">
            <h2 className="text-3xl font-extrabold text-slate-900">習慣一覧</h2>

            {habits.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-5 py-8 text-center text-gray-500">
                まだ習慣がありません。まずは追加してみよう。
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {habits.map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-5 shadow-sm"
                  >
                    <div>
                      <p className="text-3xl font-extrabold text-slate-900">
                        {h.name}
                      </p>
                      <p className="mt-1 text-lg text-gray-500">
                        今日も一歩ずつ継続
                      </p>
                    </div>

                    <button
                      onClick={() => checkHabit(h.id)}
                      className="rounded-2xl bg-green-500 px-5 py-3 text-xl font-extrabold text-white transition hover:bg-green-600"
                    >
                      記録
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="mt-8 rounded-[24px] bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 p-6 text-white shadow-sm">
            <h2 className="text-4xl font-extrabold">AIコーチからアドバイス</h2>
            <p className="mt-3 text-lg text-purple-100">
              現在の習慣をもとに、改善点と次の行動を提案します
            </p>

            <button
              onClick={getAdvice}
              disabled={loadingAdvice}
              className="mt-5 rounded-2xl bg-white px-6 py-4 text-2xl font-extrabold text-purple-700 transition hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loadingAdvice ? "取得中..." : "AIアドバイスをもらう"}
            </button>

            <div className="mt-5 rounded-2xl bg-white/15 px-5 py-5 text-lg leading-9 text-white whitespace-pre-wrap">
              {advice || "まだアドバイスはありません。ボタンを押して取得しよう。"}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}