export class SetUtils {
  static difference<T>(set1: Set<T>, set2: Set<T>) {
    return new Set([...set1].filter((item) => !set2.has(item)));
  }

  static intersection<T>(set1: Set<T>, set2: Set<T>) {
    const intersection = new Set([...set1].filter((item) => set2.has(item)));
    return intersection;
  }
}
