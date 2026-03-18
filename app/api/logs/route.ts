import { logs } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json();

  const newLog = {
    habitId: body.habitId,
    date: new Date().toISOString().split("T")[0],
  };

  logs.push(newLog);

  return new Response(JSON.stringify(newLog), {
    headers: { "Content-Type": "application/json" },
  });
}