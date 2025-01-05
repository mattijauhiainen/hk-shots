import { router } from "./router";
import type { Thumbnail } from "./Thumbnail";

export class ExpandedPhoto {
  #element: HTMLDialogElement;
  #imageElement: HTMLImageElement;
  #captionElement: HTMLElement;
  #thumbnail?: Thumbnail;

  constructor(element: HTMLDialogElement) {
    this.#element = element;
    this.#imageElement = element.querySelector<HTMLImageElement>("img")!;
    this.#captionElement = element.querySelector<HTMLElement>("figcaption")!;
    this.#element.addEventListener("click", () => this.closeFullImage());
    this.#element.addEventListener("keydown", this.#handleKeyDown.bind(this));
  }

  set photo(thumbnail: Thumbnail | undefined) {
    this.#thumbnail = thumbnail;
    if (this.#thumbnail === undefined) {
      this.#imageElement.src = "";
      this.#imageElement.alt = "";
      this.#imageElement.style.aspectRatio = "";
      this.#captionElement.textContent = "";
      return;
    }
    this.#imageElement.style.aspectRatio = this.#thumbnail.aspectRatio;
    this.#imageElement.src = this.#thumbnail.fullSizeImagePath;
    this.#imageElement.alt = this.#thumbnail.altAttribute;
    this.#captionElement.textContent =
      this.#thumbnail.altAttribute +
      " 2024 Matti Jauhiainen. All rights reserved";
    this.#updatePhotoOrientation();
  }

  get filename() {
    return this.#thumbnail?.filename;
  }

  get isVisible() {
    return !!this.#thumbnail;
  }

  showModal() {
    // Prevent body scroll when dialog is open by making body fixed and setting
    // its top to current scroll top
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0px";
    document.body.style.right = "0px";
    this.#element.showModal();
  }

  closeFullImage({ skipTransition = false } = {}) {
    const domUpdate = () => {
      const scrollY = document.body.style.top;
      // Setting the location.hash will scroll to document top,
      // this needs to happen before restoring the body scroll
      router.push("");
      // Restore body scroll and set scroll to previous position
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      this.#element.close();
      if (!skipTransition) this.#thumbnail!.viewTransitionName = "photo";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    };
    if (skipTransition) {
      domUpdate();
      this.photo = undefined;
    }

    const transition = document.startViewTransition({
      // @ts-expect-error
      update: domUpdate,
      types: ["shrink"],
    });
    transition.finished.finally(() => {
      this.#thumbnail!.viewTransitionName = "";
      this.photo = undefined;
    });
  }

  #updatePhotoOrientation() {
    this.#imageElement.classList.remove("horizontal");
    this.#imageElement.classList.remove("vertical");
    if (this.#thumbnail!.isVertical) {
      this.#imageElement.classList.add("vertical");
    } else {
      this.#imageElement.classList.add("horizontal");
    }
  }

  #handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      this.closeFullImage();
    }
  }
}
