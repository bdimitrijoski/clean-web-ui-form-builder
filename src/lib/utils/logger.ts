/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-explicit-any */
export class Logger {
  private static instance: Logger;
  logEnabled = true;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }

    return Logger.instance;
  }

  log(message: string, obj?: unknown): void {
    // eslint-disable-next-line
    this.logEnabled ? console.log(message, obj) : '';
  }

  error(message: string, obj?: unknown): void {
    // eslint-disable-next-line
    this.logEnabled ? console.error(message, obj) : '';
  }
}
