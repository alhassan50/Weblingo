import { chromeStorage } from './chromeStorageModule.js';

export function saveTranslationSettings(user_translation_pref) {    
    chromeStorage.setItem('translationSettings', JSON.stringify(user_translation_pref));
    console.log('Translation settings saved successfully.');
}

export function saveLingoScanSettings(user_lingoScan_pref) {
    chromeStorage.setItem('lingoScanSettings', JSON.stringify(user_lingoScan_pref));
    console.log('LingoScan settings saved successfully.');
}
  
export const getUserPreferences = async (database) => {
    try {
        const data = await chromeStorage.getItem(database);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error getting user preferences:', error);
        return null;
    }
};
