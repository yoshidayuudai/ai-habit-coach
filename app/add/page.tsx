"use client";

import { useState } from "react";

export default function AddPage() {
  const [name, setName] = useState("");

  const addHabit = async () => {
    await fetch("/api/habits", {
      method: "POST",
      body: JSON.stringify({ name }),
    });

    alert("追加しました！");
    setName("");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">習慣追加</h1>

      <input
        className="border p-2 w-full mt-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="例：筋トレ"
      />

      <button
        onClick={addHabit}
        className="bg-blue-500 text-white px-4 py-2 mt-2"
      >
        追加
      </button>
    </div>
  );
}