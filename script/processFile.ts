import { join, dirname, basename } from "https://deno.land/std/path/mod.ts";
import { run } from "./run.ts";

type Descriptor = {
  filename: string;
  alt: string;
  width: number;
  height: number;
};

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
  await createSourceSet(originalPath, avifPath);
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

async function createSourceSet(originalPath: string, avifPath: string) {
  console.log("Creating source set for", originalPath);
  const sizes = [1800, 1500, 1200, 800];
  for (const size of sizes) {
    const resizedPath = `${avifPath.replace(/\.[^.]+$/, `_${size}.avif`)}`;

    // Resize the file
    await run({
      cmd: ["magick", originalPath, "-resize", `${size}x${size}>`, resizedPath],
    });
  }
  console.log("Source set created");
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

async function processDirectory(directoryPath: string) {
  const photoData: Descriptor[] = [];
  for await (const entry of Deno.readDir(directoryPath)) {
    if (entry.isFile && entry.name !== ".DS_Store") {
      console.log("Processing", entry.name);
      const descriptor = await processFile(basename(entry.name));
      photoData.push(descriptor);
    }
  }
  await writeHTMLTemplate(photoData);
}

async function writeHTMLTemplate(photoData: Descriptor[]) {
  console.log("Writing the template");
  let template = "";
  for (const photo of photoData) {
    const { filename, alt, width, height } = photo;
    const fullPath = `images/thumbnails/${filename}`;
    const elementMarkup = `
        <li>
          <a 
            href="#${filename}" 
            data-filename="${filename}" 
            data-is-vertical="${height > width}"
            data-width="${width}"
            data-height="${height}"
          >
          <img
            src="${fullPath}"
            alt="${alt}"
          />
          </a>
        </li>`;
    template += elementMarkup + "\n";
  }
  // Read the index.template.html file into a string
  const __dirname = dirname(new URL(import.meta.url).pathname);
  const templatePath = join(__dirname, "../index.template.html");
  let indexTemplate = await Deno.readTextFile(templatePath);
  // replace the <!-- thumbnails --> placeholder with the template
  indexTemplate = indexTemplate.replace("<!-- thumbnails -->", template);
  // Write the template to the index.html file
  await Deno.writeTextFile("./index.html", indexTemplate);
  console.log('Template written to "index.html"');
}

await processDirectory(Deno.args[0]);
