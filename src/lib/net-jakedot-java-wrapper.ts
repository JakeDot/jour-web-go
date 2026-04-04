import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

/**
 * Checks if Java is available in the system path.
 * @returns Promise<boolean>
 */
export async function isJavaAvailable(): Promise<boolean> {
  try {
    await execPromise('java -version');
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Runs a JAR file using the java -jar command.
 * @param jarPath Path to the .jar file
 * @param args Optional arguments to pass to the JAR
 * @returns Promise<{ stdout: string, stderr: string }>
 */
export async function runJar(jarPath: string, args: string[] = []): Promise<{ stdout: string, stderr: string }> {
  const command = `java -jar "${jarPath}" ${args.join(' ')}`;
  return execPromise(command);
}
