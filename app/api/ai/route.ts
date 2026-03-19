export async function POST(req: Request) {
  try {
    const body = await req.json();
    const habits = body.habits ?? [];

 const prompt = `
あなたはプロの習慣コーチです。

以下の習慣を分析して、必ずこの形式で答えてください：

【良い点】
・

【改善点】
・

【明日やること】
・

習慣一覧：
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
    console.log("OpenAIレスポンス:", data);

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
      status: res.status,
    });
  } catch (error) {
    console.error("AI APIエラー:", error);

    return new Response(
      JSON.stringify({ error: { message: "サーバーでエラーが発生しました" } }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}