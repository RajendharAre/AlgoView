import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';

// ==================== TUTORIALS ====================

export const tutorialsService = {
  // Get all tutorials
  async getAllTutorials() {
    try {
      const q = query(
        collection(db, 'tutorials'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching tutorials:', error);
      return [];
    }
  },

  // Get tutorials by category
  async getTutorialsByCategory(category) {
    try {
      const q = query(
        collection(db, 'tutorials'),
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching tutorials by category:', error);
      return [];
    }
  },

  // Get tutorials by difficulty
  async getTutorialsByDifficulty(difficulty) {
    try {
      const q = query(
        collection(db, 'tutorials'),
        where('difficulty', '==', difficulty),
        orderBy('rating', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching by difficulty:', error);
      return [];
    }
  },

  // Get single tutorial
  async getTutorialById(tutorialId) {
    try {
      const docSnap = await getDoc(doc(db, 'tutorials', tutorialId));
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching tutorial:', error);
      return null;
    }
  },

  // Search tutorials
  async searchTutorials(searchTerm) {
    try {
      const allTutorials = await this.getAllTutorials();
      const lowercaseSearch = searchTerm.toLowerCase();
      
      return allTutorials.filter(tutorial =>
        tutorial.title.toLowerCase().includes(lowercaseSearch) ||
        tutorial.description.toLowerCase().includes(lowercaseSearch) ||
        tutorial.tags.some(tag => tag.toLowerCase().includes(lowercaseSearch))
      );
    } catch (error) {
      console.error('Error searching tutorials:', error);
      return [];
    }
  },

  // Add new tutorial (admin only)
  async addTutorial(tutorialData) {
    try {
      const docRef = await addDoc(collection(db, 'tutorials'), {
        ...tutorialData,
        createdAt: new Date(),
        updatedAt: new Date(),
        views: 0,
        rating: 0,
        ratingCount: 0
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding tutorial:', error);
      throw error;
    }
  },

  // Update tutorial views
  async updateTutorialViews(tutorialId) {
    try {
      const tutorialRef = doc(db, 'tutorials', tutorialId);
      const docSnap = await getDoc(tutorialRef);
      if (docSnap.exists()) {
        await updateDoc(tutorialRef, {
          views: (docSnap.data().views || 0) + 1
        });
      }
    } catch (error) {
      console.error('Error updating views:', error);
    }
  }
};

// ==================== CODE EXAMPLES ====================

export const codeExamplesService = {
  async getAllCodeExamples() {
    try {
      const snapshot = await getDocs(
        collection(db, 'codeExamples')
      );
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching code examples:', error);
      return [];
    }
  },

  async getCodeExamplesByLanguage(language) {
    try {
      const q = query(
        collection(db, 'codeExamples'),
        where('language', '==', language)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching by language:', error);
      return [];
    }
  },

  async searchCodeExamples(searchTerm) {
    try {
      const allExamples = await this.getAllCodeExamples();
      const lowercaseSearch = searchTerm.toLowerCase();
      
      return allExamples.filter(example =>
        example.title.toLowerCase().includes(lowercaseSearch) ||
        example.description.toLowerCase().includes(lowercaseSearch)
      );
    } catch (error) {
      console.error('Error searching code examples:', error);
      return [];
    }
  }
};

// ==================== VIDEO COURSES ====================

export const videoCoursesService = {
  async getAllVideoCourses() {
    try {
      const snapshot = await getDocs(
        query(
          collection(db, 'videoCourses'),
          orderBy('createdAt', 'desc')
        )
      );
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching videos:', error);
      return [];
    }
  },

  async getVideosByCategory(category) {
    try {
      const q = query(
        collection(db, 'videoCourses'),
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching videos by category:', error);
      return [];
    }
  }
};

// ==================== DOCUMENTATION ====================

export const docsService = {
  async getAllDocs() {
    try {
      const snapshot = await getDocs(collection(db, 'docs'));
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching docs:', error);
      return [];
    }
  },

  async getDocsByCategory(category) {
    try {
      const q = query(
        collection(db, 'docs'),
        where('category', '==', category)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching docs by category:', error);
      return [];
    }
  }
};

// ==================== COMMUNITY ====================

export const communityService = {
  async getAllCommunities() {
    try {
      const snapshot = await getDocs(collection(db, 'community'));
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching communities:', error);
      return [];
    }
  }
};

// ==================== Q&A ====================

export const qaService = {
  async getAllQuestions() {
    try {
      const snapshot = await getDocs(
        query(
          collection(db, 'qaQuestions'),
          orderBy('views', 'desc')
        )
      );
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching QA questions:', error);
      return [];
    }
  },

  async getQuestionsByCategory(category) {
    try {
      const q = query(
        collection(db, 'qaQuestions'),
        where('category', '==', category),
        orderBy('views', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching by category:', error);
      return [];
    }
  }
};

// ==================== GENERAL UTILITIES ====================

// Search across all types
export const searchAllContent = async (searchTerm) => {
  try {
    const [tutorials, codeExamples, videoCourses, docs] = await Promise.all([
      tutorialsService.searchTutorials(searchTerm),
      codeExamplesService.searchCodeExamples(searchTerm),
      videoCoursesService.getAllVideoCourses(), // filter client-side
      docsService.getAllDocs() // filter client-side
    ]);

    return {
      tutorials,
      codeExamples,
      videoCourses,
      docs
    };
  } catch (error) {
    console.error('Error searching all content:', error);
    return {
      tutorials: [],
      codeExamples: [],
      videoCourses: [],
      docs: []
    };
  }
};
