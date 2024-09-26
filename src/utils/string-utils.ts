/**
 * Insert substring in to target string
 * @param target
 * @param substring
 * @param start
 * @param end
 */
export function insert(target: string, substring: string, start?: number | null, end?: number | null): string {
  start = start == null ? target.length : start;
  end = end == null ? start : end;
  [start, end] = start <= end ? [start, end] : [end, start];

  const prefix = start ? target.slice(0, start) : '';
  const suffix = target.slice(end);
  return prefix + substring + suffix;
}

/**
 * Remove range fom string
 * @param target
 * @param start
 * @param end
 */
export function remove(target: string, start?: number | null, end?: number | null): string {
  start = start == null ? target.length : start;
  end = end == null ? start : end;
  [start, end] = start <= end ? [start, end] : [end, start];

  if (start === end) {
    return target.slice(0, start);
  } else {
    const prefix = start ? target.slice(0, start) : '';
    const suffix = target.slice(end);
    return prefix + suffix;
  }
}