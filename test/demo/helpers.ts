import * as fs from "fs";

/**
 * Read a simple KEY=VALUE .env file into a plain object.
 */
export function readEnv(filePath: string): Record<string, string> {
  return Object.fromEntries(
    fs
      .readFileSync(filePath, "utf-8")
      .split(/\r?\n/)
      .filter((line) => line.includes("="))
      .map((line) => {
        const eq = line.indexOf("=");
        return [line.slice(0, eq).trim(), line.slice(eq + 1).trim()];
      }),
  );
}

/**
 * Timing utilities for demo scenarios
 */
export class DemoTiming {
  /** Short pause (500ms) - for quick transitions */
  static readonly SHORT = 250;

  /** Medium pause (1500ms) - for UI updates */
  static readonly MEDIUM = 750;

  /** Long pause (3000ms) - for complex operations */
  static readonly LONG = 1500;

  /** Extra long pause (5000ms) - for API calls or loading */
  static readonly EXTRA_LONG = 2000;

  /**
   * Sleep for a specified duration
   */
  static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Wait for a VSCode tree view to be visible
   * Note: This is a placeholder - actual implementation would need VSCode API access
   */
  static async waitForTreeView(viewId: string, timeoutMs: number = 10000): Promise<void> {
    // In Playwright demos, we'd use window.locator() to find elements
    await this.sleep(timeoutMs);
  }

  /**
   * Wait for an extension command to be available
   * Note: This is a placeholder - actual implementation would need VSCode API access
   */
  static async waitForCommand(commandId: string, timeoutMs: number = 5000): Promise<void> {
    // In Playwright demos, we'd interact with the VSCode window directly
    await this.sleep(timeoutMs);
  }
}

/**
 * Mock user interactions for demos
 */
export class DemoInteractions {
  /**
   * Simulate entering text in an input box
   */
  static async enterText(text: string, delayPerChar: number = 50): Promise<void> {
    // In a real demo, this would simulate typing character by character
    // For now, we'll just simulate a delay
    await DemoTiming.sleep(text.length * delayPerChar);
  }

  /**
   * Simulate clicking a button with animation delay
   */
  static async click(delayMs: number = DemoTiming.SHORT): Promise<void> {
    await DemoTiming.sleep(delayMs);
  }

  /**
   * Execute a command with visual delay
   * Note: In Playwright demos, you'd interact with the window directly
   */
  static async executeCommand(commandId: string, ...args: any[]): Promise<void> {
    await DemoTiming.sleep(DemoTiming.SHORT);
    // In Playwright context, you'd use:
    // await window.keyboard.press('F1');
    // await window.locator('input').fill(commandId);
    // await window.keyboard.press('Enter');
    console.log(`Would execute command: ${commandId}`, args);
    await DemoTiming.sleep(DemoTiming.MEDIUM);
  }
}

/**
 * Demo step logger for tracking progress
 */
export class DemoLogger {
  private startTime: number;
  private stepNumber: number = 0;

  constructor() {
    this.startTime = Date.now();
  }

  /**
   * Log a demo step with timestamp
   */
  step(description: string): void {
    this.stepNumber++;
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
    console.log(`[${elapsed}s] Step ${this.stepNumber}: ${description}`);
  }

  /**
   * Log an action within a step
   */
  action(description: string): void {
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
    console.log(`[${elapsed}s]   → ${description}`);
  }

  /**
   * Log completion
   */
  complete(): void {
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
    console.log(`[${elapsed}s] ✓ Demo completed`);
  }

  /**
   * Log an error
   */
  error(message: string, error?: Error): void {
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
    console.error(`[${elapsed}s] ✗ Error: ${message}`, error);
  }
}

/**
 * Create a mock input sequence for testing
 */
export interface MockInputStep {
  /** Type of input expected */
  type: "inputBox" | "quickPick" | "warningMessage" | "informationMessage";
  /** Response to provide */
  response: string | number | undefined | { label: string };
  /** Optional validation pattern */
  validate?: RegExp;
}

/**
 * Setup mock inputs for automated demo
 */
export class MockInputSequence {
  private steps: MockInputStep[];
  private currentStep: number = 0;

  constructor(steps: MockInputStep[]) {
    this.steps = steps;
  }

  /**
   * Get the next mock response
   */
  next(): MockInputStep | undefined {
    if (this.currentStep >= this.steps.length) {
      return undefined;
    }
    return this.steps[this.currentStep++];
  }

  /**
   * Reset to the beginning
   */
  reset(): void {
    this.currentStep = 0;
  }

  /**
   * Check if all steps have been consumed
   */
  isComplete(): boolean {
    return this.currentStep >= this.steps.length;
  }
}
