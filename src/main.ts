document.addEventListener("DOMContentLoaded", () => {
  const $photoContainer = document.querySelector("#expanded-photo-container")!;
  const $expandedPhoto = $photoContainer.querySelector("img")!;
  const $thumbnailElements = document.querySelectorAll(".photo-grid a");

  async function handleThumbnailClick($thumbnailElement: Element) {
    $expandedPhoto.src = $thumbnailElement
      .getAttribute("href")!
      .replace("#", "");
    $expandedPhoto.alt = $thumbnailElement.getAttribute("alt")!;
    await new Promise<void>((resolve) => {
      $expandedPhoto.onload = () => {
        console.log("Image loaded");
        resolve();
      };
    });

    const $thumbnail = $thumbnailElement.querySelector("img")!;
    $thumbnail.style.viewTransitionName = "photo";
    document.startViewTransition(() => {
      $thumbnail.style.viewTransitionName = "";
      $photoContainer.show();
    });
  }
  function hidePhoto() {
    const targetLink = `#${$expandedPhoto.src.replace(
      window.origin + "/",
      ""
    )}`;
    const $thumbnailElement = Array.from($thumbnailElements).find((element) => {
      const link = element.getAttribute("href");
      return link === targetLink;
    });
    const $thumbnail = $thumbnailElement!.querySelector("img")!;
    const transition = document.startViewTransition(() => {
      // Hide the thing
      $photoContainer.close();
      $thumbnail.style.viewTransitionName = "photo";
    });
    transition.finished.finally(() => {
      $thumbnail.style.viewTransitionName = "";
    });
  }
  $photoContainer.addEventListener("click", (_event) => {
    hidePhoto();
  });

  $thumbnailElements.forEach(($thumbnailElement) => {
    $thumbnailElement.addEventListener("click", (_event) => {
      handleThumbnailClick($thumbnailElement);
    });
  });
});
