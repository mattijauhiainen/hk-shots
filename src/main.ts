import { photoData } from "./photoData";

const $photos: HTMLElement[] = photoData.map((photo) => {
  return createThumbnail(
    photo.filename,
    `/images/thumbnails/${photo.filename}`,
    photo.alt,
    photo.isVertical ?? false
  );
});

document.addEventListener("DOMContentLoaded", () => {
  const $photoContainer = document.querySelector<HTMLDialogElement>(
    "#expanded-photo-container"
  )!;
  $photos.forEach((li) => {
    document.querySelector(".photo-grid")!.appendChild(li);
  });

  const $expandedPhoto = $photoContainer.querySelector("img")!;
  const $expandedPhotoCaption = $photoContainer.querySelector("figcaption")!;
  const $thumbnailElements = document.querySelectorAll(".photo-grid a");

  function handleThumbnailClick($thumbnailElement: Element) {
    $expandedPhoto.src =
      "images/" + $thumbnailElement.getAttribute("href")!.replace("#", "");
    $expandedPhoto.alt = $thumbnailElement.getAttribute("alt")!;
    $expandedPhoto.dataset.filename =
      $thumbnailElement.getAttribute("data-filename")!;
    $expandedPhoto.classList.remove("vertical");
    $expandedPhoto.classList.remove("horizontal");
    if ($thumbnailElement.getAttribute("data-is-vertical") === "true") {
      $expandedPhoto.classList.add("vertical");
    } else {
      $expandedPhoto.classList.add("horizontal");
    }
    $expandedPhotoCaption.textContent = $thumbnailElement
      .querySelector("img")!
      .getAttribute("alt")!;
    const $thumbnail = $thumbnailElement.querySelector("img")!;
    $thumbnail.style.viewTransitionName = "photo";
    document.startViewTransition({
      update: () => {
        $thumbnail.style.viewTransitionName = "";
        $photoContainer.showModal();
      },
      types: ["expand"],
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
    const $thumbnailElement = Array.from($thumbnailElements).find((element) => {
      const filename = element.getAttribute("data-filename");
      return filename === $expandedPhoto.dataset.filename;
    });
    const $thumbnail = $thumbnailElement!.querySelector("img")!;
    const transition = document.startViewTransition({
      update: () => {
        // Hide the thing
        $photoContainer.close();
        $thumbnail.style.viewTransitionName = "photo";
      },
      types: ["shrink"],
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
