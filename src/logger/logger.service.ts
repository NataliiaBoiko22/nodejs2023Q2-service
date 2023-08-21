import { Injectable, ConsoleLogger } from '@nestjs/common';
import { join } from 'path';
import { mkdirSync } from 'fs';
import { LogLevel } from '@nestjs/common';
import {
  LOGGER_LEVEL,
  LOGGER_VARIANTS,
  LOGGER_MAX_SIZE_KB,
  LOGGER_FILES,
} from './constants';
import { promises as fsPromises } from 'fs';

@Injectable()
export class LoggerService extends ConsoleLogger {
  fileLog: number;
  fileError: number;

  constructor(
    private readonly maxFileSize = LOGGER_MAX_SIZE_KB * 1024,
    private readonly logLevels = Object.keys(LOGGER_VARIANTS).slice(
      0,
      LOGGER_LEVEL,
    ) as Array<LogLevel>,
    private readonly filesLogDirectory = join(__dirname, '..', '..', 'logs'),
  ) {
    super(LoggerService.name, {
      logLevels: Object.keys(LOGGER_VARIANTS).slice(
        0,
        LOGGER_LEVEL,
      ) as Array<LogLevel>,
    });

    this.fileLog = 1;
    this.fileError = 1;
    this.checkFiles();
  }

  private getLogPath = (): string => {
    return join(
      this.filesLogDirectory,
      `${LOGGER_FILES.log}-${this.fileLog}.log`,
    );
  };

  private getErrorPath = (): string => {
    return join(
      this.filesLogDirectory,
      `${LOGGER_FILES.error}-${this.fileError}.log`,
    );
  };

  private checkFileFolder = async (path: string): Promise<boolean> => {
    try {
      await fsPromises.stat(path);
      return true;
    } catch (error) {
      return false;
    }
  };
  private createDirForFiles = (): void => {
    if (!this.checkFileFolder(this.filesLogDirectory)) {
      try {
        mkdirSync(this.filesLogDirectory, { recursive: true });
      } catch (error) {
        throw new Error('Error creating directory');
      }
    }
  };

  private createFileLog = async (filePath: string): Promise<void> => {
    const existFile = this.checkFileFolder(filePath);

    if (existFile) return;
    try {
      await fsPromises.writeFile(filePath, '', { encoding: 'utf8', flag: 'w' });
    } catch (error) {
      throw new Error('Error creating file');
    }
  };

  private isNumberFile = async (
    variantLog = LOGGER_FILES.log,
  ): Promise<void> => {
    const filePath =
      variantLog === LOGGER_FILES.log ? this.getLogPath() : this.getErrorPath();
    try {
      const fileExist = this.checkFileFolder(filePath);
      if (!fileExist) {
        await this.createFileLog(filePath);
        return;
      }
      const stat = await fsPromises.stat(filePath);
      if (stat.size >= this.maxFileSize) {
        if (variantLog === LOGGER_FILES.log) {
          this.fileLog++;
        } else {
          this.fileError++;
        }
        await this.isNumberFile(variantLog);
      }
    } catch (error) {
      return null;
    }
  };

  private checkFiles = (): void => {
    this.createDirForFiles();
    this.isNumberFile(LOGGER_FILES.log);
    this.isNumberFile(LOGGER_FILES.error);
  };

  private checkSize = async (variantLog: LOGGER_FILES): Promise<void> => {
    const filePath =
      variantLog === LOGGER_FILES.log ? this.getLogPath() : this.getErrorPath();
    const fileType = variantLog === LOGGER_FILES.log ? 'fileLog' : 'fileError';

    try {
      const stat = await fsPromises.stat(filePath);

      if (stat.size >= this.maxFileSize) {
        this[fileType]++;
        await this.createFileLog(filePath);
      }
    } catch (error) {
      return null;
    }
  };
  private writeToFile = async (
    message: string,
    variantLog = LOGGER_FILES.log,
  ) => {
    try {
      const filePath =
        variantLog === LOGGER_FILES.log
          ? this.getLogPath()
          : this.getErrorPath();
      if (this.checkSize(variantLog)) {
        await this.createFileLog(filePath);
      }
      await fsPromises.appendFile(filePath, message, 'utf8');
    } catch (error) {
      console.log('Error writing to file');
      this.checkFiles();
    }
  };
  log = (message: any, ...optionalParams: Array<any>) => {
    if (!this.logLevels.includes(LOGGER_VARIANTS.log)) return;

    this.writeToFile(message);
    super.log(message, optionalParams);
  };

  error = (message: any, ...optionalParams: Array<any>) => {
    if (!this.logLevels.includes(LOGGER_VARIANTS.error)) return;

    this.writeToFile(message, LOGGER_FILES.error);
    super.error(message, optionalParams);
  };

  warn = (message: any, ...optionalParams: Array<any>) => {
    if (!this.logLevels.includes(LOGGER_VARIANTS.warn)) return;

    this.writeToFile(message);
    super.warn(message, optionalParams);
  };

  debug = (message: any, ...optionalParams: Array<any>) => {
    if (!this.logLevels.includes(LOGGER_VARIANTS.debug)) return;

    this.writeToFile(message);
    super.debug(message, optionalParams);
  };

  verbose = (message: any, ...optionalParams: any[]) => {
    if (!this.logLevels.includes(LOGGER_VARIANTS.verbose)) return;

    this.writeToFile(message);
    super.verbose(message, optionalParams);
  };
}
