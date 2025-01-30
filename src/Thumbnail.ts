import type { ExpandedPhoto } from "./ExpandedPhoto";
import { getSrcset } from "./getSrcset";
import { router } from "./router";

export class Thumbnail {
  #element: HTMLLinkElement;
  #imageElement: HTMLImageElement;
  #expandedPhoto: ExpandedPhoto;

  constructor($element: HTMLLinkElement, expandedPhoto: ExpandedPhoto) {
    this.#element = $element;
    this.#expandedPhoto = expandedPhoto;
    this.#imageElement = $element.querySelector<HTMLImageElement>("img")!;
    this.#element.addEventListener(
      "mouseover",
      this.preloadFullImage.bind(this)
    );
    this.#element.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.displayFullImage();
      router.push(this.filename);
    });
  }

  get filename() {
    return this.#element.getAttribute("data-filename")!;
  }

  get fullSizeImagePath() {
    return `images/${this.filename}`;
  }

  get altAttribute() {
    return this.#imageElement.getAttribute("alt")!;
  }

  get isVertical() {
    return this.#element.getAttribute("data-is-vertical") === "true";
  }

  get width() {
    const width = parseInt(this.#element.getAttribute("data-width") ?? "");
    if (!(width > 0)) {
      throw new Error("Invalid width");
    }
    return width;
  }

  get height() {
    const height = parseInt(this.#element.getAttribute("data-height") ?? "");
    if (!(height > 0)) {
      throw new Error("Invalid height");
    }
    return height;
  }

  get aspectRatio() {
    return `${this.width} / ${this.height}`;
  }

  set viewTransitionName(name: string) {
    this.#imageElement.style.viewTransitionName = name;
  }

  preloadFullImage() {
    const href = `${window.origin}${this.fullSizeImagePath}`;
    if (
      document.querySelectorAll(`link[rel="preload"][href="${href}"]`).length >
      0
    ) {
      return;
    }
    const $preloadLink = document.createElement("link");
    $preloadLink.rel = "preload";
    $preloadLink.as = "image";
    $preloadLink.href = href;
    $preloadLink.imageSizes = "(min-width: 1800px) 1800px, 100vw";
    $preloadLink.imageSrcset = getSrcset(this.fullSizeImagePath);
    document.head.appendChild($preloadLink);
  }

  displayFullImage({ transitionType = "expand", skipTransition = false } = {}) {
    // Set the transition name and start the transition
    if (!skipTransition) this.viewTransitionName = "photo";
    const domUpdate = () => {
      // Update the expanded photo to contain the clicked photo
      this.#expandedPhoto.photo = this;
      this.#expandedPhoto.showModal();
    };
    if (skipTransition) {
      domUpdate();
      return Promise.resolve();
    }
    return document
      .startViewTransition({
        // @ts-expect-error
        update: domUpdate,
        types: [transitionType],
      })
      .finished.then(() => {
        this.viewTransitionName = "";
      });
  }
}
