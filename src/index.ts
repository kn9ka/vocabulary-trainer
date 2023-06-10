import type { ExtendedButtonEvent } from "@services/button.service";
import { GameService } from "@services/game.service";
import { UIService } from "@services/ui.service";
import { StatsService } from "@services/stats.service";

import {
  RESULT_CONTAINER_ID,
  VARIANTS_CONTAINER_ID,
  CURRENT_QUESTION_CONTAINER_ID,
  TOTAL_QUESTIONS_CONTAINER_ID,
  MODAL_CONTAINER_ID,
  MODAL_BODY_CONTAINER_ID,
  TASK_COUNT,
} from "@shared/constants";

const words = [
  "apple",
  "function",
  "timeout",
  "task",
  "application",
  "data",
  "tragedy",
  "sun",
  "symbol",
  "button",
  "software",
];
const resultContainer = document.getElementById(RESULT_CONTAINER_ID);
const variantsContainer = document.getElementById(VARIANTS_CONTAINER_ID);

document.addEventListener("DOMContentLoaded", () => {
  game();
});

const game = () => {
  const uiService = new UIService(resultContainer, variantsContainer);
  const gameService = new GameService(words, { taskCount: TASK_COUNT });

  const totalQuestionCountEl = document.getElementById(
    TOTAL_QUESTIONS_CONTAINER_ID
  );
  totalQuestionCountEl.innerHTML = `${gameService.wordsCount}`;

  uiService.setAnswerLetters(gameService.letters);
  uiService.setVariantLetters(gameService.shuffledLetters);

  const handleVariantClick = (e: ExtendedButtonEvent) => {
    const currentVariantEl = e.target;
    const value = e.target.dataset.value;

    const isCorrectLetter = gameService.checkLetter(value);
    const currentErrorCount = gameService.currentWordErrorCount;

    if (isCorrectLetter) currentVariantEl.success();
    if (!isCorrectLetter && currentErrorCount < 3) currentVariantEl.error();
    if (currentErrorCount >= 3) uiService.getCorrectOrder();
  };

  uiService.setVariantClick(handleVariantClick);
  uiService.draw();

  const handleKeyboardEvent = (e: KeyboardEvent) => {
    const [, symbol] = e.code.split("Key");
    const lowerSymbol = symbol && symbol.toLowerCase();

    if (lowerSymbol && gameService.letters.includes(lowerSymbol)) {
      const variantEl = uiService.findVariantElement(lowerSymbol);
      const isCorrectLetter = gameService.checkLetter(lowerSymbol);
      const currentErrorCount = gameService.currentWordErrorCount;

      if (isCorrectLetter) variantEl.success();
      if (!isCorrectLetter && currentErrorCount < 3) variantEl.error();
      if (currentErrorCount >= 3) uiService.getCorrectOrder();
    } else {
      if (gameService.increaseErrorCount() >= 3) uiService.getCorrectOrder();
    }
  };

  document.addEventListener("keydown", handleKeyboardEvent);

  const interval = setInterval(() => {
    if (gameService.letters.length === 0) {
      if (gameService.getNewWord()) {
        uiService.setAnswerLetters(gameService.letters);
        uiService.setVariantLetters(gameService.shuffledLetters);
        uiService.draw();

        const currentQuestionNumberEl = document.getElementById(
          CURRENT_QUESTION_CONTAINER_ID
        );
        currentQuestionNumberEl.innerHTML = `${gameService.passedCount}`;
      } else {
        const modalContainer = document.getElementById(MODAL_CONTAINER_ID);
        const modalBody = document.getElementById(MODAL_BODY_CONTAINER_ID);
        const statsService = new StatsService(modalContainer, modalBody);

        statsService.draw({
          errorCount: gameService.totalErrorCount,
          mostErrorWord: gameService.mostErrorWord,
          wordsWithoutError: gameService.wordCountWithoutError,
        });
        statsService.show();

        clearInterval(interval);
      }
    }
  }, 1000);
};
