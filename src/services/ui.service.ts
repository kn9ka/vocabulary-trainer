import { ButtonService } from "./button.service";
import type {
  ExtendedButtonEvent,
  ExtendedHTMLButtonElement,
} from "./button.service";

import { INVISIBLE_CLASS, ERROR_CLASS, SUCCESS_CLASS } from "@shared/constants";

enum ContainerType {
  Variant = "variant",
  Answer = "answer",
}

type UIServiceInterface = {
  draw: () => void;
  clear: () => void;
  setAnswerLetters: (letters: string[]) => void;
  setVariantLetters: (letters: string[]) => void;
  setVariantClick: (callback: (e: ExtendedButtonEvent) => void) => void;
  getCorrectOrder: () => void;
  findVariantElement: (letter: string) => ExtendedHTMLButtonElement | null;
};

export class UIService implements UIServiceInterface {
  answerContainer: HTMLElement = null;
  variantsContainer: HTMLElement = null;
  elementService: ButtonService;

  answerLetters: string[] = [];
  variantLetters: string[] = [];

  onVariantChoose: (e: Event) => void;

  constructor(resultContainer: HTMLElement, variantsContainer: HTMLElement) {
    this.answerContainer = resultContainer;
    this.variantsContainer = variantsContainer;

    this.elementService = new ButtonService();
  }

  draw() {
    this.clear();
    const variantElements = this.createUIElements(
      this.variantLetters,
      ContainerType.Variant
    );
    this.variantsContainer.appendChild(variantElements);

    const answerElements = this.createUIElements(
      this.answerLetters,
      ContainerType.Answer
    );
    this.answerContainer.appendChild(answerElements);
  }

  clear() {
    while (this.variantsContainer.firstChild) {
      this.variantsContainer.removeChild(this.variantsContainer.lastChild);
    }
    while (this.answerContainer.firstChild) {
      this.answerContainer.removeChild(this.answerContainer.lastChild);
    }
  }

  setAnswerLetters(letters: string[]) {
    this.answerLetters = letters;
  }

  setVariantLetters(letters: string[]) {
    this.variantLetters = letters;
  }

  setVariantClick(callback: (e: ExtendedButtonEvent) => void) {
    this.onVariantChoose = callback;
  }

  getCorrectOrder() {
    const temp = [...this.answerLetters];
    const nodes = this.variantsContainer;

    nodes.childNodes.forEach((node) => {
      const element = node as HTMLElement;
      const value = element.getAttribute("data-value");
      const idx = temp.findIndex((letter) => letter === value);

      if (!element.classList.contains(INVISIBLE_CLASS)) {
        element.style.order = `${idx}`;
        element.classList.add(ERROR_CLASS);
        temp[idx] = null;
      }
    });
  }

  private createUIElements(letters: string[], type: ContainerType) {
    const fragment = document.createDocumentFragment();

    letters.forEach((letter) => {
      fragment.appendChild(
        this.elementService.create({
          value: letter,
          visible: type === ContainerType.Variant,
          className: type === ContainerType.Answer ? SUCCESS_CLASS : "",
          onSuccess: (currentElement) => {
            const answerEl = this.findAnswerElement(letter);

            currentElement.hide();
            answerEl?.show();
          },
          onError: (currentElement) => {},
          onClick: this.onVariantChoose,
        })
      );
    });

    return fragment;
  }

  private findAnswerElement(letter: string): ExtendedHTMLButtonElement | null {
    let answerElement: ExtendedHTMLButtonElement | null = null;

    for (let node of this.answerContainer.childNodes) {
      const element = node as ExtendedHTMLButtonElement;

      if (
        element.getAttribute("data-value") === letter &&
        element.classList.contains(INVISIBLE_CLASS)
      ) {
        return element;
      }
    }

    return answerElement;
  }

  findVariantElement(letter: string): ExtendedHTMLButtonElement | null {
    let variantElement: ExtendedHTMLButtonElement | null = null;
    for (let node of this.variantsContainer.childNodes) {
      const element = node as ExtendedHTMLButtonElement;

      if (
        element.getAttribute("data-value") === letter &&
        !element.classList.contains(INVISIBLE_CLASS)
      ) {
        return element;
      }
    }

    return variantElement;
  }
}
