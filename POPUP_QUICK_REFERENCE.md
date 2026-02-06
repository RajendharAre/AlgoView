# Quick Reference: Popup Safety System

## 🎯 Purpose
Ensure only ONE popup shows at a time with automatic cleanup and queue management.

---

## 🔧 How It Works

### Lock System (Mutex)
```javascript
popupLock.current = false;  // false = available, true = locked
```

### Timeout Tracking
```javascript
popupTimeout.current = null;  // Tracks auto-dismiss timer
```

### Queue for Pending
```javascript
popupQueue.current = [];  // Stores popups to show later
```

---

## 💡 Key Functions

### Show Popup Safely
```javascript
showPopupSafely({
  type: 'success',           // or 'error', 'warning'
  title: 'Popup Title',
  message: 'Popup message',
  problemTitle: 'Problem name'
}, 5000);                     // Auto-dismiss after 5 sec
```

**What happens:**
- If lock free: Shows popup + sets 5 sec timer
- If lock taken: Queues popup, waits for release

### Close Popup Properly
```javascript
closeVerificationPopup()
```

**What happens:**
- Clears auto-dismiss timer
- Closes popup
- Releases lock
- Shows next queued popup (if any)

---

## 📊 Console Debug Commands

| Command | Purpose |
|---------|---------|
| `window.PRACTICE_DEBUG.getPopupLockStatus()` | Check if locked, queue size, timeout pending |
| `window.PRACTICE_DEBUG.closePopup()` | Close popup manually |
| `window.PRACTICE_DEBUG.clearPopupQueue()` | Clear all queued popups |
| `window.PRACTICE_DEBUG.showTestPopup()` | Show test popup |
| `window.PRACTICE_DEBUG.getVerificationPopup()` | View current popup |
| `window.PRACTICE_DEBUG.getStats()` | View overall stats |

---

## 🔍 Quick Diagnostic

### Check if system is healthy
```javascript
window.PRACTICE_DEBUG.getPopupLockStatus()
// Expected: { locked: false, queuedPopups: 0, hasTimeout: false }
```

### If stuck
```javascript
window.PRACTICE_DEBUG.closePopup()
window.PRACTICE_DEBUG.clearPopupQueue()
```

---

## ⏱️ Auto-Dismiss Timeouts

| Popup Type | Duration | Why |
|------------|----------|-----|
| ✅ Success | 5 sec | Quick positive feedback |
| ❌ Error (Not Solved) | 6 sec | Time to read message |
| ❌ Error (Verification Failed) | 8 sec | Complex troubleshooting info |
| ⚠️ Warning | 6 sec | Important but not urgent |

---

## 🔄 Flow Overview

```
User Action
    ↓
showPopupSafely()
    ↓
Lock Available? 
 ↙ Yes    ↖ No
Show      Queue
Set       (Wait)
Timer
    ↓
5-8 seconds pass
    ↓
Auto-dismiss OR User clicks close
    ↓
closeVerificationPopup()
    ↓
Release Lock + Clear Timer
    ↓
Queue has items?
 ↙ No   ↖ Yes
Done   Show Next
       (500ms delay)
```

---

## 📝 Popup Scenarios

### Single Popup (Normal)
```
showPopupSafely(popup1)
[5 sec later] Auto-dismiss
Done
```

### Two Popups (Rapid Click)
```
showPopupSafely(popup1)
showPopupSafely(popup2)  ← Queued!
[5 sec] popup1 auto-dismiss
[500ms] popup2 displays
[5 sec] popup2 auto-dismiss
Done
```

### User Closes Early
```
showPopupSafely(popup1)
[User clicks close button]
closeVerificationPopup()
[500ms] Next popup if any
```

---

## ✅ Verification

### All Uses of showPopupSafely
- ✅ Line 254: Success verification (5 sec)
- ✅ Line 270: Error - not solved (6 sec)
- ✅ Line 287: Error - verification failed (8 sec)
- ✅ Line 606: Warning - auth required (6 sec)

### Old Direct setVerificationPopup
- ❌ Completely removed
- ✅ All replaced with showPopupSafely

### Close Handler
- ✅ Line 981: Uses closeVerificationPopup function

---

## 🛡️ Safety Guarantees

| Problem | Protection |
|---------|-----------|
| Multiple popups | Lock prevents concurrent display |
| Stuck popups | Auto-dismiss timeout |
| Stale timers | Cleared before new popup |
| Overlapping requests | Queue system |
| Rapid clicks | Lock + queue prevents spam |
| Race conditions | Atomic operations (refs) |

---

## 🎓 For Developers

**When to use showPopupSafely:**
```javascript
// ✅ DO THIS
showPopupSafely({
  type: 'success',
  title: 'Success!',
  message: 'Done',
  problemTitle: 'Problem'
}, 5000);
```

**Never do this:**
```javascript
// ❌ DON'T DO THIS
setVerificationPopup({
  isOpen: true,
  type: 'success',
  ...
});
```

---

## 📋 Checklist for Testing

- [ ] Verify single popup displays
- [ ] Verify auto-dismiss after timeout
- [ ] Verify manual close works
- [ ] Verify queue handles 5+ rapid clicks
- [ ] Verify console logs show flow
- [ ] Verify lock status shows correct state
- [ ] Verify auto-verify is silent
- [ ] Verify no overlapping popups

---

## 🚀 Quick Start Testing

1. Open browser console (F12)
2. Trigger verification: Click "Verify Problem"
3. Check lock status: `window.PRACTICE_DEBUG.getPopupLockStatus()`
4. Expected output: `{ locked: false, queuedPopups: 0, hasTimeout: false }`
5. Close and watch for next popup
6. View console logs for detailed flow

---

## 📞 Troubleshooting

| Issue | Solution |
|-------|----------|
| Popup not closing | `window.PRACTICE_DEBUG.closePopup()` |
| Multiple queued | `window.PRACTICE_DEBUG.getPopupLockStatus()` |
| Stuck popup | Clear queue: `window.PRACTICE_DEBUG.clearPopupQueue()` |
| Not sure state | `window.PRACTICE_DEBUG.getStats()` |

---

## 📌 Remember

- **Lock prevents overlap**: Only 1 popup at a time
- **Queue handles requests**: All requests processed in order
- **Auto-dismiss prevents stuck state**: Popups close automatically
- **Console shows everything**: Check logs for detailed flow
- **Safe close processes queue**: Next popup shown after current closes

---

**Last Updated**: Feb 5, 2026
**Status**: ✅ Production Ready
