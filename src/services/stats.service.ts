type Stats = {
  wordsWithoutError: number;
  errorCount: number;
  mostErrorWord: string;
};

interface StatsServiceInterface {
  draw: (stats: Stats) => void;
  show: () => void;
  hide: () => void;
}
export class StatsService implements StatsServiceInterface {
  container: HTMLElement;
  body: HTMLElement;

  constructor(container: HTMLElement, body: HTMLElement) {
    this.container = container;
    this.body = body;
  }

  draw(stats: Stats) {
    const { mostErrorWord, errorCount, wordsWithoutError } = stats;

    const fragment = document.createDocumentFragment();
    const wordsWithoutErrorsEl = Object.assign(document.createElement("span"), {
      innerHTML: `Words without error: <b>${wordsWithoutError}</b>`,
    });
    const errorsCountEl = Object.assign(document.createElement("span"), {
      innerHTML: `Total errors: <b>${errorCount}</b>`,
    });

    if (mostErrorWord) {
      const mostErrorsWordsEl = Object.assign(document.createElement("span"), {
        innerHTML: `Most errors word: <b>${stats.mostErrorWord}</b>`,
      });
      fragment.appendChild(mostErrorsWordsEl);
    }

    fragment.appendChild(wordsWithoutErrorsEl);
    fragment.appendChild(errorsCountEl);

    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.code === "Escape" || e.code === "Enter") {
        this.hide();
        window.location.reload();
      }
    });

    this.body.appendChild(fragment);
  }

  show() {
    this.container.classList.add("show");
    this.container.style.display = "block";
  }

  hide() {
    this.container.classList.remove("show");
    this.container.style.display = "none";
  }
}
