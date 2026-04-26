export const listings = [
  { _id: '1', title: 'মিরপুর ১০ সিট মেস', area: 'মিরপুর', rent: 3500, type: 'seat', gender: 'male', amenities: ['WiFi', 'গ্যাস', 'পানি'], availableFrom: 'এখনই', description: 'পরিষ্কার পরিচ্ছন্ন মেস, ছাত্রদের জন্য উপযুক্ত।' },
  { _id: '2', title: 'ধানমন্ডি সাবলেট', area: 'ধানমন্ডি', rent: 8000, type: 'sublet', gender: 'any', amenities: ['AC', 'WiFi', 'লিফট'], availableFrom: 'এখনই', description: 'ধানমন্ডি লেকের কাছে সুন্দর সাবলেট।' },
  { _id: '3', title: 'উত্তরা মেয়েদের মেস', area: 'উত্তরা', rent: 4500, type: 'mess', gender: 'female', amenities: ['WiFi', 'সিকিউরিটি', 'গ্যাস'], availableFrom: 'এখনই', description: 'মেয়েদের জন্য নিরাপদ মেস।' },
  { _id: '4', title: 'মোহাম্মদপুর মেস সিট', area: 'মোহাম্মদপুর', rent: 3000, type: 'seat', gender: 'male', amenities: ['WiFi', 'পানি'], availableFrom: '১ মে', description: 'সাশ্রয়ী মূল্যে ভালো মেস।' },
];
export const users = [
  { _id: 'u1', name: 'রাফি আহমেদ', university: 'BUET', preferences: { smoking: false, sleepSchedule: 'early', social: 'quiet', diet: 'nonveg', prayers: true }, matchScore: 80 },
  { _id: 'u2', name: 'তানভীর হাসান', university: 'DU', preferences: { smoking: false, sleepSchedule: 'late', social: 'social', diet: 'nonveg', prayers: false }, matchScore: 60 },
  { _id: 'u3', name: 'সাকিব রহমান', university: 'NSU', preferences: { smoking: true, sleepSchedule: 'late', social: 'social', diet: 'nonveg', prayers: false }, matchScore: 40 },
];
export const chats = [
  { _id: 'c1', name: 'রাফি আহমেদ', lastMessage: 'ভাড়া কি কমবে?', time: '১০ মিনিট আগে', unread: 2 },
  { _id: 'c2', name: 'তানভীর হাসান', lastMessage: 'কবে দেখতে আসবো?', time: '১ ঘন্টা আগে', unread: 0 },
];
