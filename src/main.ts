document.addEventListener("DOMContentLoaded", () => {
  const $photoContainer = document.querySelector("#expanded-photo-container")!;
  const $expandedPhoto = $photoContainer.querySelector("img")!;
  const $thumbnailElements = document.querySelectorAll(".photo-grid a");

  function handleThumbnailClick($thumbnailElement: Element) {
    $expandedPhoto.src = $thumbnailElement
      .getAttribute("href")!
      .replace("#", "");
    $expandedPhoto.alt = $thumbnailElement.getAttribute("alt")!;
    const $thumbnail = $thumbnailElement.querySelector("img")!;
    $thumbnail.style.viewTransitionName = "photo";
    document.startViewTransition(() => {
      $thumbnail.style.viewTransitionName = "";
      $photoContainer.classList.add("visible");
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
      $photoContainer.classList.remove("visible");
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
