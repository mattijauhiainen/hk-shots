import type { ExpandedPhoto } from "./ExpandedPhoto";
import { router } from "./router";
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

    const previousThumbnail = this.#thumbnails[currentIndex - 1];
    router.push(previousThumbnail.filename);
    document.startViewTransition({
      // @ts-expect-error
      update: () => {
        this.#expandedPhoto.photo = previousThumbnail;
      },
      types: ["backward"],
    });
  }
}
