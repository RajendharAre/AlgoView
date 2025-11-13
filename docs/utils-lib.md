## Utilities and Libraries

### Utils

#### `layoutNodesCircle(nodes, width=700, height=380, margin=60)`
- **From**: `src/utils/graphUtils.js`
- **Description**: Positions nodes evenly on a circle, returning nodes with `x,y` coordinates.
- **Example**:
```js
import { layoutNodesCircle } from 'src/utils/graphUtils';

const nodes = [{ id: 'A' }, { id: 'B' }, { id: 'C' }];
const positioned = layoutNodesCircle(nodes, 600, 300);
```

#### Algorithm registry helpers
- **From**: `src/utils/algorithmConstants.js`
- `ALGORITHM_CATEGORIES`: category constants
- `ALGORITHMS`: registry with metadata and dynamic `importFn`
- `getAlgorithmInfoById(id: string)`
- `getAlgorithmsByCategory(category: string)`
- **Example**:
```js
import { getAlgorithmInfoById, ALGORITHMS } from 'src/utils/algorithmConstants';

const info = getAlgorithmInfoById('quickSort');
const load = await info.importFn();
```

This file was removed during repository cleanup. Keep only the root README.md as documentation.


#### `src/lib/firebase.js`
