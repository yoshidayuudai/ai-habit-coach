export async function POST(req: Request) {
  const body = await req.json();
  const habits = body.habits;

  const prompt = `
あなたは優秀な習慣コーチです。
以下の習慣データをもとにアドバイスしてください。

${habits.map((h: any) => h.name).join(", ")}
`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await res.json();

  console.log("OpenAIレスポンス:", data); // ←これ追加

  return new Response(JSON.stringify(data));
}