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
    this.#element.addEventListener("click", this.#closeFullImage.bind(this));
  }

  set photo(thumbnail: Thumbnail) {
    this.#thumbnail = thumbnail;
    this.#imageElement.src = thumbnail.fullSizeImagePath;
    this.#imageElement.alt = thumbnail.altAttribute;
    this.#captionElement.textContent = thumbnail.altAttribute;
    this.#updatePhotoOrientation();
  }

  showModal() {
    this.#element.showModal();
  }

  #closeFullImage() {
    const transition = document.startViewTransition({
      update: () => {
        // Hide the dialog
        this.#element.close();
        this.#thumbnail!.viewTransitionName = "photo";
      },
      types: ["shrink"],
    });
    transition.finished.finally(() => {
      this.#thumbnail!.viewTransitionName = "";
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
}
