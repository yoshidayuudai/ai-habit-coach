"use client";

import { useEffect, useMemo, useState } from "react";

type Habit = {
  id: number;
  name: string;
};

const colorClasses = [
  "from-blue-100 to-indigo-100 text-blue-700",
  "from-emerald-100 to-green-100 text-emerald-700",
  "from-pink-100 to-rose-100 text-pink-700",
  "from-amber-100 to-yellow-100 text-amber-700",
  "from-violet-100 to-purple-100 text-violet-700",
  "from-cyan-100 to-sky-100 text-cyan-700",
];

function getColorClass(name: string) {
  const sum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colorClasses[sum % colorClasses.length];
}

function renderAdvice(advice: string) {
  if (!advice) {
    return (
      <p className="text-base leading-8 text-white">
        まだアドバイスはありません。ボタンを押して取得しよう。
      </p>
    );
  }

  const lines = advice.split("\n");

  return (
    <div className="space-y-2">
      {lines.map((line, index) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={index} className="h-2" />;
        }

        const isHeading = /^【.*】$/.test(trimmed);

        if (isHeading) {
          return (
            <p
              key={index}
              className="pt-2 text-lg font-extrabold text-white md:text-xl"
            >
              {trimmed}
            </p>
          );
        }

        return (
          <p key={index} className="text-base leading-8 text-white/95">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [advice, setAdvice] = useState("");
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [completedHabitIds, setCompletedHabitIds] = useState<number[]>([]);

  const habitCountLabel = useMemo(() => `${habits.length} 件`, [habits.length]);

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

      setCompletedHabitIds((prev) => {
        if (prev.includes(id)) return prev;
        return [...prev, id];
      });

      setTimeout(() => {
        setCompletedHabitIds((prev) => prev.filter((habitId) => habitId !== id));
      }, 1500);
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
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 px-4 py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-[28px] border border-white/60 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur">
          <div className="border-b border-slate-100 bg-white px-6 py-6 md:px-8 md:py-7">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                  Portfolio App
                </div>
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
                  AI習慣コーチ
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                  習慣を記録して、AIから改善アドバイスを受けよう。
                  小さな継続を積み重ねて、毎日の行動を少しずつ良くしていくためのアプリです。
                </p>
              </div>

              <a
                href="/add"
                className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-base font-bold text-white shadow-lg shadow-blue-200 transition hover:translate-y-[-1px] hover:bg-blue-700"
              >
                ＋ 習慣を追加
              </a>
            </div>
          </div>

          <div className="px-6 py-6 md:px-8 md:py-8">
            <section>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-extrabold text-slate-900 md:text-3xl">
                  習慣一覧
                </h2>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">
                  {habitCountLabel}
                </div>
              </div>

              {habits.length === 0 ? (
                <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-slate-500">
                  まだ習慣がありません。まずは1つ追加してみよう。
                </div>
              ) : (
                <div className="mt-5 grid gap-4">
                  {habits.map((h) => {
                    const isCompleted = completedHabitIds.includes(h.id);
                    const iconColorClass = getColorClass(h.name);

                    return (
                      <div
                        key={h.id}
                        className={`group flex items-center justify-between rounded-3xl border px-5 py-5 shadow-sm transition ${
                          isCompleted
                            ? "border-emerald-200 bg-emerald-50/80 shadow-[0_10px_30px_rgba(16,185,129,0.12)]"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-xl font-extrabold ${iconColorClass}`}
                          >
                            {h.name.slice(0, 1)}
                          </div>
                          <div>
                            <p className="text-xl font-extrabold text-slate-900 md:text-2xl">
                              {h.name}
                            </p>
                            <p
                              className={`mt-1 text-sm ${
                                isCompleted ? "text-emerald-700" : "text-slate-500"
                              }`}
                            >
                              {isCompleted ? "今日の記録が完了しました" : "今日も一歩ずつ継続"}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => checkHabit(h.id)}
                          className={`rounded-2xl px-4 py-3 text-base font-extrabold text-white shadow-lg transition md:px-5 ${
                            isCompleted
                              ? "bg-emerald-600 shadow-emerald-100"
                              : "bg-green-500 shadow-green-100 hover:translate-y-[-1px] hover:bg-green-600"
                          }`}
                        >
                          {isCompleted ? "記録済み" : "✔ 記録"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="mt-8 overflow-hidden rounded-[28px] bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 p-6 text-white shadow-[0_18px_40px_rgba(109,40,217,0.28)] md:p-7">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-white/90">
                    AI Coach
                  </div>
                  <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">
                    AIコーチからアドバイス
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-purple-100 md:text-base">
                    現在の習慣をもとに、良い点・改善点・明日やることを提案します。
                  </p>
                </div>

                <button
                  onClick={getAdvice}
                  disabled={loadingAdvice}
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-base font-extrabold text-purple-700 shadow-lg shadow-purple-900/10 transition hover:translate-y-[-1px] hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loadingAdvice ? "取得中..." : "AIアドバイスをもらう"}
                </button>
              </div>

              <div className="mt-5 rounded-3xl border border-white/10 bg-white/15 px-5 py-5 whitespace-pre-wrap backdrop-blur-sm">
                {renderAdvice(advice)}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}