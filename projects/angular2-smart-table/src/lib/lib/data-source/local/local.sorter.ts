export function defaultNumberComparator(direction: number, left: number | null, right: number | null): number {
  if (left == null && right == null) {
    return 0;
  }
  // only one of them can be null now
  if (left == null || left < right!) {
    return -1 * direction;
  }
  if (right == null || right < left) {
    return direction;
  }
  // none of them can be null now, and they must be equal
  return 0;
}

export function defaultStringComparator(direction: number, left: string | null, right: string | null): number {
  if (left == null && right == null) {
    return 0;
  } else if (left == null) {
    return -1 * direction;
  } else if (right == null) {
    return direction;
  } else {
    return left.localeCompare(right) * direction;
  }
}

/**
 * Compares two values interpreting them as numbers or strings.
 *
 * The rule is: if both values are of type number (or null), they are compared as if they were numbers.
 * Otherwise, they are compared is if they were strings. If the type is string but the content is a number, the value
 * is still compared as a string.
 *
 * Null values are considered less than any non-null element. Null and undefined are considered equal.
 *
 * @param direction 1 for ascending and -1 for descending (other values are not allowed)
 * @param left the left value
 * @param right the right value
 */
export function defaultComparator(direction: any, left: any, right: any) {
  const leftIsNumeric = left == null || !isNaN(parseFloat(left));
  const rightIsNumeric = right == null || !isNaN(parseFloat(right));
  if (leftIsNumeric && rightIsNumeric) {
    return defaultNumberComparator(direction, Number(left), Number(right));
  } else {
    return defaultStringComparator(direction, String(left), String(right));
  }
}

export class LocalSorter {

  static sort(data: Array<any>, field: string, direction: string, customCompare?: Function): Array<any> {

    const dir: number = (direction === 'asc') ? 1 : -1;
    const compare: Function = customCompare ? customCompare : defaultComparator;

    return data.sort((a, b) => {
      let parts = field.split(".");
      let propA = a;
      for (let i = 0; i < parts.length && typeof propA !== 'undefined'; i++) {
        propA = propA[parts[i]];
      }
      let propB = b;
      for (let i = 0; i < parts.length && typeof propB !== 'undefined'; i++) {
        propB = propB[parts[i]];
      }
      return compare.call(null, dir, propA, propB);
    });
  }
}
