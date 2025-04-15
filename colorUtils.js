// colorUtils.js

// Рассчитывает яркость фонового цвета
export function getLuminance(hex) {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

// Возвращает более читаемый цвет текста
export function getTextColorForBackground(hex) {
  return getLuminance(hex) > 0.6 ? "#666666" : "#eeeeee";
}