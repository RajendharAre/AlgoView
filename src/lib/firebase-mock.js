// Mock Firebase implementation for testing
// This simulates Firebase functionality without requiring actual Firebase setup

class MockFirestore {
  constructor() {
    this.data = {};
    this.listeners = {};
    // Simulate cross-client real-time updates
    this.clientId = Math.random().toString(36).substr(2, 9);
    this.setupCrossClientSync();
  }
  
  setupCrossClientSync() {
    // Use localStorage to simulate cross-tab/client communication
    const syncKey = 'firebase-mock-sync';
    
    // Listen for changes from other tabs/clients
    window.addEventListener('storage', (event) => {
      if (event.key === syncKey && event.newValue) {
        try {
          const { clientId, path, data } = JSON.parse(event.newValue);
          // Only process updates from other clients
          if (clientId !== this.clientId) {
            console.log(`🔄 Cross-client update received for ${path}`);
            // Update local data
            const [collection, docId] = path.split('/');
            if (!this.data[collection]) this.data[collection] = {};
            this.data[collection][docId] = data;
            
            // Trigger local listeners
            this._triggerListeners(path);
          }
        } catch (e) {
          console.error('Error processing cross-client update:', e);
        }
      }
    });
    
    // Set up broadcast function
    this.broadcastUpdate = (path, data) => {
      try {
        localStorage.setItem(syncKey, JSON.stringify({
          clientId: this.clientId,
          path,
          data,
          timestamp: Date.now()
        }));
        // Clear the item to allow repeated updates
        setTimeout(() => localStorage.removeItem(syncKey), 100);
      } catch (e) {
        console.error('Error broadcasting update:', e);
      }
    };
  }
  
  // Simulate doc reference
  doc(collection, docId) {
    return {
      path: `${collection}/${docId}`,
      set: async (data, options = {}) => {
        console.log('Mock Firestore: Setting data for', `${collection}/${docId}`);
        console.log('Options:', options);
        console.log('Incoming data:', data);
        console.log('Existing data before:', this.data[collection]?.[docId]);
        
        if (!this.data[collection]) {
          this.data[collection] = {};
        }
        
        if (options.merge) {
          // Proper deep merge for nested objects including dot notation
          const existingData = this.data[collection][docId] || {};
          
          // Handle special Firebase operations
          const mergedData = JSON.parse(JSON.stringify(existingData)); // Deep copy
          
          // Process each key, handling dot notation for nested paths
          Object.keys(data).forEach(key => {
            if (data[key] === '__DELETE_FIELD__') {
              // Handle deleteField operation
              if (key.includes('.')) {
                // Handle nested path deletion
                const pathParts = key.split('.');
                let current = mergedData;
                for (let i = 0; i < pathParts.length - 1; i++) {
                  if (!current[pathParts[i]]) break;
                  if (i === pathParts.length - 2) {
                    delete current[pathParts[i]][pathParts[pathParts.length - 1]];
                  } else {
                    current = current[pathParts[i]];
                  }
                }
              } else {
                delete mergedData[key];
              }
            } else {
              // Handle regular field setting, including dot notation
              if (key.includes('.')) {
                // Handle nested path setting
                const pathParts = key.split('.');
                let current = mergedData;
                for (let i = 0; i < pathParts.length - 1; i++) {
                  if (!current[pathParts[i]]) {
                    current[pathParts[i]] = {};
                  }
                  current = current[pathParts[i]];
                }
                current[pathParts[pathParts.length - 1]] = data[key];
              } else {
                mergedData[key] = data[key];
              }
            }
          });
          
          this.data[collection][docId] = mergedData;
        } else {
          // Replace data - also handle dot notation for consistency
          const newData = {};
          Object.keys(data).forEach(key => {
            if (key.includes('.')) {
              const pathParts = key.split('.');
              let current = newData;
              for (let i = 0; i < pathParts.length - 1; i++) {
                if (!current[pathParts[i]]) {
                  current[pathParts[i]] = {};
                }
                current = current[pathParts[i]];
              }
              current[pathParts[pathParts.length - 1]] = data[key];
            } else {
              newData[key] = data[key];
            }
          });
          this.data[collection][docId] = newData;
        }
        
        console.log('Data after operation:', this.data[collection][docId]);
        
        // Broadcast to other clients for real-time sync
        if (this.broadcastUpdate) {
          this.broadcastUpdate(`${collection}/${docId}`, this.data[collection][docId]);
        }
        
        // Trigger any listeners
        this._triggerListeners(`${collection}/${docId}`);
        
        return Promise.resolve();
      },
      get: async () => {
        console.log('Mock Firestore: Getting data for', `${collection}/${docId}`);
        console.log('Full data store structure:', Object.keys(this.data || {}));
        console.log('Collection data for', collection, ':', this.data[collection] ? Object.keys(this.data[collection]) : 'No collection');
        const data = this.data[collection]?.[docId];
        console.log('Retrieved data for', docId, ':', data || 'undefined');
        console.log('Document exists:', !!data);
        if (data) {
          console.log('Document keys:', Object.keys(data));
        }
        return {
          exists: () => !!data,
          data: () => data || null
        };
      },
      onSnapshot: (callback) => {
        const path = `${collection}/${docId}`;
        if (!this.listeners[path]) {
          this.listeners[path] = [];
        }
        this.listeners[path].push(callback);
        
        // Call immediately with current data
        const data = this.data[collection]?.[docId];
        callback({
          exists: () => !!data,
          data: () => data || null
        });
        
        // Return unsubscribe function
        return () => {
          const index = this.listeners[path].indexOf(callback);
          if (index > -1) {
            this.listeners[path].splice(index, 1);
          }
        };
      }
    };
  }
  
