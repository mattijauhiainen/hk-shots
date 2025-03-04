import { ExpandedPhoto } from "./ExpandedPhoto";
import { router } from "./router";
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

    const nextThumbnail = this.#thumbnails[currentIndex + 1];
    router.push(nextThumbnail.filename);
    const domUpdate = () => {
      this.#expandedPhoto.photo = nextThumbnail;
    };
    if (!document.startViewTransition) {
      domUpdate();
      return;
    }
    document.startViewTransition({
      // @ts-expect-error
      update: () => {
        this.#expandedPhoto.photo = nextThumbnail;
      },
      types: ["forward"],
    });
  }
}
