import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: { translation: {
    home: 'Home', inventory: 'Inventory', shopping: 'Shopping', stats: 'Spending', settings: 'Settings',
    greeting: 'Good to see you', overview: 'Here is what needs attention at home.',
    expiringSoon: 'Expiring soon', expired: 'Expired', lowStock: 'Low stock',
    addItem: 'Add item', addToList: 'Add to list', viewAll: 'View all', suggestions: 'Suggested for your next shop',
    searchItems: 'Search household items', all: 'All', available: 'Available',
    deviceSetup: 'Name this device', deviceHelp: 'Changes will be recorded using this name. No personal account is needed.',
    continue: 'Continue', language: 'Language', activity: 'Recent activity', notifications: 'Expiry notifications',
    enableNotifications: 'Enable notifications', household: 'Household', thisDevice: 'This device',
    totalSpend: 'Recorded spending', inventoryValue: 'Stock value', wasteCost: 'Waste / expired value',
    month: 'This month', byStore: 'By supermarket', byCategory: 'By category', emptyList: 'This list is empty.',
    createList: 'New list', estimatedTotal: 'Estimated total', markUsed: 'Used', markWasted: 'Wasted',
  }},
  si: { translation: {
    home: 'මුල් පිටුව', inventory: 'බඩු තොගය', shopping: 'සාප්පු ලැයිස්තු', stats: 'වියදම්', settings: 'සැකසුම්',
    greeting: 'ඔබව දැකීම සතුටක්', overview: 'නිවසේ අවධානය යොමු කළ යුතු දේ මෙන්න.',
    expiringSoon: 'ඉක්මනින් කල් ඉකුත් වේ', expired: 'කල් ඉකුත් වී ඇත', lowStock: 'අඩු තොග',
    addItem: 'භාණ්ඩයක් එක් කරන්න', addToList: 'ලැයිස්තුවට එක් කරන්න', viewAll: 'සියල්ල බලන්න', suggestions: 'ඊළඟ සාප්පු ගමන සඳහා යෝජනා',
    searchItems: 'ගෘහ භාණ්ඩ සොයන්න', all: 'සියල්ල', available: 'තිබේ',
    deviceSetup: 'මෙම දුරකථනය නම් කරන්න', deviceHelp: 'වෙනස්කම් මෙම නම යටතේ සටහන් වේ. පුද්ගලික ගිණුමක් අවශ්‍ය නැත.',
    continue: 'ඉදිරියට', language: 'භාෂාව', activity: 'මෑත ක්‍රියාකාරකම්', notifications: 'කල් ඉකුත් වීමේ දැනුම්දීම්',
    enableNotifications: 'දැනුම්දීම් සක්‍රිය කරන්න', household: 'නිවස', thisDevice: 'මෙම දුරකථනය',
    totalSpend: 'සටහන් කළ වියදම්', inventoryValue: 'තොග වටිනාකම', wasteCost: 'අපතේ / කල් ඉකුත් වටිනාකම',
    month: 'මෙම මාසය', byStore: 'සුපිරි වෙළඳසැල අනුව', byCategory: 'කාණ්ඩය අනුව', emptyList: 'මෙම ලැයිස්තුව හිස්ය.',
    createList: 'නව ලැයිස්තුව', estimatedTotal: 'ඇස්තමේන්තු මුළු මුදල', markUsed: 'භාවිතා කළා', markWasted: 'අපතේ',
  }},
}

i18n.use(initReactI18next).init({ resources, lng: 'en', fallbackLng: 'en', interpolation: { escapeValue: false } })

export default i18n
