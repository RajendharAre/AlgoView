## Hooks

### `useAlgorithm`
- **Import**: `import { useAlgorithm } from 'src/hooks/useAlgorithm'`
- **Returns**:
  - `currentStep: object | undefined`
  - `currentStepIndex: number`
  - `totalSteps: number`
  - `isPlaying: boolean`
  - `speed: number`
  - `setSpeed(ms: number): void`
  - `executeAlgorithm(gen: Generator): Promise<object[]>` — consumes a generator and builds steps
  - `play(): void`
  - `pause(): void`
  - `reset(): void`
  - `goToStep(index: number): void`
  - `hasSteps: boolean`
- **Example**:
```jsx
import { useAlgorithm } from 'src/hooks/useAlgorithm';

function Demo({ generator }) {
  const { executeAlgorithm, currentStep, totalSteps, play, pause, reset } = useAlgorithm();

  const run = async () => {
    await executeAlgorithm(generator());
    play();
  };

  return (
    <div>
      <button onClick={run}>Run</button>
      <button onClick={pause}>Pause</button>
      <button onClick={reset}>Reset</button>
      <pre>{currentStep?.description}</pre>
      <div>Total Steps: {totalSteps}</div>
    </div>
  );
}
```

### `useAuth`
- **Import**: `import { useAuth } from 'src/hooks/useAuth'`
- **Returns**: `{ user: FirebaseUser | null, loading: boolean, logout: () => Promise<void> }`
- **Description**: Subscribes to Firebase Auth state and exposes user and a `logout` helper.
- **Example**:
```jsx
import { useAuth } from 'src/hooks/useAuth';

function UserBar() {
  const { user, loading, logout } = useAuth();
  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <span>{user?.email}</span>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

