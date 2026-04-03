import { execSync } from 'child_process';

export function isJavaAvailable() {
  try {
    execSync('java -version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}
