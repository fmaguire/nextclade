export type Predicate<T, U> = (t: T, u: U) => boolean

export type Merger<T, U, TU> = (t: T, u: U) => TU

// By default merge with object spread
export const defaultMerger = <T, U>(t: T, u: U) => ({ ...t, ...u })

/*
 * Merges two arrays of objects pairwise. The pairs are selected with a boolean predicate.
 * Each pair is merged using provided merger function.
 */
export function mergeByWith<T, U, TU>(X: T[], Y: U[], predicate: Predicate<T, U>, merger?: Merger<T, U, TU>) {
  // For every `x` in the first array
  return X.map((x) => {
    // Find a matching `y` (a "pair") in the second array
    const matchingY = Y.find((y) => predicate(x, y))

    // If there's no matching pair for this `x`, leave it as it is
    if (!matchingY) {
      return x
    }

    if (!merger) {
      return { ...x, ...matchingY }
    }

    // // If there's a match, merge using provided merger function
    return merger(x, matchingY)
  })
}
