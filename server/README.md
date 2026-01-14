# Algorithm Visualizer Backend

This is the backend API for the Algorithm Visualizer project that handles LeetCode verification functionality.

## Features
- Proxy to LeetCode's API to fetch user submission history
- Verification of problem completion with timestamp validation
- Rate limiting and error handling

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the server directory with the following:
```
PORT=5000
```

3. Start the server:
```bash
npm start
# or for development
npm run dev
```

## API Endpoints

### GET `/api/leetcode/:username/recent-submissions`
Fetches the recent submissions for a given LeetCode username.

Response:
```json
{
  "submissions": [
    {
      "id": 12345,
      "title": "Two Sum",
      "titleSlug": "two-sum",
      "status": "Accepted",
      "lang": "javascript",
      "timestamp": 1699123456,
      "url": "https://leetcode.com/submissions/detail/123456789/"
    }
  ]
}
```

## Usage with Frontend
The frontend communicates with this backend to verify problem completions by:
1. Storing a timestamp when the user starts solving a problem
2. Calling this API to check recent submissions
3. Validating that an "Accepted" submission exists after the start timestamp

## Notes
- This implementation uses LeetCode's unofficial GraphQL API
- Requires users to have public profiles for verification to work
- Subject to LeetCode's rate limits and API changes