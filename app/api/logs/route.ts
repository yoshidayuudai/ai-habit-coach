import { supabase } from "@/lib/db";

export async function GET() {
  const { data, error } = await supabase
    .from("habit_logs")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("habit_logs")
    .insert([
      {
        habit_id: body.habitId,
        date: today,
      },
    ])
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}