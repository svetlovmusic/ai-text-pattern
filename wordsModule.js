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
  // Очищаем контейнер
  container.textContent = "";

  // Берём реальную область контейнера
  const containerRect = container.getBoundingClientRect();
  const containerWidth = containerRect.width;
  const containerHeight = containerRect.height;

  // Фрагмент для сборки
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < lineCount; i++) {
	// Копируем и перемешиваем исходные слова
	const tempWords = [...words];
	shuffleArray(tempWords);

	// Создаём «тестовый» span для измерений
	const testSpan = document.createElement("span");
	testSpan.className = "word";
	testSpan.style.visibility = "hidden";
	testSpan.style.position = "absolute";
	fragment.appendChild(testSpan);

	// Создаём первую строку
	let lineDiv = document.createElement("div");
	lineDiv.className = "pattern-line";
	fragment.appendChild(lineDiv);

	let currentLineWidth = 0;

	for (const word of tempWords) {
	  // Ставим слово в testSpan, меряем
	  testSpan.textContent = word + " ";
	  const testWordWidth = testSpan.offsetWidth;

	  // Проверяем, входит ли слово в текущую строку
	  if (currentLineWidth + testWordWidth > containerWidth) {
		// Переходим на новую строку
		lineDiv = document.createElement("div");
		lineDiv.className = "pattern-line";
		fragment.appendChild(lineDiv);
		currentLineWidth = 0;
	  }

	  // Добавляем «реальное» слово в строку
	  const realSpan = document.createElement("span");
	  realSpan.className = "word";
	  realSpan.innerHTML = word + " ";
	  lineDiv.appendChild(realSpan);

	  // Обновляем текущую ширину строки
	  currentLineWidth += testWordWidth;

	  // Теперь проверим, не вылезла ли строка за пределы высоты
	  const lineRect = lineDiv.getBoundingClientRect();
	  // lineRect.bottom – нижняя граница текущей строки
	  if (lineRect.bottom > containerRect.bottom) {
		// Если строка уже за пределами видимой зоны – убираем её и останавливаем цикл
		fragment.removeChild(lineDiv);
		break;
	  }
	}

	// Убираем testSpan
	fragment.removeChild(testSpan);
  }

  container.appendChild(fragment);

  // Запускаем анимацию или постепенное проявление, если требуется
  revealWords();
}

function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
	rect.bottom >= 0 &&
	rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
	rect.right >= 0 &&
	rect.left <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function revealWords() {
  const allWords = Array.from(document.querySelectorAll(".word"));
  const visibleWords = allWords.filter(isInViewport);
  const indices = Array.from({ length: visibleWords.length }, (_, i) => i);

  shuffleArray(indices);

  let index = 0;
  const interval = setInterval(() => {
	if (index >= indices.length) {
	  clearInterval(interval);
	  return;
	}
	const wordIndex = indices[index];
	visibleWords[wordIndex].classList.add("show");
	index++;
  }, 50);
}