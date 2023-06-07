import { ExtendedButtonEvent } from "@services/button.service";
import { GameService } from "@services/game.service";
import { UIService } from "@services/ui.service";
import { StatsService } from "@services/stats.service";

import {
  ANSWER_CONTAINER_ID as RESULT_CONTAINER_ID,
  VARIANTS_CONTAINER_ID,
  CURRENT_QUESTION_CONTAINER_ID,
  TOTAL_QUESTIONS_CONTAINER_ID,
  MODAL_CONTAINER_ID,
  MODAL_BODY_CONTAINER_ID,
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
  const gameService = new GameService(words, { taskCount: 6 });

  const totalQuestionEl = document.getElementById(TOTAL_QUESTIONS_CONTAINER_ID);
  totalQuestionEl.innerHTML = `${gameService.wordsCount}`;

  uiService.setAnswerLetters(gameService.letters);
  uiService.setVariantLetters(gameService.shuffledLetters);

  const handleVariantClick = (e: ExtendedButtonEvent) => {
    const target = e.target;
    const value = e.target.dataset.value;

    const correctVariant = gameService.checkLetter(value);
    const errorCount = gameService.currentWordErrorCount;

    if (errorCount === 3) {
      uiService.getCorrectOrder();
    }

    if (correctVariant) {
      target.success();
    } else {
      target.error();
    }
  };

  uiService.setVariantClick(handleVariantClick);
  uiService.draw();

  const handleKeyboardEvent = (e: KeyboardEvent) => {
    const [, symbol] = e.code.split("Key");
    const lowerSymbol = symbol && symbol.toLowerCase();

    if (lowerSymbol && gameService.letters.includes(lowerSymbol)) {
      const variantElement = uiService.findVariantElement(lowerSymbol);
      const correctVariant = gameService.checkLetter(lowerSymbol);

      if (correctVariant) {
        variantElement.success();
      }
      if (gameService.currentWordErrorCount < 3) {
        variantElement.error();
      }
    } else {
      gameService.increaseErrorCount();
    }

    if (gameService.currentWordErrorCount === 3) {
      uiService.getCorrectOrder();
    }
  };

  document.addEventListener("keydown", handleKeyboardEvent);

  const interval = setInterval(() => {
    if (gameService.letters.length === 0) {
      if (gameService.getNewWord()) {
        uiService.setAnswerLetters(gameService.letters);
        uiService.setVariantLetters(gameService.shuffledLetters);
        uiService.draw();

        const currentQuestionEl = document.getElementById(
          CURRENT_QUESTION_CONTAINER_ID
        );
        currentQuestionEl.innerHTML = `${gameService.passedCount}`;
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
