export function* insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;

        yield {
            array: [...arr],
            compared: [j, i],
            inserted: false,
            description: `Comparing ${arr[j]} and ${key}`
        };

        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            yield {
                array: [...arr],
                compared: [j, i],
                inserted: false,
                description: `Moving ${arr[j]} to position ${j + 1}`
            };
            j--;
        }
        arr[j + 1] = key;
        yield {
            array: [...arr],
            compared: [],
            inserted: true,
            description: `Inserted ${key} at position ${j + 1}`
        };
    }

    yield {
        array: [...arr],
        compared: [],
        inserted: false,
        description: "Sorting complete!"
    };
}

// Complexity analysis
export const insertionSortInfo = {
    timeComplexity: {
        best: "O(n)",
        average: "O(n^2)",
        worst: "O(n^2)"
    },
    spaceComplexity: "O(1)",
    stable: true,
    inPlace: true
};