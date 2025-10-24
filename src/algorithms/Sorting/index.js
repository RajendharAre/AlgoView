import { bubbleSort, bubbleSortInfo } from './bubbleSort'
import { quickSort, quickSortInfo } from './quickSort'
import { mergeSort, mergeSortInfo } from './mergeSort'

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
}
