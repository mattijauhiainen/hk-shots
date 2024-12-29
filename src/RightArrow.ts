import { ExpandedPhoto } from "./ExpandedPhoto";
import { Thumbnail } from "./Thumbnail";

export class RightArrow {
  #thumbnails: Thumbnail[];
  #expandedPhoto: ExpandedPhoto;

  constructor(thumbnails: Thumbnail[], expandedPhoto: ExpandedPhoto) {
    this.#thumbnails = thumbnails;
    this.#expandedPhoto = expandedPhoto;
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight" && this.#expandedPhoto.isVisible) {
        event.preventDefault();
        event.stopPropagation();
        this.#showNext();
      }
    });
  }

  #showNext() {
    const currentIndex = this.#thumbnails.findIndex(
      (thumbnail) => thumbnail.filename === this.#expandedPhoto.filename
    );
    if (currentIndex === this.#thumbnails.length - 1) {
      return;
    }

    const nextIndex = (currentIndex + 1) % this.#thumbnails.length;
    document.startViewTransition({
      // @ts-expect-error
      update: () => {
        this.#expandedPhoto.photo = this.#thumbnails[nextIndex];
      },
      types: ["forward"],
    });
  }
}
