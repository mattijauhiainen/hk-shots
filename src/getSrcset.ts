export function getSrcset(filename: string) {
  return `${filename.replace(".avif", "_800.avif")} 800w,
${filename.replace(".avif", "_1200.avif")} 1200w,
${filename.replace(".avif", "_1500.avif")} 1500w,
${filename.replace(".avif", "_1800.avif")} 1800w,
${filename} 2000w`;
}
