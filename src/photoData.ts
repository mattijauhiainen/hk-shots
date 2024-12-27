type Photo = {
  filename: string;
  alt: string;
  caption: string;
  isVertical?: boolean;
};
export const photoData: Photo[] = [
  {
    filename: "austin-taxis.avif",
    alt: "Taxis in an intersection in Austin, Kowloon",
    caption: "Taxis in an intersection in Austin, Kowloon",
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
    isVertical: true,
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
    isVertical: true,
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
    isVertical: true,
  },
  {
    filename: "victoria-harbour-buoy.avif",
    alt: "Buoy in Victoria Harbour, Hong Kong",
    caption: "Buoy in Victoria Harbour, Hong Kong",
  },
];
