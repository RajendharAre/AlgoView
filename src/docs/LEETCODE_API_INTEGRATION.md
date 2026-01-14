# LeetCode Verification System Documentation

## Overview
This system allows users to track their LeetCode problem completion status by integrating with LeetCode's public API. The system works by:

1. Tracking when a user starts solving a problem
2. Recording the timestamp
3. Checking LeetCode's recent submissions API to verify completion
4. Ensuring the submission was made after the user started the problem

## Architecture

### Frontend Components
- `Practice.jsx`: Main component with Solve/Verify functionality
- `leetcodeService.js`: Service to interact with backend API

### Backend Integration
The frontend calls `/api/leetcode/:username/recent-submissions` to fetch recent submissions from LeetCode.

## Implementation Flow

### 1. User Starts Solving
When a user clicks "Solve":
- Record the problem ID, LeetCode slug, and timestamp
- Store in localStorage with key `solve_session_{problemId}`
- Open LeetCode problem in new tab

### 2. User Completes Problem
User solves the problem on LeetCode and submits.

### 3. User Verifies Completion
When a user clicks "Verify":
- Retrieve session data from localStorage
- Call backend API to get recent submissions
- Check if there's an accepted submission for the problem after the session started
- Update completion status if verified

## API Contract

### Request
```
GET /api/leetcode/{username}/recent-submissions
```

### Response Format
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

## Security & Privacy
- Only uses public LeetCode data
- Stores session data locally in browser
- Requires user to have public profile and visible recent submissions

## Limitations
- Depends on LeetCode's public API (unofficial)
- May be affected by rate limiting
- Requires user to have public profile
- Only tracks recent submissions (typically last 20)

## Error Handling
- Invalid username returns appropriate error
- Network issues handled gracefully
- Clear user-facing error messages