import { randomIntFromInterval, shuffle } from "@shared/utils";

interface Word {
  value: string;
  usedCount: number;
  errors: number;
  letters: string[];
  shuffledLetters: string[];
}

type Options = {
  taskCount?: number;
};

type GameServiceInterface = {
  letters: string[];
  shuffledLetters: string[];
  currentWordErrorCount: number;
  totalErrorCount: number;
  wordsCount: number;
  mostErrorWord: string;
  wordCountWithoutError: number;
  increaseErrorCount: () => number;
  checkLetter: (letter: string) => boolean;
  getNewWord: () => string;
};

export class GameService implements GameServiceInterface {
  words: Record<string, Word> = {};
  currentWord: Word = null;
  passedCount: number = 0;

  constructor(words: string[], opts: Options) {
    const shuffledWords = shuffle(words).slice(0, opts.taskCount);

    shuffledWords.forEach((word) => {
      this.words[word] = {
        value: word,
        usedCount: 0,
        errors: 0,
        letters: word.split(""),
        shuffledLetters: shuffle(word.split("")),
      };
    });
  }

  private setRandomWord() {
    const unusedWords = Object.values(this.words)
      .filter((word) => word.usedCount == 0)
      .map((word) => word);

    const wordsCount = unusedWords.length;

    if (wordsCount === 0) {
      return null;
    }

    const randomIndex = randomIntFromInterval(0, wordsCount - 1);
    const word = unusedWords[randomIndex];

    word.usedCount += 1;
    this.currentWord = word;
    return word.value;
  }

  get letters() {
    if (!this.currentWord) {
      this.getNewWord();
    }

    return this.currentWord.letters;
  }

  get shuffledLetters() {
    if (!this.currentWord) {
      this.getNewWord();
    }
    return this.currentWord.shuffledLetters;
  }

  get currentWordErrorCount() {
    return this.currentWord.errors;
  }

  get totalErrorCount() {
    return Object.values(this.words).reduce(
      (total, word) => total + word.errors,
      0
    );
  }

  get wordsCount() {
    return Object.keys(this.words).length;
  }

  get mostErrorWord() {
    const mostErrorsWord = Object.values(this.words).reduce((max, word) => {
      if (!max && word.errors > 0) {
        max = word;
      }

      if (word.errors > max?.errors) {
        max = word;
      }
      return max;
    }, null);

    return mostErrorsWord?.value;
  }

  get wordCountWithoutError() {
    const wordsWithoutError = Object.values(this.words).filter(
      (word) => word.errors === 0
    );

    return wordsWithoutError.length;
  }

  increaseErrorCount() {
    this.currentWord.errors += 1;
    return this.currentWord.errors;
  }

  checkLetter(letter: string) {
    const correctLetter = this.currentWord.letters[0];

    if (correctLetter === letter.toLowerCase()) {
      this.currentWord.letters.shift();
      return true;
    } else {
      this.increaseErrorCount();
      return false;
    }
  }

  getNewWord() {
    if (this.currentWord) {
      this.words[this.currentWord.value] = this.currentWord;
    }

    this.passedCount++;

    const word = this.setRandomWord();
    return word;
  }
}
