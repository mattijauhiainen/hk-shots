import { ExpandedPhoto } from "./ExpandedPhoto";
import { LeftArrow } from "./LeftArrow";
import { photoData } from "./photoData";
import { RightArrow } from "./RightArrow";
import { router } from "./router";
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

document.addEventListener("DOMContentLoaded", async () => {
  document.querySelector(".photo-grid")!.append(...$photos);
  const expandedPhoto = new ExpandedPhoto(
    document.querySelector<HTMLDialogElement>("#expanded-photo-container")!
  );
  const thumbnails = Array.from(
    document.querySelectorAll<HTMLLinkElement>(".photo-grid a")
  ).map(($thumbnailElement) => new Thumbnail($thumbnailElement, expandedPhoto));
  new RightArrow(thumbnails, expandedPhoto);
  new LeftArrow(thumbnails, expandedPhoto);

  const initialThumbnail = getInitialThumbnail(
    thumbnails,
    window.location.hash
  );
  if (initialThumbnail) {
    initialThumbnail
      .displayFullImage({ transitionType: "reload" })
      .finally(() => {
        // Show the main content after the transition has been executed
        document.querySelector("main")!.style.visibility = "visible";
      });
  } else {
    // If there was no initial thumbnail, show the main content immediately
    document.querySelector("main")!.style.visibility = "visible";
  }
  router.registerBackCallback((filename) => {
    const thumbnail = thumbnails.find(
      (thumbnail) => thumbnail.filename === filename
    );
    if (!thumbnail) {
      expandedPhoto.closeFullImage();
    } else {
      thumbnail.displayFullImage({ transitionType: "backward" });
    }
  });
  router.registerForwardCallback((filename) => {
    const thumbnail = thumbnails.find(
      (thumbnail) => thumbnail.filename === filename
    );
    if (!thumbnail) {
      expandedPhoto.closeFullImage();
    } else {
      thumbnail.displayFullImage({ transitionType: "forward" });
    }
  });
});

// If location hash contains a valid thumbnail name, return the thumbnail
function getInitialThumbnail(
  thumbnails: Thumbnail[],
  hash: string
): Thumbnail | undefined {
  // Remove the # character from the hashed string
  const filenameFromHash = hash.slice(1);
  return thumbnails.find(
    (thumbnail) => thumbnail.filename === filenameFromHash
  );
}
