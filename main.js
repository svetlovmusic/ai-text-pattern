// main.js
import { loadWordsFromJSON, generatePatternLines } from "./wordsModule.js";
import { getTextColorForBackground } from "./colorUtils.js";
import { generateFromTheme } from "./themeGenerator.js";

const bgColorPicker = document.getElementById("bgColorPicker");
const themeInput = document.getElementById("themeInput");
const generateButton = document.getElementById("generateButton");
const patternContainer = document.getElementById("pattern-container");

// Загрузка слов из файла и первая генерация паттерна
loadWordsFromJSON("words.json").then(() => {
  generatePatternLines(20, patternContainer);
});

// Начальная генерация (на случай, если нужно показать сразу без загрузки)
generatePatternLines(20, patternContainer);

// Меняем цвет фона и цвет текста при выборе нового цвета
function updateBodyColors(bgColor) {
  document.body.style.backgroundColor = bgColor;
  document.body.style.color = getTextColorForBackground(bgColor);
}
bgColorPicker.addEventListener("input", (e) => {
  updateBodyColors(e.target.value);
});
updateBodyColors(bgColorPicker.value);

// Генерация новых слов по введённой теме
generateButton.addEventListener("click", () => {
  const theme = themeInput.value.trim();
  generateFromTheme(theme, patternContainer);
});