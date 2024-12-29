import type { ExpandedPhoto } from "./ExpandedPhoto";
import type { Thumbnail } from "./Thumbnail";

export class LeftArrow {
  #thumbnails: Thumbnail[];
  #expandedPhoto: ExpandedPhoto;

  constructor(thumbnails: Thumbnail[], expandedPhoto: ExpandedPhoto) {
    this.#thumbnails = thumbnails;
    this.#expandedPhoto = expandedPhoto;
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft" && this.#expandedPhoto.isVisible) {
        event.preventDefault();
        event.stopPropagation();
        this.#showPrevious();
      }
    });
  }

  #showPrevious() {
    const currentIndex = this.#thumbnails.findIndex(
      (thumbnail) => thumbnail.filename === this.#expandedPhoto.filename
    );
    if (currentIndex <= 0) {
      return;
    }

    const previousIndex = currentIndex - 1;
    document.startViewTransition({
      update: () => {
        this.#expandedPhoto.photo = this.#thumbnails[previousIndex];
      },
      types: ["backward"],
    });
  }
}
