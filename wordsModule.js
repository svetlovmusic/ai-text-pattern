// wordsModule.js

// Текущий набор слов
let words = [];

// Функция для перемешивания массива
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
	const j = (Math.random() * (i + 1)) | 0;
	[array[i], array[j]] = [array[j], array[i]];
  }
}

// Загрузка слов из файла (words.json) по сети
export function loadWordsFromJSON(url) {
  return fetch(url)
	.then((res) => res.json())
	.then((data) => {
	  words = data;
	  return data;
	})
	.catch((err) => {
	  console.error("Ошибка загрузки слов:", err);
	});
}

// Возвращает все текущие слова
export function getWords() {
  return words;
}

// Устанавливает слова извне (например, когда получаем их от API)
export function setWords(newWords) {
  words = newWords;
}

// Генерация повторяющихся линий со словами
export function generatePatternLines(lineCount, container) {
  container.textContent = "";
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < lineCount; i++) {
	const tempWords = [...words];
	shuffleArray(tempWords);

	const lineDiv = document.createElement("div");
	lineDiv.className = "pattern-line";

	tempWords.forEach((word) => {
	  const span = document.createElement("span");
	  span.className = "word";
	  span.textContent = word + " ";
	  lineDiv.appendChild(span);
	});

	fragment.appendChild(lineDiv);
  }

  container.appendChild(fragment);
  revealWords();
}

// Постепенное проявление слов
function revealWords() {
  const allWords = document.querySelectorAll(".word");
  const indices = Array.from({ length: allWords.length }, (_, i) => i);

  // Перемешиваем массив индексов
  shuffleArray(indices);

  let index = 0;
  const interval = setInterval(() => {
	if (index >= indices.length) {
	  clearInterval(interval);
	  return;
	}
	const wordIndex = indices[index];
	allWords[wordIndex].classList.add("show");
	index++;
  }, 100);
}