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
    this.#captionElement.textContent =
      thumbnail.altAttribute + " 2024 Matti Jauhiainen. All rights reserved";
    this.#updatePhotoOrientation();
  }

  showModal() {
    // Prevent body scroll when dialog is open by making body fixed and setting
    // its top to current scroll top
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    this.#element.showModal();
  }

  #closeFullImage() {
    const transition = document.startViewTransition({
      update: () => {
        // Setting the location.hash will scroll to document top,
        // this needs to happen before restoring the body scroll
        window.location.hash = "";
        // Restore body scroll and set scroll to previous position
        const scrollY = document.body.style.top;
        document.body.style.position = "";
        document.body.style.top = "";
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
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
