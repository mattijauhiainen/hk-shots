export async function run({ cmd }: { cmd: string[] }) {
  const process = Deno.run({
    cmd,
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
  return { output, error };
}
