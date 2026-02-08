const admin = require('firebase-admin');

// ====================================
// 🔥 FIREBASE CONFIGURATION
// ====================================
// Replace this entire object with your Firebase service account key
// You can get this from Firebase Console > Project Settings > Service Accounts > Generate New Private Key

const serviceAccount = {
  "type": "service_account",
  "project_id": "YOUR_PROJECT_ID",
  "private_key_id": "YOUR_PRIVATE_KEY_ID",
  "private_key": "YOUR_PRIVATE_KEY",
  "client_email": "YOUR_CLIENT_EMAIL",
  "client_id": "YOUR_CLIENT_ID",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "YOUR_CERT_URL"
};

// ====================================
// Initialize Firebase Admin
// ====================================
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com" // Replace with your database URL
  });
  console.log('🔥 Firebase initialized successfully!');
} catch (error) {
  console.error('❌ Firebase initialization error:', error.message);
}

const db = admin.firestore();

// ====================================
// Database Helper Functions
// ====================================

const database = {
  // User Management
  async getUser(userId) {
    try {
      const doc = await db.collection('users').doc(userId).get();
      return doc.exists ? doc.data() : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  async setUser(userId, data) {
    try {
      await db.collection('users').doc(userId).set(data, { merge: true });
      return true;
    } catch (error) {
      console.error('Error setting user:', error);
      return false;
    }
  },

  async updateUser(userId, data) {
    try {
      await db.collection('users').doc(userId).update(data);
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  },

  async getAllUsers() {
    try {
      const snapshot = await db.collection('users').get();
      const users = {};
      snapshot.forEach(doc => {
        users[doc.id] = doc.data();
      });
      return users;
    } catch (error) {
      console.error('Error getting all users:', error);
      return {};
    }
  },

  // Group Management
  async getGroup(groupId) {
    try {
      const doc = await db.collection('groups').doc(groupId).get();
      return doc.exists ? doc.data() : null;
    } catch (error) {
      console.error('Error getting group:', error);
      return null;
    }
  },

  async setGroup(groupId, data) {
    try {
      await db.collection('groups').doc(groupId).set(data, { merge: true });
      return true;
    } catch (error) {
      console.error('Error setting group:', error);
      return false;
    }
  },

  async updateGroup(groupId, data) {
    try {
      await db.collection('groups').doc(groupId).update(data);
      return true;
    } catch (error) {
      console.error('Error updating group:', error);
      return false;
    }
  },

  // Cards Management
  async getCard(cardId) {
    try {
      const doc = await db.collection('cards').doc(cardId).get();
      return doc.exists ? doc.data() : null;
    } catch (error) {
      console.error('Error getting card:', error);
      return null;
    }
  },

  async setCard(cardId, data) {
    try {
      await db.collection('cards').doc(cardId).set(data, { merge: true });
      return true;
    } catch (error) {
      console.error('Error setting card:', error);
      return false;
    }
  },

  async getAllCards() {
    try {
      const snapshot = await db.collection('cards').get();
      const cards = {};
      snapshot.forEach(doc => {
        cards[doc.id] = doc.data();
      });
      return cards;
    } catch (error) {
      console.error('Error getting all cards:', error);
      return {};
    }
  },

  async deleteCard(cardId) {
    try {
      await db.collection('cards').doc(cardId).delete();
      return true;
    } catch (error) {
      console.error('Error deleting card:', error);
      return false;
    }
  },

  // Settings Management
  async getSetting(key) {
    try {
      const doc = await db.collection('settings').doc(key).get();
      return doc.exists ? doc.data().value : null;
    } catch (error) {
      console.error('Error getting setting:', error);
      return null;
    }
  },

  async setSetting(key, value) {
    try {
      await db.collection('settings').doc(key).set({ value });
      return true;
    } catch (error) {
      console.error('Error setting setting:', error);
      return false;
    }
  }
};

module.exports = { admin, db, database };
