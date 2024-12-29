import { ExpandedPhoto } from "./ExpandedPhoto";
import { LeftArrow } from "./LeftArrow";
import { photoData } from "./photoData";
import { RightArrow } from "./RightArrow";
import { Thumbnail } from "./Thumbnail";

const $photos: HTMLElement[] = photoData.map((photo) => {
  return createThumbnail(
    photo.filename,
    `/images/thumbnails/${photo.filename}`,
    photo.alt,
    photo.isVertical ?? false
  );
});

function createThumbnail(
  filename: string,
  fullPath: string,
  altText: string,
  isVertical: boolean
): HTMLLIElement {
  const li = document.createElement("li");
  li.innerHTML = `
			<a href="#${filename}" data-filename="${filename}" data-is-vertical="${isVertical}">
				<img
					src="${fullPath}"
					alt="${altText}"
				/>
			</a>
		`;
  return li;
}

document.addEventListener("DOMContentLoaded", () => {
  // TODO: Animate also on first load somehow
  // TODO: Handle esc when dialog is open
  document.querySelector(".photo-grid")!.append(...$photos);
  const expandedPhoto = new ExpandedPhoto(
    document.querySelector<HTMLDialogElement>("#expanded-photo-container")!
  );
  const thumbnails = Array.from(
    document.querySelectorAll<HTMLLinkElement>(".photo-grid a")
  ).map(($thumbnailElement) => new Thumbnail($thumbnailElement, expandedPhoto));
  new RightArrow(thumbnails, expandedPhoto);
  new LeftArrow(thumbnails, expandedPhoto);
  if (window.location.hash) {
    // Remove the # character
    const filenameFromHash = window.location.hash.slice(1);
    thumbnails
      .find((thumbnail) => thumbnail.filename === filenameFromHash)
      ?.displayFullImage({ skipTransition: true });
  }
});
