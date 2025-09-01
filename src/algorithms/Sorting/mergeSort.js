export function* mergeSort(arr) {
    // Helper function for merge operation
    function* merge(left, right, startIdx) {
        let result = [];
        let i = 0, j = 0;
        while (i < left.length && j < right.length) {
            yield {
                array: [...arr],
                compared: [startIdx + i, startIdx + left.length + j],
                merged: false,
                description: `Comparing ${left[i]} and ${right[j]}`
            };
            if (left[i] <= right[j]) {
                result.push(left[i]);
                i++;
            } else {
                result.push(right[j]);
                j++;
            }
        }
        while (i < left.length) {
            result.push(left[i]);
            i++;
        }
        while (j < right.length) {
            result.push(right[j]);
            j++;
        }
        // Place merged result back into arr
        for (let k = 0; k < result.length; k++) {
            arr[startIdx + k] = result[k];
            yield {
                array: [...arr],
                compared: [],
                merged: true,
                description: `Merged ${result[k]} at position ${startIdx + k}`
            };
        }
    }

    // Recursive generator for merge sort
    function* mergeSortRecursive(start, end) {
        if (end - start <= 1) return;
        const mid = Math.floor((start + end) / 2);
        yield* mergeSortRecursive(start, mid);
        yield* mergeSortRecursive(mid, end);
        yield* merge(arr.slice(start, mid), arr.slice(mid, end), start);
    }

    yield* mergeSortRecursive(0, arr.length);

    yield {
        array: [...arr],
        compared: [],
        merged: false,
        description: "Sorting complete!"
    };
}

// Complexity analysis
export const mergeSortInfo = {
    timeComplexity: {
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n log n)"
    },
    spaceComplexity: "O(n)",
    stable: true,
    inPlace: false
};