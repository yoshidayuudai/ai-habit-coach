"use client";

import { useEffect, useMemo, useState } from "react";

type Habit = {
  id: number;
  name: string;
};

type Log = {
  id: number;
  habit_id: number;
  date: string;
};

const colorClasses = [
  "from-blue-100 to-indigo-100 text-blue-700",
  "from-emerald-100 to-green-100 text-emerald-700",
  "from-pink-100 to-rose-100 text-pink-700",
  "from-amber-100 to-yellow-100 text-amber-700",
  "from-violet-100 to-purple-100 text-violet-700",
  "from-cyan-100 to-sky-100 text-cyan-700",
];

const weekLabels = ["日", "月", "火", "水", "木", "金", "土"];

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

function getMonthCalendar(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];

  for (let i = 0; i < startDay; i++) {
    cells.push(null);
  }

  for (let day = 1; day <= lastDate; day++) {
    cells.push(day);
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

function calculateStreak(logs: Log[]) {
  if (logs.length === 0) return 0;

  const uniqueDates = Array.from(new Set(logs.map((log) => log.date))).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  let streak = 0;
  const current = new Date();
  current.setHours(0, 0, 0, 0);

  for (const dateStr of uniqueDates) {
    const logDate = new Date(dateStr);
    logDate.setHours(0, 0, 0, 0);

    if (logDate.getTime() === current.getTime()) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [advice, setAdvice] = useState("");
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [completedHabitIds, setCompletedHabitIds] = useState<number[]>([]);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDate = today.getDate();
  const todayString = today.toISOString().split("T")[0];

  const habitCountLabel = useMemo(() => `${habits.length} 件`, [habits.length]);
  const calendarCells = useMemo(
    () => getMonthCalendar(currentYear, currentMonth),
    [currentYear, currentMonth]
  );
  const streak = useMemo(() => calculateStreak(logs), [logs]);

  const completedDateSet = useMemo(() => {
    return new Set(logs.map((log) => log.date));
  }, [logs]);

  const fetchHabits = async () => {
    try {
      const res = await fetch("/api/habits");
      const data = await res.json();

      if (Array.isArray(data)) {
        setHabits(data);
      } else {
        console.error("habits取得失敗:", data);
        setHabits([]);
      }
    } catch (error) {
      console.error("習慣取得エラー:", error);
      setHabits([]);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/logs");
      const data = await res.json();

      if (Array.isArray(data)) {
        setLogs(data);
      } else {
        console.error("ログ取得失敗:", data);
        setLogs([]);
      }
    } catch (error) {
      console.error("ログ取得エラー:", error);
      setLogs([]);
    }
  };

  const checkHabit = async (id: number) => {
    try {
      const alreadyLoggedToday = logs.some(
        (log) => log.habit_id === id && log.date === todayString
      );

      if (alreadyLoggedToday) {
        alert("今日はすでに記録済みです");
        return;
      }

      const res = await fetch("/api/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ habitId: id }),
      });

      const newLog = await res.json();

      if (!res.ok || newLog?.error) {
        console.error("ログ記録失敗:", newLog);
        alert("記録に失敗しました");
        return;
      }

      setLogs((prev) => [...prev, newLog]);

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

  const deleteHabit = async (id: number) => {
    const ok = window.confirm("この習慣を削除しますか？");
    if (!ok) return;

    try {
      const res = await fetch("/api/habits", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok || data?.error) {
        console.error("削除失敗:", data);
        alert("削除に失敗しました");
        return;
      }

      setHabits((prev) => prev.filter((habit) => habit.id !== id));
      setLogs((prev) => prev.filter((log) => log.habit_id !== id));
      setCompletedHabitIds((prev) => prev.filter((habitId) => habitId !== id));
    } catch (error) {
      console.error("削除エラー:", error);
      alert("削除に失敗しました");
    }
  };

  const getAdvice = async () => {
    try {
      setLoadingAdvice(true);

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    fetchLogs();
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
                className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-base font-bold text-white shadow-lg shadow-blue-200 transition duration-200 hover:translate-y-[-1px] hover:bg-blue-700 active:scale-[0.98]"
              >
                習慣を追加
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

              <div className="mt-4 inline-flex items-center rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-700">
                🔥 {streak}日連続達成
              </div>

              {!Array.isArray(habits) || habits.length === 0 ? (
                <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-slate-500">
                  まだ習慣がありません。まずは1つ追加してみよう。
                </div>
              ) : (
                <div className="mt-5 grid gap-4">
                  {habits.map((h) => {
                    const doneToday = logs.some(
                      (log) => log.habit_id === h.id && log.date === todayString
                    );
                    const isCompleted =
                      completedHabitIds.includes(h.id) || doneToday;
                    const iconColorClass = getColorClass(h.name);

                    return (
                      <div
                        key={h.id}
                        className={`group flex items-center justify-between rounded-3xl border px-5 py-5 shadow-sm transition-all duration-300 ${
                          isCompleted
                            ? "scale-[1.01] border-emerald-200 bg-emerald-50/80 shadow-[0_14px_36px_rgba(16,185,129,0.16)]"
                            : "border-slate-200 bg-white hover:translate-y-[-2px] hover:border-slate-300 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-xl font-extrabold transition-transform duration-300 ${
                              isCompleted ? "scale-110" : ""
                            } ${iconColorClass}`}
                          >
                            {h.name.slice(0, 1)}
                          </div>
                          <div>
                            <p className="text-xl font-extrabold text-slate-900 md:text-2xl">
                              {h.name}
                            </p>
                            <p
                              className={`mt-1 text-sm transition-colors duration-300 ${
                                isCompleted ? "text-emerald-700" : "text-slate-500"
                              }`}
                            >
                              {isCompleted
                                ? "今日の記録が完了しました"
                                : "今日も一歩ずつ継続"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => deleteHabit(h.id)}
                            className="rounded-2xl border border-red-200 bg-white px-4 py-3 text-base font-extrabold text-red-600 shadow-sm transition-all duration-200 hover:bg-red-50 active:scale-[0.98]"
                          >
                            削除
                          </button>

                          <button
                            onClick={() => checkHabit(h.id)}
                            className={`rounded-2xl px-4 py-3 text-base font-extrabold text-white shadow-lg transition-all duration-200 md:px-5 ${
                              isCompleted
                                ? "scale-105 bg-emerald-600 shadow-emerald-100"
                                : "bg-green-500 shadow-green-100 hover:translate-y-[-1px] hover:bg-green-600 active:scale-[0.98]"
                            }`}
                          >
                            {isCompleted ? "記録済み" : "✔ 記録"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 md:text-3xl">
                    今月の達成カレンダー
                  </h2>
                  <p className="mt-2 text-sm text-slate-500 md:text-base">
                    記録した日に自動で印がつきます
                  </p>
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                  {currentMonth + 1}月
                </div>
              </div>

              <div className="mt-5 grid grid-cols-7 gap-2">
                {weekLabels.map((label) => (
                  <div
                    key={label}
                    className="text-center text-sm font-bold text-slate-500"
                  >
                    {label}
                  </div>
                ))}

                {calendarCells.map((day, index) => {
                  if (day === null) {
                    return (
                      <div
                        key={`empty-${index}`}
                        className="aspect-square rounded-2xl bg-transparent"
                      />
                    );
                  }

                  const dateString = `${currentYear}-${String(
                    currentMonth + 1
                  ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                  const isCompletedDay = completedDateSet.has(dateString);
                  const isToday = day === currentDate;

                  return (
                    <div
                      key={dateString}
                      className={`relative flex aspect-square items-center justify-center rounded-2xl border text-sm font-bold transition ${
                        isCompletedDay
                          ? "border-emerald-200 bg-emerald-100 text-emerald-800"
                          : "border-slate-200 bg-slate-50 text-slate-700"
                      } ${isToday ? "ring-2 ring-blue-400" : ""}`}
                    >
                      <span>{day}</span>

                      {isCompletedDay && (
                        <span className="absolute bottom-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      )}
                    </div>
                  );
                })}
              </div>
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
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-base font-extrabold text-purple-700 shadow-lg shadow-purple-900/10 transition-all duration-200 hover:translate-y-[-1px] hover:bg-purple-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
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