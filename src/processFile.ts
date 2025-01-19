import { join, dirname, basename } from "https://deno.land/std/path/mod.ts";

// processFile
// Function takes a filename as an argument. It will convert the file from whatever
// image format it is to avif without doing any other changes to it. Conversion
// and resizing is done using the 'magick' command line tool.

// It will then create 5 distinct versions of the file in avif format. With sizes
// 2000, 1800, 1500, 1200, 800 it will create five versions of the file, where the
// file is resized so that it's larger dimension matches the size from that list,
// and the other dimension is scaled down according to files original aspect ratio.
async function processFile(filename: string) {
  const __dirname = dirname(new URL(import.meta.url).pathname);
  const originalPath = join(__dirname, "../originals", filename);
  const avifPath = join(
    __dirname,
    "../public/images",
    filename.replace(/\.[^.]+$/, ".avif")
  );

  await convertToAvif(originalPath, avifPath);
  await createThumbnail(originalPath);
  const descriptor = await getFileDescriptor(avifPath);
  const photoData = [descriptor];
  await writeTemplate(photoData);
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
processFile(Deno.args[0]);
