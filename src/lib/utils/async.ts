interface ConcurrencyOptions {
  concurrency: number;
}

/**
 * Maps items with a bounded concurrency level and returns only fulfilled values.
 * Failures are skipped so one bad request does not fail the whole batch.
 */
export async function mapSettledWithConcurrency<TInput, TOutput>(
  items: TInput[],
  mapper: (item: TInput, index: number) => Promise<TOutput>,
  options: ConcurrencyOptions
): Promise<TOutput[]> {
  const { concurrency } = options;
  if (items.length === 0) return [];

  const cap = Math.max(1, Math.floor(concurrency));
  const results: Array<TOutput | undefined> = new Array(items.length);

  let nextIndex = 0;

  async function worker() {
    while (true) {
      const current = nextIndex;
      nextIndex += 1;
      if (current >= items.length) return;

      try {
        results[current] = await mapper(items[current], current);
      } catch {
        // Swallow per-item errors intentionally.
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(cap, items.length) }, () => worker()));

  return results.filter((value): value is TOutput => value !== undefined);
}
