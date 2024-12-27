import { ExpandedPhoto } from "./ExpandedPhoto";
import { photoData } from "./photoData";
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
  document.querySelector(".photo-grid")!.append(...$photos);
  const expandedPhoto = new ExpandedPhoto(
    document.querySelector<HTMLDialogElement>("#expanded-photo-container")!
  );
  Array.from(document.querySelectorAll<HTMLLinkElement>(".photo-grid a")).map(
    ($thumbnailElement) => new Thumbnail($thumbnailElement, expandedPhoto)
  );
});
