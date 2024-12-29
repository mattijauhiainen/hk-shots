import type { ExpandedPhoto } from "./ExpandedPhoto";

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
      this.#preloadFullImage.bind(this)
    );
    this.#element.addEventListener("click", () => this.displayFullImage());
  }

  get filename() {
    return this.#element.getAttribute("data-filename")!;
  }

  get fullSizeImagePath() {
    return `/images/${this.filename}`;
  }

  get altAttribute() {
    return this.#imageElement.getAttribute("alt")!;
  }

  get isVertical() {
    return this.#element.getAttribute("data-is-vertical") === "true";
  }

  set viewTransitionName(name: string) {
    this.#imageElement.style.viewTransitionName = name;
  }

  #preloadFullImage() {
    const href = `${window.origin}/${this.fullSizeImagePath}`;
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
    document.head.appendChild($preloadLink);
  }

  displayFullImage({ transitionType = "expand" } = {}) {
    // Update the expanded photo to contain the clicked photo
    this.#expandedPhoto.photo = this;

    // Set the transition name and start the transition
    this.viewTransitionName = "photo";
    const domUpdate = () => {
      this.viewTransitionName = "";
      this.#expandedPhoto.showModal();
    };
    return document.startViewTransition({
      // @ts-expect-error
      update: domUpdate,
      types: [transitionType],
    }).finished;
  }
}
