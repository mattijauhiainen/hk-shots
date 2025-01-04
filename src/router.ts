class Router {
  #previousState = new Date();
  #backCallbacks: ((filename: string) => void)[] = [];
  #forwardCallbacks: ((filename: string) => void)[] = [];
  #pushCallbacks: ((filename: string) => void)[] = [];

  constructor() {
    window.addEventListener("popstate", (event) => {
      const filename = location.hash.slice(1);
      const diff = event.state.valueOf() - this.#previousState.valueOf();

      if (diff > 0) {
        this.#forwardCallbacks.forEach((callback) => callback(filename));
      } else {
        this.#backCallbacks.forEach((callback) => callback(filename));
      }
      this.#previousState = history.state;
    });
  }

  registerBackCallback(callback: (filename: string) => void) {
    this.#backCallbacks.push(callback);
  }

  registerForwardCallback(callback: (filename: string) => void) {
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
