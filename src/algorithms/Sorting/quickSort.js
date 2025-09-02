export function* quickSort(arr) {
    function* partition(arr, low, high) {
        let pivot = arr[high];
        let i = low - 1;
        for (let j = low; j < high; j++) {
            yield {
                array: [...arr],
                compared: [j, high],
                swapped: false,
                description: `Comparing ${arr[j]} with pivot ${pivot}`
            };
            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                yield {
                    array: [...arr],
                    compared: [i, j],
                    swapped: true,
                    description: `Swapped ${arr[i]} and ${arr[j]}`
                };
            }
        }
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        yield {
            array: [...arr],
            compared: [i + 1, high],
            swapped: true,
            description: `Swapped pivot ${arr[i + 1]} with ${arr[high]}`
        };
        return i + 1;
    }

    function* quickSortHelper(arr, low, high) {
        if (low < high) {
            const partitionGen = partition(arr, low, high);
            let partitionResult;
            let lastYield;
            while (!(partitionResult = partitionGen.next()).done) {
                lastYield = partitionResult.value;
                yield lastYield;
            }
            const pi = lastYield ? lastYield.array.findIndex((v, idx) => idx >= low && idx <= high && v === arr[high]) : low;
            yield* quickSortHelper(arr, low, pi - 1);
            yield* quickSortHelper(arr, pi + 1, high);
        }
    }

    yield* quickSortHelper(arr, 0, arr.length - 1);

    yield {
        array: [...arr],
        compared: [],
        swapped: false,
        description: "Sorting complete!"
    };
}

// Complexity analysis
export const quickSortInfo = {
    timeComplexity: {
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n²)"
    },
    spaceComplexity: "O(log n)",
    stable: false,
    inPlace: true
};