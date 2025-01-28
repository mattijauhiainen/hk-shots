import { join, dirname, basename } from "https://deno.land/std/path/mod.ts";
import { run } from "./run.ts";

type Descriptor = {
  filename: string;
  alt: string;
  width: number;
  height: number;
};

async function writeTemplate(photoData: any) {
  console.log("Writing the template");
  const photoDataTs = `
export type Photo = {
  filename: string;
  alt: string;
  width: number;
  height: number;
};
export const photoData: Photo[] = ${JSON.stringify(photoData, null, 2)};
`;
  await Deno.writeTextFile("photoData.ts", photoDataTs);
}

async function processFile(filename: string) {
  console.log("Processing file", filename);
  const __dirname = dirname(new URL(import.meta.url).pathname);
  const originalPath = join(__dirname, "../originals", filename);
  await addCopyright(originalPath);
  const avifPath = join(
    __dirname,
    "../public/images",
    filename.replace(/\.[^.]+$/, ".avif")
  );

  await convertToAvif(originalPath, avifPath);
  await createThumbnail(originalPath);
  return await getFileDescriptor(avifPath);
}

async function addCopyright(filename: string) {
  console.log("Adding metadata to", filename);
  const exifCommand = [
    `/Users/matti/Downloads/Image-ExifTool-13.14/exiftool -overwrite_original -creator='Matti Jauhiainen'`,
    `-copyrightowner='Matti Jauhiainen'`,
    `-copyrightnotice='(c)2025 Matti Jauhiainen, All Rights Reserved'`,
    `-creditline='(c)2025 Matti Jauhiainen'`,
    filename,
  ];
  await run({
    cmd: ["bash", "-c", exifCommand.join(" ")],
  });
  console.log("Metadata added");
}

async function convertToAvif(originalPath: string, avifPath: string) {
  console.log("Converting to avif", originalPath, "->", avifPath);
  // Convert the file to avif
  await run({
    cmd: ["magick", originalPath, "-resize", "2000x2000\\>", avifPath],
  });
  console.log("Converted to avif");
}

async function createThumbnail(originalPath) {
  console.log("Creating thumbnail for", originalPath);
  const __dirname = dirname(new URL(import.meta.url).pathname);
  const thumbnailPath = join(
    __dirname,
    "../public/images",
    "thumbnails",
    basename(originalPath).replace(/\.[^.]+$/, ".avif")
  );
  await run({
    cmd: ["magick", originalPath, "-resize", "480x480\\>", thumbnailPath],
  });
  console.log("Thumbnail created");
}

async function getFileDescriptor(avifPath: string) {
  console.log("Getting file descriptor", avifPath);
  const { output } = await run({
    cmd: [
      "bash",
      "-c",
      `identify -format '{"width":%w,"height":%h,"filename":"%t.avif","alt":""}\n' ${avifPath}`,
    ],
  });

  const descriptor = JSON.parse(output) as Descriptor;

  console.log("Got file descriptor");
  return descriptor;
}

// const sizes = [2000, 1800, 1500, 1200, 800];
// for (const size of sizes) {
//   const resizedPath = `images/avif/${filename.replace(
//     /\.[^.]+$/,
//     `_${size}.avif`
//   )}`;

//   // Resize the file
//   Deno.run({
//     cmd: ["magick", avifPath, "-resize", `${size}x${size}>`, resizedPath],
//   });
// }

async function processDirectory(directoryPath: string) {
  const photoData: Descriptor[] = [];
  for await (const entry of Deno.readDir(directoryPath)) {
    if (entry.isFile && entry.name !== ".DS_Store") {
      console.log("Processsing", entry.name);
      const descriptor = await processFile(basename(entry.name));
      photoData.push(descriptor);
    }
  }
  await writeTemplate(photoData);
}

await processDirectory(Deno.args[0]);
