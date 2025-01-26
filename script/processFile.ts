/// <reference lib="deno.ns" />
import { join, dirname, basename } from "https://deno.land/std/path/mod.ts";

async function addCopyright(filename: string) {
  console.log("Adding metadata to", filename);
  const process = Deno.run({
    cmd: [
      "bash",
      "-c",
      `/Users/matti/Downloads/Image-ExifTool-13.14/exiftool -overwrite_original -creator='Matti Jauhiainen' \
-copyrightowner='Matti Jauhiainen' \
-copyrightnotice='(c)2025 Matti Jauhiainen, All Rights Reserved' \
-creditline='(c)2025 Matti Jauhiainen' \
${filename}`,
    ],
    stdout: "piped",
    stderr: "piped",
  });
  const { code } = await process.status();

  // Read the output and error streams
  const rawOutput = await process.output();
  const rawError = await process.stderrOutput();

  // Decode the output and error messages
  const output = new TextDecoder().decode(rawOutput);
  const error = new TextDecoder().decode(rawError);

  // Log the output and error messages
  if (error?.trim()) console.log("Error:", error);

  // Close the process
  process.close();
}

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
  const descriptor = await getFileDescriptor(avifPath);
  return descriptor;
}

async function convertToAvif(originalPath: string, avifPath: string) {
  console.log("Converting to avif", originalPath, "->", avifPath);

  // Convert the file to avif
  const process = Deno.run({
    cmd: ["magick", originalPath, "-resize", "2000x2000\\>", avifPath],
    stdout: "piped",
    stderr: "piped",
  });
  const { code } = await process.status();

  // Read the output and error streams
  const rawOutput = await process.output();
  const rawError = await process.stderrOutput();

  // Decode the output and error messages
  const output = new TextDecoder().decode(rawOutput);
  const error = new TextDecoder().decode(rawError);

  // Log the output and error messages
  if (error?.trim()) console.log("Error:", error);

  // Close the process
  process.close();
}

async function createThumbnail(originalPath) {
  console.log("Creating thumbnail", originalPath);
  const __dirname = dirname(new URL(import.meta.url).pathname);
  const thumbnailPath = join(
    __dirname,
    "../public/images",
    "thumbnails",
    basename(originalPath).replace(/\.[^.]+$/, ".avif")
  );
  const process = Deno.run({
    cmd: ["magick", originalPath, "-resize", "480x480\\>", thumbnailPath],
    stdout: "piped",
    stderr: "piped",
  });
  const { status } = await process.status();
  const rawError = await process.stderrOutput();
  const error = new TextDecoder().decode(rawError);
  if (error?.trim()) console.log("Error:", error);
}

async function getFileDescriptor(avifPath: string) {
  console.log("Getting file dimensions", avifPath);
  const process = Deno.run({
    cmd: [
      "bash",
      "-c",
      `identify -format '{"width":%w,"height":%h,"filename":"%t.avif","alt":""}\n' ${avifPath}`,
    ],
    stdout: "piped",
    stderr: "piped",
  });
  const { code } = await process.status();

  console.log("Done with dimensions...");
  // Read the output and error streams
  const rawOutput = await process.output();
  const rawError = await process.stderrOutput();

  // Decode the output and error messages
  const output = new TextDecoder().decode(rawOutput);
  const error = new TextDecoder().decode(rawError);
  if (error?.trim()) console.log("Error:", error);

  const descriptor = JSON.parse(output);

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

console.log("Processing files...");

async function processDirectory(directoryPath: string) {
  const photoData = [];
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

// processFile(Deno.args[0]);
