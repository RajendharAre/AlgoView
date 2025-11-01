import { bubbleSort, bubbleSortInfo } from './bubbleSort'
import { quickSort, quickSortInfo } from './quickSort'
import { mergeSort, mergeSortInfo } from './mergeSort'
import { selectionSort, selectionSortInfo } from './selectionSort'
import { insertionSort, insertionSortInfo } from './insertionSort'

export const sortingAlgorithms = {
  bubbleSort: {
    function: bubbleSort,
    info: bubbleSortInfo,
    category: 'sorting',
    name: 'Bubble Sort',
  },
  quickSort: {
    function: quickSort,
    info: quickSortInfo,
    category: 'sorting',
    name: 'Quick Sort',
  },
  mergeSort: {
    function: mergeSort,
    info: mergeSortInfo,
    category: 'sorting',
    name: 'Merge Sort',
  },
  selectionSort: {
    function: selectionSort,
    info: selectionSortInfo,
    category: 'sorting',
    name: 'Selection Sort',
  },
  insertionSort: {
    function: insertionSort,
    info: insertionSortInfo,
    category: 'sorting',
    name: 'Insertion Sort',
  },
}