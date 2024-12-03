type PropType<T, Path extends string> = string extends Path
  ? unknown
  : Path extends keyof T
    ? T[Path]
    : Path extends `${infer K}.${infer R}`
      ? K extends keyof T
        ? PropType<T[K], R>
        : unknown
      : unknown
/**
 * NestedKeyOf
 * Get all possible paths of the object
 * @example
 * type Keys = NestedKeyOf<{a: {b: {c: string}}}>
 * // 'a' | 'a.b' | 'a.b.c'
 */
type NestedKeyOf<O extends object> = {
  [Key in keyof O & (string | number)]: O[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<O[Key]>}`
    : `${Key}`
}

type RecordNamePaths<T extends object> = {
  [K in NestedKeyOf<T>]: PropType<T, K>
}
