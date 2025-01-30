import { ExpandedPhoto } from "./ExpandedPhoto";
import { LeftArrow } from "./LeftArrow";
import { RightArrow } from "./RightArrow";
import { router } from "./router";
import { Thumbnail } from "./Thumbnail";

document.addEventListener("DOMContentLoaded", async () => {
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
  router.registerBackCallback((filename, { hasUAVisualTransition }) => {
    const thumbnail = thumbnails.find(
      (thumbnail) => thumbnail.filename === filename
    );
    if (!thumbnail) {
      expandedPhoto.closeFullImage({ skipTransition: hasUAVisualTransition });
    } else {
      thumbnail.displayFullImage({
        transitionType: "backward",
        skipTransition: hasUAVisualTransition,
      });
    }
  });
  router.registerForwardCallback((filename, { hasUAVisualTransition }) => {
    const thumbnail = thumbnails.find(
      (thumbnail) => thumbnail.filename === filename
    );
    if (!thumbnail) {
      expandedPhoto.closeFullImage({ skipTransition: hasUAVisualTransition });
    } else {
      thumbnail.displayFullImage({
        transitionType: "forward",
        skipTransition: hasUAVisualTransition,
      });
    }
  });
  router.registerOnPushCallback((filename) => {
    const thumbnailIndex = thumbnails.findIndex(
      (thumbnail) => thumbnail.filename === filename
    );
    thumbnails[thumbnailIndex + 1]?.preloadFullImage();
    thumbnails[thumbnailIndex - 1]?.preloadFullImage();
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
