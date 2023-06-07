export {};

interface KeyboardLayoutMap {
  get(key: string): string;
}
interface NavigatorKeyboard {
  getLayoutMap: () => Promise<KeyboardLayoutMap>;
}

declare global {
  interface Navigator {
    // https://developer.mozilla.org/en-US/docs/Web/API/Keyboard_API
    readonly keyboard: NavigatorKeyboard;
  }
}
