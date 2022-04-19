/**
 * A filter predicate that implements a case-insensitive string inclusion.
 *
 * @param cellValue the cell value to check
 * @param search the search/filter string to check against
 * @param data ignored
 * @param cellName ignored
 */
export function defaultStringInclusionFilter(cellValue: string, search: string, data: any, cellName: string) {
  /* Implementation note: we declared the parameters as strings, but this does NOT mean they
   * are actually strings because Typescript does NOT check the types. Therefore, we call toString() on the inputs.
   */
  const sanitizedCellValue = cellValue?.toString() ?? '';
  const sanitizedSearchString = search?.toString() ?? '';
  return sanitizedCellValue.toLowerCase().includes(sanitizedSearchString.toLowerCase());
}

export class LocalFilter {

  static filter(data: Array<any>, field: string, search: string, customFilter?: Function): Array<any> {
    const filter: Function = customFilter ? customFilter : defaultStringInclusionFilter;
    return data.filter((el) => {
      //const value = typeof el[field] === 'undefined' || el[field] === null ? '' : el[field];
      //return filter.call(null, value, search, el);
      let parts = field.split(".");
      let prop = el;
      for (var i = 0; i < parts.length && typeof prop !== 'undefined'; i++) {
        prop = prop[parts[i]];
      }
      return filter.call(null, prop, search, data, field, el);
    });
  }
}
