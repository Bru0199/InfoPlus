// test-chat.ts
async function testChat() {
  console.log("🚀 Starting AI Chat Test...");

  try {
    const response = await fetch("http://localhost:4000/api/chat/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // PASTE YOUR COOKIE HERE from the browser
        Cookie:
          "connect.sid=s%3AEgNAzxWjJffgzK5ZUD74xSdpDfoIyNLU.4aQISgD7HlG%2BtRYss%2FFKqAInrO9r8n1AkQU5zQVBpro",
      },
      body: JSON.stringify({
        conversationId: "vscode-test-001",
        messages: [
          { role: "user", content: "Hi Gemini, tell me a short dev joke." },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Error ${response.status}:`, errorText);
      return;
    }

    // Since it is a stream, we read chunks
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    console.log("🤖 AI Response:");
    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;
      process.stdout.write(decoder.decode(value)); // Prints chunks without newlines
    }
    console.log("\n✅ Test Complete.");
  } catch (err) {
    console.error("❌ Fetch failed:", err);
  }
}

testChat();

// npx ts-node tests/integration/test-chat.ts