  // Simulate collection reference
  collection(collectionName) {
    return {
      path: collectionName,
      onSnapshot: (callback) => {
        // Call the callback with a mock query snapshot
        const docs = [];
        if (this.data[collectionName]) {
          Object.keys(this.data[collectionName]).forEach(docId => {
            const docData = this.data[collectionName][docId];
            docs.push({
              id: docId,
              data: () => docData,
              exists: () => !!docData
            });
          });
        }
        
        // Create a mock query snapshot
        const querySnapshot = {
          forEach: (docCallback) => {
            docs.forEach(docCallback);
          },
          size: docs.length
        };
        
        callback(querySnapshot);
        
        // Set up listeners for real-time updates
        if (!this.listeners[collectionName]) {
          this.listeners[collectionName] = [];
        }
        this.listeners[collectionName].push(() => {
          // Recreate the snapshot with updated data
          const updatedDocs = [];
          if (this.data[collectionName]) {
            Object.keys(this.data[collectionName]).forEach(docId => {
              const docData = this.data[collectionName][docId];
              updatedDocs.push({
                id: docId,
                data: () => docData,
                exists: () => !!docData
              });
            });
          }
          
          const updatedQuerySnapshot = {
            forEach: (docCallback) => {
              updatedDocs.forEach(docCallback);
            },
            size: updatedDocs.length
          };
          
          callback(updatedQuerySnapshot);
        });
        
        // Return unsubscribe function
        return () => {
          const index = this.listeners[collectionName].indexOf(callback);
          if (index > -1) {
            this.listeners[collectionName].splice(index, 1);
          }
        };
      }
    };
  }
  
  _triggerListeners(path) {
    if (this.listeners[path]) {
      const parts = path.split('/');
      const collection = parts[0];
      const docId = parts[1];
      const data = this.data[collection]?.[docId];
      
      this.listeners[path].forEach(callback => {
        callback({
          exists: () => !!data,
          data: () => data || null
        });
      });
    }
    
    // Also trigger collection listeners since a document in the collection changed
    const parts = path.split('/');
    const collectionName = parts[0];
    if (this.listeners[collectionName]) {
      this.listeners[collectionName].forEach(callback => {
        // Recreate the snapshot with updated data
        const updatedDocs = [];
        if (this.data[collectionName]) {
          Object.keys(this.data[collectionName]).forEach(docId => {
            const docData = this.data[collectionName][docId];
            updatedDocs.push({
              id: docId,
              data: () => docData,
              exists: () => !!docData
            });
          });
        }
        
        const updatedQuerySnapshot = {
          forEach: (docCallback) => {
            updatedDocs.forEach(docCallback);
          },
          size: updatedDocs.length
        };
        
        callback(updatedQuerySnapshot);
      });
    }
  }
}

class MockAuth {
  constructor() {
    this.currentUser = {
      uid: 'mock-user-123',
      email: 'test@example.com'
    };
  }
  
  onAuthStateChanged(callback) {
    // Call immediately with current user
    callback(this.currentUser);
    
    // Return unsubscribe function
    return () => {};
  }
}

// Mock deleteField function
const deleteField = () => '__DELETE_FIELD__';

// Create mock instances
const mockDb = new MockFirestore();
const mockAuth = new MockAuth();

// Export mock services
export const db = mockDb;
export const auth = mockAuth;
export { deleteField };

// Export auth functions
export const onAuthStateChanged = (authInstance, callback) => {
  return authInstance.onAuthStateChanged(callback);
};

export const signOut = async (authInstance) => {
  // Mock sign out - just clear the current user
  authInstance.currentUser = null;
  return Promise.resolve();
};

// Mock doc function
export const doc = (db, collection, docId) => db.doc(collection, docId);

// Mock setDoc function
export const setDoc = async (docRef, data, options = {}) => {
  return await docRef.set(data, options);
};

// Mock updateDoc function
export const updateDoc = async (docRef, data) => {
  // updateDoc should use merge: true by default and handle deleteField properly
  return await docRef.set(data, { merge: true });
};

// Mock getDoc function
export const getDoc = async (docRef) => {
  return await docRef.get();
};

// Mock onSnapshot function
export const onSnapshot = (docRef, callback) => {
  return docRef.onSnapshot(callback);
};

// Mock serverTimestamp function
export const serverTimestamp = () => {
  // In a real Firebase implementation, this would return a special sentinel value
  // For our mock, we'll return the current timestamp as a Date object
  return new Date();
};

// Mock collection function
export const collection = (db, path) => {
  return db.collection(path);
};

// Mock query function
export const query = (collectionRef, ...constraints) => {
  return {
    ...collectionRef,
    constraints
  };
};

// Mock orderBy function
export const orderBy = (field, directionStr) => {
  return {
    type: 'orderBy',
    field,
    directionStr
  };
};

// Mock Timestamp class for Firestore
export class Timestamp {
  constructor(seconds, nanoseconds = 0) {
    this.seconds = seconds;
    this.nanoseconds = nanoseconds;
  }
  
  toDate() {
    return new Date(this.seconds * 1000);
  }
  
  static fromDate(date) {
    return new Timestamp(Math.floor(date.getTime() / 1000));
  }
}

export default {
  db: mockDb,
  auth: mockAuth
};