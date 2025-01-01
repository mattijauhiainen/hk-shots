import type { ExpandedPhoto } from "./ExpandedPhoto";
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
      this.#preloadFullImage.bind(this)
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
    const href = `${window.origin}${this.fullSizeImagePath}`;
    if (
      document.querySelectorAll(`link[rel="prefetch"][href="${href}"]`).length >
      0
    ) {
      return;
    }
    const $preloadLink = document.createElement("link");
    $preloadLink.rel = "prefetch";
    $preloadLink.as = "image";
    $preloadLink.href = href;
    document.head.appendChild($preloadLink);
  }

  displayFullImage({ transitionType = "expand" } = {}) {
    // Set the transition name and start the transition
    this.viewTransitionName = "photo";
    const domUpdate = () => {
      this.viewTransitionName = "";
      // Update the expanded photo to contain the clicked photo
      this.#expandedPhoto.photo = this;
      this.#expandedPhoto.showModal();
    };
    return document.startViewTransition({
      // @ts-expect-error
      update: domUpdate,
      types: [transitionType],
    }).finished;
  }
}
