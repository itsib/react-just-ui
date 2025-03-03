/**
 * Parse, normalize and round value.
 *
 * @param value
 * @param min
 * @param max
 * @param step
 */
export function parseValue(value: string, min: number, max: number, step: number): number {
  if (min > max) { throw new Error('MIN_MAX') }
  let parsed = value ? parseFloat(value) : min;
  parsed = isNaN(parsed) ? min : parsed;
  parsed = Math.max(parsed, min);
  parsed = Math.min(parsed, max);

  const decimals = `${step}`.split('.')[1]?.length || 0;

  const remains = parsed % step;
  const half = step / 2;
  const rounded = parsed - remains;
  const nextTick = rounded + step;

  if (half < remains && nextTick <= max) {
    return parseFloat(nextTick.toFixed(decimals));
  }
  return parseFloat(rounded.toFixed(decimals));
}

/**
 * Parse range (values means two numbers separate with ":")
 * @param value
 * @param min
 * @param max
 * @param step
 */
export function parseValues(value: string, min: number, max: number, step: number): [number, number] {
  const values = value.split(':');
  if (values.length === 0) {
    return [min, min];
  } else if (values.length === 1) {
    return [min, parseValue(values[0], min, max, step)];
  } else {
    const start = parseValue(values[0], min, max, step);
    const end = parseValue(values[1], start, max, step);
    return [start, end];
  }
}