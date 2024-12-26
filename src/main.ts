document.addEventListener("DOMContentLoaded", () => {
  const $photoContainer = document.querySelector<HTMLDialogElement>(
    "#expanded-photo-container"
  )!;
  $photoContainer.close();
  const $expandedPhoto = $photoContainer.querySelector("img")!;
  const $thumbnailElements = document.querySelectorAll(".photo-grid a");

  async function handleThumbnailClick($thumbnailElement: Element) {
    $expandedPhoto.src = $thumbnailElement
      .getAttribute("href")!
      .replace("#", "");
    $expandedPhoto.alt = $thumbnailElement.getAttribute("alt")!;
    const $thumbnail = $thumbnailElement.querySelector("img")!;
    $thumbnail.style.viewTransitionName = "photo";
    document.startViewTransition(() => {
      $thumbnail.style.viewTransitionName = "";
      $photoContainer.showModal();
    });
  }

  function handleThumbnailHover($thumbnailElement: Element) {
    const href = $thumbnailElement.getAttribute("href")!.replace("#", "");
    if (
      document.querySelectorAll(`link[rel="preload"][href="${href}"]`).length >
      0
    ) {
      return;
    }
    const $preloadLink = document.createElement("link");
    $preloadLink.rel = "preload";
    $preloadLink.as = "image";
    $preloadLink.href = href;
    document.head.appendChild($preloadLink);
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
    $thumbnailElement.addEventListener("mouseover", (_event) => {
      handleThumbnailHover($thumbnailElement);
    });
  });
});
