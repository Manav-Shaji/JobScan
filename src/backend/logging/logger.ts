import 'server-only';
import fs from 'fs';
import path from 'path';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOGS_DIR = path.join(process.cwd(), 'logs');

function appendLog(filename: string, level: string, message: string, meta?: any) {
  // Vercel's serverless file system is read-only — skip file writes in production.
  // All logs are captured by Vercel from console output instead.
  if (process.env.NODE_ENV === 'production') return;

  try {
    if (!fs.existsSync(LOGS_DIR)) {
      fs.mkdirSync(LOGS_DIR, { recursive: true });
    }
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...meta,
    };
    const filePath = path.join(LOGS_DIR, filename);
    fs.appendFile(filePath, JSON.stringify(logEntry) + '\n', 'utf8', (err) => {
      if (err) {
        console.error(`Failed to write to local log file ${filename}:`, err);
      }
    });
  } catch (err) {
    console.error(`Graceful log write failure for ${filename}:`, err);
  }
}

class StructuredLogger {
  private isProduction = process.env.NODE_ENV === 'production';

  private shouldLogToConsole(level: LogLevel): boolean {
    const consoleLogLevel = process.env.CONSOLE_LOG_LEVEL || 'info';
    if (consoleLogLevel === 'silent' || consoleLogLevel === 'none') {
      return false;
    }
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const currentIdx = levels.indexOf(consoleLogLevel as LogLevel);
    const targetIdx = levels.indexOf(level);

    const effectiveCurrentIdx = currentIdx !== -1 ? currentIdx : levels.indexOf('info');
    return targetIdx >= effectiveCurrentIdx;
  }

  private format(level: LogLevel, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();

    // In production, emit clean JSON logs
    if (this.isProduction) {
      const logObject = {
        level,
        message,
        timestamp,
        ...meta,
      };
      return JSON.stringify(logObject);
    }

    // In development, emit human-readable colorized terminal output
    const colors = {
      debug: '\x1b[36m', // Cyan
      info: '\x1b[32m',  // Green
      warn: '\x1b[33m',  // Yellow
      error: '\x1b[31m', // Red
      reset: '\x1b[0m',
    };

    const levelStr = `${colors[level]}${level.toUpperCase()}${colors.reset}`;
    const metaStr = meta ? ` \x1b[90m${JSON.stringify(meta, null, 2)}\x1b[0m` : '';

    return `[${timestamp}] ${levelStr}: ${message}${metaStr}`;
  }

  // Log to app.log (User registration, successful login, scan creation, poster uploads)
  logApp(message: string, meta?: any) {
    this.info(message, meta);
    appendLog('app.log', 'info', message, meta);
  }

  // Log to security.log (Failed login attempts, authentication failures, suspicious activity)
  logSecurity(message: string, meta?: any) {
    this.warn(message, meta);
    appendLog('security.log', 'warn', message, meta);
  }

  // Log to error.log (Gemini failures, OCR failures, database errors, server exceptions)
  logError(message: string, error?: any, meta?: any) {
    this.error(message, error, meta);
  }

  info(message: string, meta?: any) {
    if (this.shouldLogToConsole('info')) {
      console.log(this.format('info', message, meta));
    }
  }

  warn(message: string, meta?: any) {
    if (this.shouldLogToConsole('warn')) {
      console.warn(this.format('warn', message, meta));
    }
  }

  error(message: string, error?: any, meta?: any) {
    let errorDetails = meta || {};

    if (error instanceof Error) {
      errorDetails = {
        ...errorDetails,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      };
    } else if (error !== undefined) {
      errorDetails = {
        ...errorDetails,
        error,
      };
    }

    if (this.shouldLogToConsole('error')) {
      console.error(this.format('error', message, errorDetails));
    }

    // Automatically write all errors to error.log
    appendLog('error.log', 'error', message, errorDetails);
  }

  debug(message: string, meta?: any) {
    if (!this.isProduction && this.shouldLogToConsole('debug')) {
      console.log(this.format('debug', message, meta));
    }
  }
}

export const logger = new StructuredLogger();
export default logger;
