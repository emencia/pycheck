import { spawn } from "child_process";

async function executeSync(
  command: string,
  args: Array<string> = [],
  {
    onStderr = (data: any): void => { },
    onError = (data: any): void => { },
  } = {
      onStderr: (data) => console.log("stderr:", data),
      onError: (err) => { if (err) throw err },
    },
): Promise<Array<string>> {
  let buffer = "";
  let child = spawn(command, args, { shell: true });
  child.stdout.setEncoding('utf8');
  child.stdout.on('data', (data: any) => buffer += data);
  child.stderr.setEncoding('utf8');
  child.stderr.on('data', (data: any) => onStderr(data));
  child.on("error", (data: any) => onError(data));
  let finish: (value: unknown) => void;
  let end = new Promise((r) => finish = r);
  child.on('close', () => finish(true));
  await end
  return buffer.split("\n")
}

function execute(
  command: string,
  args: Array<string> = [],
  { onStdout = (data: any): void => { },
    onStderr = (data: any): void => { },
    onError = (data: any): void => { },
    onFinished = (): void => { },
  } = {
      onStdout: (data) => console.log("stdout:", data),
      onStderr: (data) => console.log("stderr:", data),
      onError: (err) => { if (err) throw err },
      onFinished: (): void => { },
    },
): () => boolean {
  var child = spawn(command, args);
  child.stdout.setEncoding('utf8');
  child.stdout.on('data', (data: any) => onStdout(data));
  child.stderr.setEncoding('utf8');
  child.stderr.on('data', (data: any) => onStderr(data));
  child.on("error", (data: any) => onError(data));
  child.on('close', () => onFinished());
  return () => child.kill()
}

export { execute, executeSync }
