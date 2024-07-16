/**
 * Kiểm tra xem object có  các key trong mảng keys không
 * @param obj
 * @param key
 * @returns
 */
export function hasKey(obj: Object, keys: Array<string>) {
  return (
    keys.length > 0 &&
    keys.every(key => {
      if (typeof obj !== 'object' || !obj.hasOwnProperty(key)) {
        return false;
      }

      obj = obj[key];
      return true;
    })
  );
}
