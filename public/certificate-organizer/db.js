/**
 * db.js - IndexedDB Helper Module for Certificate Organizer
 * Attached to global scope to support direct local file opening (no CORS errors).
 */

(function() {
  const DB_NAME = 'CertificateOrganizerDB';
  const DB_VERSION = 1;
  const STORE_NAME = 'certificates';

  /**
   * Initializes the IndexedDB database.
   * @returns {Promise<IDBDatabase>}
   */
  function initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        reject(`Database error: ${event.target.error?.message || event.target.errorCode}`);
      };
    });
  }

  /**
   * Retrieves all certificates from the store.
   * @returns {Promise<Array<Object>>}
   */
  async function getAllCertificates() {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = () => {
        reject(`Failed to retrieve certificates: ${request.error?.message}`);
      };
    });
  }

  /**
   * Adds a new certificate.
   * @param {Object} certificate 
   * @returns {Promise<string>} The generated/saved certificate ID
   */
  async function addCertificate(certificate) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      // Ensure it has an ID
      if (!certificate.id) {
        certificate.id = 'cert_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      }
      
      const request = store.add(certificate);

      request.onsuccess = () => {
        resolve(certificate.id);
      };

      request.onerror = () => {
        reject(`Failed to add certificate: ${request.error?.message}`);
      };
    });
  }

  /**
   * Updates an existing certificate.
   * @param {Object} certificate 
   * @returns {Promise<string>}
   */
  async function updateCertificate(certificate) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(certificate);

      request.onsuccess = () => {
        resolve(certificate.id);
      };

      request.onerror = () => {
        reject(`Failed to update certificate: ${request.error?.message}`);
      };
    });
  }

  /**
   * Deletes a certificate by its ID.
   * @param {string} id 
   * @returns {Promise<void>}
   */
  async function deleteCertificate(id) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(`Failed to delete certificate: ${request.error?.message}`);
      };
    });
  }

  /**
   * Clears all certificates from the store.
   * @returns {Promise<void>}
   */
  async function clearAllCertificates() {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(`Failed to clear database: ${request.error?.message}`);
      };
    });
  }

  // Export to global scope
  window.CertificateDB = {
    initDB,
    getAllCertificates,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    clearAllCertificates
  };
})();
