import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

enum LogLevel {
  ERROR = 0,
  WARN = 1,
  LOG = 2,
  DEBUG = 3,
  VERBOSE = 4,
}

@Injectable({ scope: Scope.DEFAULT })
export class CustomLoggingService implements LoggerService {
  private logLevel: number;
  private maxFileSize: number;
  private logDir: string;
  private logFilePath: string;
  private errorLogFilePath: string;

  constructor(private configService: ConfigService) {
    this.logLevel = parseInt(
      this.configService.get<string>('LOG_LEVEL') || '2',
      10,
    );
    this.maxFileSize =
      parseInt(this.configService.get<string>('MAX_FILE_SIZE') || '1024', 10) *
      1024;
    this.logDir = path.join(process.cwd(), 'logs');
    this.logFilePath = path.join(this.logDir, 'application.log');
    this.errorLogFilePath = path.join(this.logDir, 'error.log');

    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  log(message: any, context?: string) {
    if (this.logLevel >= LogLevel.LOG) {
      this.writeLog('LOG', message, context);
    }
  }

  error(message: any, trace?: string, context?: string) {
    if (this.logLevel >= LogLevel.ERROR) {
      this.writeLog('ERROR', message, context, trace);
      this.writeErrorLog('ERROR', message, context, trace);
    }
  }

  warn(message: any, context?: string) {
    if (this.logLevel >= LogLevel.WARN) {
      this.writeLog('WARN', message, context);
    }
  }

  debug(message: any, context?: string) {
    if (this.logLevel >= LogLevel.DEBUG) {
      this.writeLog('DEBUG', message, context);
    }
  }

  verbose(message: any, context?: string) {
    if (this.logLevel >= LogLevel.VERBOSE) {
      this.writeLog('VERBOSE', message, context);
    }
  }

  private writeLog(
    level: string,
    message: any,
    context?: string,
    trace?: string,
  ) {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}] ` : '';
    const messageStr =
      typeof message === 'object' ? JSON.stringify(message) : message;
    const traceStr = trace ? `\n${trace}` : '';
    const logMessage = `[${timestamp}] [${level}] ${contextStr}${messageStr}${traceStr}\n`;

    process.stdout.write(logMessage);

    this.rotateLogFile(this.logFilePath);
    fs.appendFileSync(this.logFilePath, logMessage);
  }

  private writeErrorLog(
    level: string,
    message: any,
    context?: string,
    trace?: string,
  ) {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}] ` : '';
    const messageStr =
      typeof message === 'object' ? JSON.stringify(message) : message;
    const traceStr = trace ? `\n${trace}` : '';
    const logMessage = `[${timestamp}] [${level}] ${contextStr}${messageStr}${traceStr}\n`;

    this.rotateLogFile(this.errorLogFilePath);
    fs.appendFileSync(this.errorLogFilePath, logMessage);
  }

  private rotateLogFile(filePath: string) {
    if (!fs.existsSync(filePath)) {
      return;
    }

    const stats = fs.statSync(filePath);
    if (stats.size >= this.maxFileSize) {
      const timestamp = Date.now();
      const newFilePath = filePath.replace('.log', `.${timestamp}.log`);
      fs.renameSync(filePath, newFilePath);
    }
  }
}
