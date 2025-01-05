type PopstateCallback = (
  filename: string,
  opts: { hasUAVisualTransition?: boolean }
) => void;

class Router {
  #previousState = new Date();
  #backCallbacks: PopstateCallback[] = [];
  #forwardCallbacks: PopstateCallback[] = [];
  #pushCallbacks: ((filename: string) => void)[] = [];

  constructor() {
    window.addEventListener("popstate", (event) => {
      const filename = location.hash.slice(1);
      const diff = event.state.valueOf() - this.#previousState.valueOf();

      if (diff > 0) {
        this.#forwardCallbacks.forEach((callback) =>
          callback(filename, {
            hasUAVisualTransition: event.hasUAVisualTransition,
          })
        );
      } else {
        this.#backCallbacks.forEach((callback) =>
          callback(filename, {
            hasUAVisualTransition: event.hasUAVisualTransition,
          })
        );
      }
      this.#previousState = history.state;
    });
  }

  registerBackCallback(callback: PopstateCallback) {
    this.#backCallbacks.push(callback);
  }

  registerForwardCallback(callback: PopstateCallback) {
    this.#forwardCallbacks.push(callback);
  }

  registerOnPushCallback(callback: (filename: string) => void) {
    this.#pushCallbacks.push(callback);
  }

  push(filename: string) {
    this.#previousState = new Date();
    history.pushState(this.#previousState, "", "#" + filename);
    this.#pushCallbacks.forEach((callback) => callback(filename));
  }
}

export const router = new Router();
