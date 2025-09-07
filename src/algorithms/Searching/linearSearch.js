export function* linearSearch(arr, target) {
  let foundIndex = -1;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) foundIndex = i;
    yield { currentIndex: i, foundIndex };
  }
}