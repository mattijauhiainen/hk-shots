type Photo = {
  filename: string;
  alt: string;
  caption: string;
};
const photoData: Photo[] = [
  {
    filename: "austin-taxis.avif",
    alt: "Taxis in intersection in Austin, Kowloon",
    caption: "Taxis in intersection in Austin, Kowloon",
  },
  {
    filename: "ham-tin-lanterns.avif",
    alt: "Lanterns in Ham Tin, Sai Kung",
    caption: "Lanterns in Ham Tin, Sai Kung",
  },
  {
    filename: "jordan-minibus.avif",
    alt: "Minibus in Jordan, Kowloon",
    caption: "Minibus in Jordan, Kowloon",
  },
  {
    filename: "jordan-school.avif",
    alt: "School from above in Jordan, Kowloon",
    caption: "School from above in Jordan, Kowloon",
  },
  {
    filename: "lamma-lizard.avif",
    alt: "Man with a pet lizard, Lamma Island",
    caption: "Man with a pet lizard, Lamma Island",
  },
  {
    filename: "mei-foo-icc.avif",
    alt: "International Commerce Center in dusk, Mei Foo, Kowloon",
    caption: "International Commerce Center in dusk, Mei Foo, Kowloon",
  },
  {
    filename: "sham-shui-po-men.avif",
    alt: "Men reading newspapers in Sham Shui Po, Kowloon",
    caption: "Men reading newspapers in Sham Shui Po, Kowloon",
  },
  {
    filename: "tai-mo-shan-clouds.avif",
    alt: "City covered in clouds from Tai Mo Shan, New Territories",
    caption: "City covered in clouds from Tai Mo Shan, New Territories",
  },
  {
    filename: "taxis-tst.avif",
    alt: "Taxis at night in Tsim Sha Tsui, Kowloon",
    caption: "Taxis at night in Tsim Sha Tsui, Kowloon",
  },
  {
    filename: "victoria-harbour-buoy.avif",
    alt: "Buoy in Victoria Harbour, Hong Kong",
    caption: "Buoy in Victoria Harbour, Hong Kong",
  },
];

const $photos: HTMLElement[] = photoData.map((photo) => {
  return createThumbnail(
    photo.filename,
    `/images/thumbnails/${photo.filename}`,
    photo.alt
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

  async function handleThumbnailClick($thumbnailElement: Element) {
    $expandedPhoto.src =
      "images/" + $thumbnailElement.getAttribute("href")!.replace("#", "");
    $expandedPhoto.alt = $thumbnailElement.getAttribute("alt")!;
    $expandedPhoto.dataset.filename =
      $thumbnailElement.getAttribute("data-filename")!;
    $expandedPhotoCaption.textContent = $thumbnailElement
      .querySelector("img")!
      .getAttribute("alt")!;
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
    const $thumbnailElement = Array.from($thumbnailElements).find((element) => {
      const filename = element.getAttribute("data-filename");
      return filename === $expandedPhoto.dataset.filename;
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

function createThumbnail(
  filename: string,
  fullPath: string,
  altText: string
): HTMLLIElement {
  const li = document.createElement("li");
  li.innerHTML = `
			<a href="#${filename}" data-filename="${filename}">
				<img
					src="${fullPath}"
					alt="${altText}"
				/>
			</a>
		`;
  return li;
}
