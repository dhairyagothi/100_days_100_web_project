// js/storage.js
export function saveData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving data:', error);
        return false;
    }
}

export function loadData(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading data:', error);
        return [];
    }
}

export function clearAllData() {
    try {
        localStorage.clear();
        return true;
    } catch (error) {
        console.error('Error clearing data:', error);
        return false;
    }
}