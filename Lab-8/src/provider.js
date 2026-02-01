const axios = require("axios");

exports.askAI = async (prompt) => {
  const apiKey = process.env.OPENAI_API_KEY;
  const endpoint = "https://api.openai.com/v1/chat/completions";

  try {
    const response = await axios.post(
      endpoint,
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Answer very briefly (max 100 characters)." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 50,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    let text = response.data.choices[0].message.content.trim();
    if (text.length > 100) text = text.slice(0, 97) + "...";
    return text;
  } catch (error) {
    const msg = error.response?.data?.error?.message || error.message;
    throw new Error(`OpenAI error: ${msg}`);
  }
};
