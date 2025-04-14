// themeGenerator.js
import { setWords, generatePatternLines } from "./wordsModule.js";

export async function generateFromTheme(theme, container) {
  if (!theme) return;

  let OPENAI_API_KEY = localStorage.getItem("openai_token");
  if (!OPENAI_API_KEY) {
	OPENAI_API_KEY = prompt("Введите API токен (sk-...)");
	if (OPENAI_API_KEY) {
	  localStorage.setItem("openai_token", OPENAI_API_KEY);
	} else {
	  return;
	}
  }

  try {
	const response = await fetch("https://api.openai.com/v1/chat/completions", {
	  method: "POST",
	  headers: {
		"Content-Type": "application/json",
		Authorization: `Bearer ${OPENAI_API_KEY}`,
	  },
	  body: JSON.stringify({
		model: "gpt-4o",
		response_format: { type: "json_object" },
		messages: [
		  {
			role: "system",
			content: "You are a helpful assistant that responds in JSON format.",
		  },
		  {
			role: "user",
			content: `Generate a JSON object with the key "words" that contains an array of 100 words related to the theme: ${theme}. Ensure the response is valid JSON and do not include any additional text or formatting outside the object.`,
		  },
		],
		temperature: 0.7,
	  }),
	});

	if (!response.ok) {
	  console.log("Ошибка при запросе:", response.status);
	  return;
	}

	const data = await response.json();
	// Ожидаем, что data.choices[0].message.content будет строкой с JSON
	const generatedContent = JSON.parse(data.choices[0].message.content);

	// Устанавливаем новые слова и перегенерируем линии
	setWords(generatedContent.words);
	generatePatternLines(100, container);
  } catch (error) {
	console.log("Ошибка:", error);
  }
}