import { habits } from "@/lib/db";

export async function GET() {
  return new Response(JSON.stringify(habits), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request) {
  const body = await req.json();

  const newHabit = {
    id: Date.now(),
    name: body.name,
  };

  habits.push(newHabit);

  return new Response(JSON.stringify(newHabit), {
    headers: { "Content-Type": "application/json" },
  });
}