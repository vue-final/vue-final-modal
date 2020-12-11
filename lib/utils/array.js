export function findRight(arr, callback) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (callback(arr[i], i)) {
      return arr[i]
    }
  }
  return undefined
}
