import {
  INVISIBLE_CLASS,
  BASE_CLASS,
  SUCCESS_CLASS,
  ERROR_CLASS,
} from "@shared/constants";

type CustomButton = {
  value: string;
  hide: () => void;
  show: () => void;
  success: () => void;
  error: () => void;
};

export type ExtendedHTMLButtonElement = HTMLButtonElement & CustomButton;

export type ExtendedButtonEvent = MouseEvent & {
  target: EventTarget & ExtendedHTMLButtonElement;
};

type CreateButtonParams = {
  value: string;
  visible: boolean;
  className?: string;
  onClick: (e: ExtendedButtonEvent) => void;
  onSuccess?: (element: ExtendedHTMLButtonElement) => void;
  onError?: (element: ExtendedHTMLButtonElement) => void;
};

interface ButtonServiceInterface {
  create: (params: CreateButtonParams) => ExtendedHTMLButtonElement;
}

export class ButtonService implements ButtonServiceInterface {
  private addSuccessClass(element: ExtendedHTMLButtonElement) {
    element.classList.add(SUCCESS_CLASS);
  }

  private toggleErrorClass(element: ExtendedHTMLButtonElement) {
    if (element.classList.contains(ERROR_CLASS)) {
      return;
    }

    element.classList.add(ERROR_CLASS);

    setTimeout(() => {
      element.classList.remove(ERROR_CLASS);
    }, 200);
  }

  private show(element: ExtendedHTMLButtonElement) {
    element.classList.remove(INVISIBLE_CLASS);
  }

  private hide(element: ExtendedHTMLButtonElement) {
    element.classList.add(INVISIBLE_CLASS);
  }

  create({
    value,
    visible,
    className,
    onClick,
    onSuccess,
    onError,
  }: CreateButtonParams) {
    let classNames = BASE_CLASS + " " + className;
    if (!visible) classNames += " " + INVISIBLE_CLASS;

    const baseOptions = {
      className: classNames,
      innerHTML: value,
      onclick: onClick,
    };

    const extendedOptions = {
      success: () => {
        if (typeof onSuccess === "function") {
          onSuccess(element);
        }
        this.addSuccessClass(element);
      },
      error: () => {
        if (typeof onError === "function") {
          onError(element);
        }
        this.toggleErrorClass(element);
      },
      hide: () => this.hide(element),
      show: () => this.show(element),
    };

    let element = Object.assign(document.createElement("button"), {
      ...baseOptions,
      ...extendedOptions,
    });

    element.setAttribute("data-value", value);
    return element;
  }
}
