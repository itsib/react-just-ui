/**
 * Pauses the current async function.
 * Non-blocking implementation.
 *
 * @example
 * ```typescript
 * (async function() {
 *    console.log('Start');
 *
 *    await sleep(1000);
 *
 *    console.log('One second has passed');
 * })();
 * ```
 *
 * @param ms
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}