'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// All 23 Sarvam AI supported languages (22 Scheduled Languages of India + English)
export type LanguageCode =
  | 'hi-IN'   // Hindi
  | 'bn-IN'   // Bengali
  | 'ta-IN'   // Tamil
  | 'te-IN'   // Telugu
  | 'mr-IN'   // Marathi
  | 'gu-IN'   // Gujarati
  | 'kn-IN'   // Kannada
  | 'ml-IN'   // Malayalam
  | 'pa-IN'   // Punjabi (Gurmukhi)
  | 'or-IN'   // Odia
  | 'as-IN'   // Assamese
  | 'ur-IN'   // Urdu
  | 'sa-IN'   // Sanskrit
  | 'ne-IN'   // Nepali
  | 'kok-IN'  // Konkani
  | 'brx-IN'  // Bodo
  | 'doi-IN'  // Dogri
  | 'ks-IN'   // Kashmiri
  | 'mai-IN'  // Maithili
  | 'mni-IN'  // Meitei / Manipuri
  | 'sat-IN'  // Santali
  | 'sd-IN'   // Sindhi
  | 'en-IN';  // English (India)

export interface LanguageOption {
  code: LanguageCode;
  name: string;        // English name
  nativeName: string;  // Native script name
  flag: string;        // Emoji flag
  script: string;      // Script system name
  speakers: string;    // Approx speaker count
  sarvamSupported: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'hi-IN',  name: 'Hindi',      nativeName: 'हिन्दी',       flag: '🇮🇳', script: 'Devanagari', speakers: '600M',  sarvamSupported: true },
  { code: 'bn-IN',  name: 'Bengali',    nativeName: 'বাংলা',         flag: '🇮🇳', script: 'Bengali',    speakers: '97M',   sarvamSupported: true },
  { code: 'ta-IN',  name: 'Tamil',      nativeName: 'தமிழ்',         flag: '🇮🇳', script: 'Tamil',      speakers: '75M',   sarvamSupported: true },
  { code: 'te-IN',  name: 'Telugu',     nativeName: 'తెలుగు',        flag: '🇮🇳', script: 'Telugu',     speakers: '83M',   sarvamSupported: true },
  { code: 'mr-IN',  name: 'Marathi',    nativeName: 'मराठी',         flag: '🇮🇳', script: 'Devanagari', speakers: '83M',   sarvamSupported: true },
  { code: 'gu-IN',  name: 'Gujarati',   nativeName: 'ગુજરાતી',       flag: '🇮🇳', script: 'Gujarati',   speakers: '56M',   sarvamSupported: true },
  { code: 'kn-IN',  name: 'Kannada',    nativeName: 'ಕನ್ನಡ',         flag: '🇮🇳', script: 'Kannada',    speakers: '57M',   sarvamSupported: true },
  { code: 'ml-IN',  name: 'Malayalam',  nativeName: 'മലയാളം',        flag: '🇮🇳', script: 'Malayalam',  speakers: '38M',   sarvamSupported: true },
  { code: 'pa-IN',  name: 'Punjabi',    nativeName: 'ਪੰਜਾਬੀ',        flag: '🇮🇳', script: 'Gurmukhi',   speakers: '52M',   sarvamSupported: true },
  { code: 'or-IN',  name: 'Odia',       nativeName: 'ଓଡ଼ିଆ',          flag: '🇮🇳', script: 'Odia',       speakers: '38M',   sarvamSupported: true },
  { code: 'as-IN',  name: 'Assamese',   nativeName: 'অসমীয়া',        flag: '🇮🇳', script: 'Bengali',    speakers: '15M',   sarvamSupported: true },
  { code: 'ur-IN',  name: 'Urdu',       nativeName: 'اردو',           flag: '🇮🇳', script: 'Nastaliq',   speakers: '50M',   sarvamSupported: true },
  { code: 'sa-IN',  name: 'Sanskrit',   nativeName: 'संस्कृत',        flag: '🇮🇳', script: 'Devanagari', speakers: '25K',   sarvamSupported: true },
  { code: 'ne-IN',  name: 'Nepali',     nativeName: 'नेपाली',         flag: '🇮🇳', script: 'Devanagari', speakers: '7M',    sarvamSupported: true },
  { code: 'kok-IN', name: 'Konkani',    nativeName: 'कोंकणी',         flag: '🇮🇳', script: 'Devanagari', speakers: '2.3M',  sarvamSupported: true },
  { code: 'mai-IN', name: 'Maithili',   nativeName: 'मैथिली',         flag: '🇮🇳', script: 'Devanagari', speakers: '13M',   sarvamSupported: true },
  { code: 'brx-IN', name: 'Bodo',       nativeName: 'बड़ो',            flag: '🇮🇳', script: 'Devanagari', speakers: '1.4M',  sarvamSupported: true },
  { code: 'doi-IN', name: 'Dogri',      nativeName: 'डोगरी',          flag: '🇮🇳', script: 'Devanagari', speakers: '2.6M',  sarvamSupported: true },
  { code: 'ks-IN',  name: 'Kashmiri',   nativeName: 'کٲشُر',          flag: '🇮🇳', script: 'Nastaliq',   speakers: '6.8M',  sarvamSupported: true },
  { code: 'mni-IN', name: 'Meitei',     nativeName: 'মৈতৈ লোন্',     flag: '🇮🇳', script: 'Meitei',     speakers: '1.8M',  sarvamSupported: true },
  { code: 'sat-IN', name: 'Santali',    nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ',       flag: '🇮🇳', script: 'Ol Chiki',   speakers: '7.6M',  sarvamSupported: true },
  { code: 'sd-IN',  name: 'Sindhi',     nativeName: 'سنڌي',           flag: '🇮🇳', script: 'Devanagari', speakers: '2.7M',  sarvamSupported: true },
  { code: 'en-IN',  name: 'English',    nativeName: 'English',         flag: '🇬🇧', script: 'Latin',      speakers: '265M',  sarvamSupported: true },
];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  'hi-IN': {
    janvaani_intro: 'जनवाणी पर आपका स्वागत है — लोगों की आवाज़!',
    choose_language_title: '🌐 अपनी भाषा चुनें / Choose Language',
    choose_language_subtitle: 'JanVaani में प्रवेश करने के लिए अपनी पसंदीदा भाषा पर टैप करें',
    confirm_language_btn: 'भाषा की पुष्टि करें और आगे बढ़ें →',
    brandTagline: 'जनवाणी पर आपका स्वागत है — लोगों की आवाज़!',
    welcomeTitle: 'जनवाणी - स्वास्थ्य सेवा आपकी आवाज़ में',
    welcomeSubtitle: 'भारत के राष्ट्रीय स्वास्थ्य ढांचे से वॉइस द्वारा जुड़ें',
    patientRole: 'मरीज़ (Patient Portal)',
    providerRole: 'डॉक्टर / प्रशासक (Provider/Admin Portal)',
    emergencyButton: 'आपातकालीन सहायता (112 / एम्बुलेंस)',
    listenPrompt: 'बोलने के लिए माइक दबाएं या टाइप करें',
    current_token: 'वर्तमान टोकन',
    patients_ahead: 'आपसे पहले मरीज',
    stop_new_tokens: 'नए टोकन लेना बंद करें',
    acceptingTokens: 'नए टोकन ले रहे हैं',
    offline: 'ऑफ़लाइन / नए टोकन बंद',
    doctorPausedMsg: '{doctor} (विभाग: {dept}) वर्तमान में नए टोकन स्वीकार नहीं कर रहे हैं।',
    suggestAlternative: 'क्या आप उसी विभाग के अन्य डॉक्टर {altDoctor} के पास टोकन बुक करना चाहते हैं?',
    bookToken: 'टोकन बुक करें',
    myTokens: 'मेरे एक्टिव टोकन',
    emergencyHeading: 'आपातकालीन चिकित्सा मार्ग',
    abdmSummary: 'ABDM मेडिकल इतिहास',
    voiceWizard: 'वॉइस प्रोफाइल विजार्ड',
    confirmAction: 'पुष्टि करें',
    voiceConsent: 'हाँ, मैं डॉक्टर एक्सेस की अनुमति देता हूँ',
    dataFreshness: 'डेटा ताज़गी',
    freshLive: 'लाइव',
    freshRecent: 'हाल का (<1 घंटा)',
    freshStale: 'पुराना (>4 घंटे)',
    poweredBySarvam: 'Sarvam AI द्वारा संचालित • 23+ भाषाएं',
    voiceReady: 'आवाज़ तैयार',
    listening: 'सुन रहे हैं... (बोलिए)',
    processing: 'समझ रहे हैं...',
    speaking: 'बोल रहे हैं...',
    speak_option: '🎙️ बोलकर बताएं',
    type_option: '⌨️ टाइप करें',
    type_or_speak_placeholder: 'यहाँ टाइप करें या माइक दबाकर बोलें...',
    replay_intro: '🔊 फिर से सुनें (Replay Intro)',
    voice_unavailable_msg: '⚠️ वॉइस इनपुट अस्थायी रूप से अनुपलब्ध है। आप टाइप कर सकते हैं।',
    you_said: 'आपने कहा',
    change_language: '🌐 भाषा बदलें',
  },

  'en-IN': {
    janvaani_intro: 'Welcome to JanVaani - The Voice Of The People !',
    choose_language_title: '🌐 Select Your Language / अपनी भाषा चुनें',
    choose_language_subtitle: 'Select your preferred language to proceed with JanVaani',
    confirm_language_btn: 'Confirm Language & Proceed →',
    brandTagline: 'Welcome to JanVaani - The Voice Of The People !',
    welcomeTitle: 'JanVaani - Voice-First Healthcare Orchestration',
    welcomeSubtitle: "Connect to India's Public Health Infrastructure by Voice",
    patientRole: 'Patient Portal',
    providerRole: 'Doctor / Provider Portal',
    emergencyButton: 'Emergency SOS (ERSS-112 / Ambulance)',
    listenPrompt: 'Tap microphone to speak or choose to type',
    current_token: 'Current Token',
    patients_ahead: 'Patients Ahead',
    stop_new_tokens: 'Stop Accepting New Tokens',
    acceptingTokens: 'Accepting new tokens',
    offline: 'Offline / Booking Paused',
    doctorPausedMsg: '{doctor} ({dept}) is currently not accepting new tokens.',
    suggestAlternative: 'Would you like to book with alternative doctor {altDoctor} in {dept}?',
    bookToken: 'Book Queue Token',
    myTokens: 'My Active Tokens',
    emergencyHeading: 'Deterministic Emergency Routing',
    abdmSummary: 'ABDM Medical History',
    voiceWizard: 'Guided Voice Profile Wizard',
    confirmAction: 'Confirm Action',
    voiceConsent: 'Yes, I allow doctor access',
    dataFreshness: 'Data Freshness',
    freshLive: 'LIVE',
    freshRecent: 'RECENT (<1h)',
    freshStale: 'STALE (>4h)',
    poweredBySarvam: 'Powered by Sarvam AI • 23+ Languages',
    voiceReady: 'Voice Ready',
    listening: 'Listening...',
    processing: 'Processing...',
    speaking: 'Speaking...',
    speak_option: '🎙️ Speak',
    type_option: '⌨️ Type Instead',
    type_or_speak_placeholder: 'Type here or tap microphone to speak...',
    replay_intro: '🔊 Replay Intro',
    voice_unavailable_msg: '⚠️ Voice input is temporarily unavailable. You can type instead.',
    you_said: 'You said',
    change_language: '🌐 Change Language',
  },

  'bn-IN': {
    janvaani_intro: 'জনবাণীতে আপনাকে স্বাগতম — জনগণের কণ্ঠ!',
    choose_language_title: '🌐 ভাষা নির্বাচন করুন / Select Language',
    choose_language_subtitle: 'জনবাণীতে প্রবেশের জন্য আপনার ভাষা বেছে নিন',
    confirm_language_btn: 'ভাষা নিশ্চিত করুন এবং এগিয়ে যান →',
    brandTagline: "Let's Begin With JanVaani - The Voice Of The People !",
    welcomeTitle: 'জনবাণী - গলায় বলুন স্বাস্থ্যসেবা',
    welcomeSubtitle: 'ভারতের ডিজিটাল স্বাস্থ্য পরিকাঠামোয় ভয়েস কানেকশন',
    patientRole: 'রোগী পোর্টাল (Patient)',
    providerRole: 'ডাক্তার / অ্যাডমিন পোর্টাল (Provider)',
    emergencyButton: 'জরুরি সাহায্য (১১২ / অ্যাম্বুলেন্স)',
    listenPrompt: 'কথা বলতে মাইক প্রেস করুন বা টাইপ করুন',
    current_token: 'বর্তমান টোকেন',
    patients_ahead: 'আপনার আগে রোগী',
    stop_new_tokens: 'নতুন টোকেন নেওয়া বন্ধ করুন',
    acceptingTokens: 'নতুন টোকেন গ্রহণ করা হচ্ছে',
    offline: 'অফলাইন',
    doctorPausedMsg: '{doctor} বর্তমানে নতুন টোকেন নিচ্ছেন না।',
    suggestAlternative: 'অন্য ডাক্তারের কাছে টোকেন বুক করবেন?',
    bookToken: 'টোকেন বুক করুন',
    myTokens: 'আমার টোকেন',
    emergencyHeading: 'জরুরি চিকিৎসা পথ',
    abdmSummary: 'ABDM মেডিকেল হিস্ট্রি',
    voiceWizard: 'ভয়েস প্রোফাইল উইজার্ড',
    confirmAction: 'নিশ্চিত করুন',
    voiceConsent: 'হ্যাঁ, আমি অনুমতি দিচ্ছি',
    dataFreshness: 'ডাটা ফ্রেশনেস',
    freshLive: 'লাইভ',
    freshRecent: 'সাম্প্রতিক',
    freshStale: 'পুরোনো',
    poweredBySarvam: 'Sarvam AI দ্বারা • ২৩+ ভাষা',
    voiceReady: 'ভয়েস প্রস্তুত',
    listening: 'শুনছি...',
    processing: 'বুঝছি...',
    speaking: 'বলছি...',
    speak_option: '🎙️ বলুন',
    type_option: '⌨️ টাইপ করুন',
    type_or_speak_placeholder: 'এখানে টাইপ করুন বা মাইকে বলুন...',
    replay_intro: '🔊 আবার শুনুন (Replay)',
    voice_unavailable_msg: '⚠️ ভয়েস ইনপুট সাময়িকভাবে অনুপলব্ধ। আপনি টাইপ করতে পারেন।',
    you_said: 'আপনি বলেছেন',
    change_language: '🌐 ভাষা পরিবর্তন',
  },

  'ta-IN': {
    janvaani_intro: 'ஜன்வாணிக்கு உங்களை வரவேற்கிறோம் — மக்களின் குரல்!',
    choose_language_title: '🌐 மொழியைத் தேர்ந்தெடுக்கவும்',
    choose_language_subtitle: 'ஜன்வாணியைப் பயன்படுத்த உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்',
    confirm_language_btn: 'மொழியை உறுதிசெய்து தொடரவும் →',
    brandTagline: "Let's Begin With JanVaani - The Voice Of The People !",
    welcomeTitle: 'ஜன்வாணி - உங்கள் குரலில் மருத்துவம்',
    welcomeSubtitle: 'இந்தியாவின் தேசிய சுகாதாரக் கட்டமைப்பில் குரல் வழி இணைப்பு',
    patientRole: 'நோயாளி (Patient)',
    providerRole: 'மருத்துவர் / நிர்வாகி (Provider)',
    emergencyButton: 'அவசர சிகிச்சை (112 / ஆம்புலன்ஸ்)',
    listenPrompt: 'பேச மைக் பொத்தானை அழுத்தவும்',
    current_token: 'தற்போதைய டோக்கன்',
    patients_ahead: 'உங்களுக்கு முன்னால் உள்ள நோயாளிகள்',
    stop_new_tokens: 'புதிய டோக்கன்களை நிறுத்து',
    acceptingTokens: 'புதிய டோக்கன்கள் ஏற்கப்படுகின்றன',
    offline: 'ஆஃப்லைன்',
    doctorPausedMsg: '{doctor} தற்போது புதிய டோக்கன்களை ஏற்கவில்லை.',
    suggestAlternative: 'மாற்று மருத்துவரிடம் டோக்கன் முன்பதிவு செய்ய விரும்புகிறீர்களா?',
    bookToken: 'டோக்கன் முன்பதிவு செய்',
    myTokens: 'எனது டோக்கன்கள்',
    emergencyHeading: 'அவசர மருத்துவ வழி',
    abdmSummary: 'ABDM மருத்துவ வரலாறு',
    voiceWizard: 'குரல் சுயவிவர வழிகாட்டி',
    confirmAction: 'உறுதிப்படுத்துக',
    voiceConsent: 'ஆம், மருத்துவர் அணுகலை அனுமதிக்கிறேன்',
    dataFreshness: 'தரவு புதுப்பிப்பு',
    freshLive: 'நேரலை',
    freshRecent: 'சமீபத்திய',
    freshStale: 'பழையது',
    poweredBySarvam: 'Sarvam AI மூலம் • 23+ மொழிகள்',
    voiceReady: 'குரல் தயார்',
    listening: 'கேட்கிறேன்...',
    processing: 'புரிந்துகொள்கிறேன்...',
    speaking: 'பேசுகிறேன்...',
    speak_option: '🎙️ பேசுங்கள்',
    type_option: '⌨️ தட்டச்சு செய்க',
    type_or_speak_placeholder: 'இங்கே தட்டச்சு செய்க அல்லது பேசவும்...',
    replay_intro: '🔊 மீண்டும் கேட்க (Replay)',
    voice_unavailable_msg: '⚠️ குரல் உள்ளீடு தற்காலிகமாக கிடைக்கவில்லை. தட்டச்சு செய்யலாம்.',
    you_said: 'நீங்கள் கூறியது',
    change_language: '🌐 மொழியை மாற்றவும்',
  },

  'te-IN': {
    janvaani_intro: 'జన్వాణికి స్వాగతం — ప్రజల గొంతు!',
    choose_language_title: '🌐 మీ భాషను ఎంచుకోండి',
    choose_language_subtitle: 'జన్వాణిలోకి ప్రవేశించడానికి భాషను ఎంచుకోండి',
    confirm_language_btn: 'భాషను ఖరారు చేసి కొనసాగండి →',
    brandTagline: "Let's Begin With JanVaani - The Voice Of The People !",
    welcomeTitle: 'జన్వాణి - మీ గొంతుతో ఆరోగ్య సేవలు',
    welcomeSubtitle: 'భారతదేశ ఆరోగ్య మౌలిక సదుపాయాలతో వాయిస్ కనెక్షన్',
    patientRole: 'పేషెంట్ (Patient)',
    providerRole: 'డాక్టర్ / అడ్మిన్ (Provider)',
    emergencyButton: 'అత్యవసర సేవ (112 / అంబులెన్స్)',
    listenPrompt: 'మాట్లాడటానికి మైక్ నొక్కండి',
    current_token: 'ప్రస్తుత టోకెన్',
    patients_ahead: 'మీ కంటే ముందు ఉన్న రోగులు',
    stop_new_tokens: 'కొత్త టోకెన్లను ఆపండి',
    acceptingTokens: 'కొత్త టోకెన్లు స్వీకరిస్తున్నారు',
    offline: 'ఆఫ్‌లైన్',
    doctorPausedMsg: '{doctor} ప్రస్తుతం కొత్త టోకెన్లను స్వీకరించడం లేదు.',
    suggestAlternative: 'మరొక డాక్టర్‌ని ఎంచుకోవాలనుకుంటున్నారా?',
    bookToken: 'టోకెన్ బుక్ చేయండి',
    myTokens: 'నా టోకెన్లు',
    emergencyHeading: 'అత్యవసర రౌటింగ్',
    abdmSummary: 'ABDM వైద్య చరిత్ర',
    voiceWizard: 'వాయిస్ ప్రొఫైల్ విజర్డ్',
    confirmAction: 'సరే',
    voiceConsent: 'అవును, డాక్టర్ యాక్సెస్‌ను అనుమతిస్తున్నాను',
    dataFreshness: 'డేటా తాజాగా ఉంది',
    freshLive: 'లైవ్',
    freshRecent: 'ఇటీవలి',
    freshStale: 'పాతది',
    poweredBySarvam: 'Sarvam AI ద్వారా • 23+ భాషలు',
    voiceReady: 'వాయిస్ సిద్ధం',
    listening: 'వింటున్నాను...',
    processing: 'అర్థం చేసుకుంటున్నాను...',
    speaking: 'మాట్లాడుతున్నాను...',
    speak_option: '🎙️ మాట్లాడండి',
    type_option: '⌨️ టైప్ చేయండి',
    type_or_speak_placeholder: 'ఇక్కడ టైప్ చేయండి లేదా మాట్లాడండి...',
    replay_intro: '🔊 మళ్లీ వినండి (Replay)',
    voice_unavailable_msg: '⚠️ వాయిస్ సేవ తాత్కాలికంగా అందుబాటులో లేదు. టైప్ చేయవచ్చు.',
    you_said: 'మీరు అన్నది',
    change_language: '🌐 భాష మార్చండి',
  },

  'mr-IN': {
    janvaani_intro: 'जनवाणीवर आपले स्वागत आहे — जनतेचा आवाज!',
    choose_language_title: '🌐 तुमची भाषा निवडा',
    choose_language_subtitle: 'जनवाणीमध्ये प्रवेश करण्यासाठी भाषा निवडा',
    confirm_language_btn: 'भाषा निश्चित करा आणि पुढे जा →',
    brandTagline: "Let's Begin With JanVaani - The Voice Of The People !",
    welcomeTitle: 'जनवाणी - तुमच्या आवाजात आरोग्यसेवा',
    welcomeSubtitle: 'भारताच्या आरोग्य पायाभूत सुविधांशी व्हॉईसद्वारे जोडा',
    patientRole: 'रुग्ण (Patient)',
    providerRole: 'डॉक्टर / प्रशासक (Provider)',
    emergencyButton: 'आणीबाणी सेवा (११२ / रुग्णवाहिका)',
    listenPrompt: 'बोलण्यासाठी माइक दाबा',
    current_token: 'सध्याचा टोकन',
    patients_ahead: 'तुमच्या आधीचे रुग्ण',
    stop_new_tokens: 'नवीन टोकन बंद करा',
    acceptingTokens: 'नवीन टोकन स्वीकारत आहेत',
    offline: 'ऑफलाईन',
    doctorPausedMsg: '{doctor} सध्या नवीन टोकन स्वीकारत नाहीत.',
    suggestAlternative: 'दुसऱ्या डॉक्टरांकडे टोकन बुक करायचे का?',
    bookToken: 'टोकन बुक करा',
    myTokens: 'माझे टोकन',
    emergencyHeading: 'आणीबाणी मार्ग',
    abdmSummary: 'ABDM वैद्यकीय इतिहास',
    voiceWizard: 'व्हॉईस प्रोफाईल मार्गदर्शक',
    confirmAction: 'पुष्टी करा',
    voiceConsent: 'होय, मी डॉक्टर प्रवेशास अनुमती देतो',
    dataFreshness: 'डेटा ताजेपणा',
    freshLive: 'लाइव्ह',
    freshRecent: 'अलीकडील',
    freshStale: 'जुना',
    poweredBySarvam: 'Sarvam AI द्वारे • 23+ भाषा',
    voiceReady: 'आवाज तयार',
    listening: 'ऐकत आहे...',
    processing: 'समजत आहे...',
    speaking: 'बोलत आहे...',
    speak_option: '🎙️ बोला',
    type_option: '⌨️ टाइप करा',
    type_or_speak_placeholder: 'इथे टाइप करा किंवा बोला...',
    replay_intro: '🔊 पुन्हा ऐका (Replay)',
    voice_unavailable_msg: '⚠️ व्हॉईस इनपुट तात्पुरते उपलब्ध नाही. तुम्ही टाइप करू शकता.',
    you_said: 'तुम्ही म्हणालात',
    change_language: '🌐 भाषा बदला',
  },

  'gu-IN': {
    janvaani_intro: 'જનવાણી પર આપનું સ્વાગત છે — જનતાનો અવાજ!',
    choose_language_title: '🌐 તમારી ભાષા પસંદ કરો',
    choose_language_subtitle: 'જનવાણીમાં પ્રવેશવા ભાષા પસંદ કરો',
    confirm_language_btn: 'ભાષાની પુષ્ટિ કરો અને આગળ વધો →',
    brandTagline: "Let's Begin With JanVaani - The Voice Of The People !",
    welcomeTitle: 'જનવાણી - તમારા અવાજમાં આરોગ્ય સેવા',
    welcomeSubtitle: 'ભારતના ડિજિટલ આરોગ્ય ઈન્ફ્રાસ્ટ્રક્ચર સાથે વૉઇસ કનેક્શન',
    patientRole: 'દર્દી (Patient)',
    providerRole: 'ડૉક્ટર / વ્યવસ્થાપક (Provider)',
    emergencyButton: 'કતોકટી સેવા (112 / એમ્બ્યુલન્સ)',
    listenPrompt: 'બોલવા માટે માઇક દબાવો',
    current_token: 'વર્તમાન ટોકન',
    patients_ahead: 'તમારી પહેલા દર્દીઓ',
    stop_new_tokens: 'નવા ટોકન લેવાનું બંધ કરો',
    acceptingTokens: 'નવા ટોકન સ્વીકારાઈ રહ્યા છે',
    offline: 'ઑફલાઇન',
    doctorPausedMsg: '{doctor} હાલ નવા ટોકન સ્વીકારી રહ્યા નથી.',
    suggestAlternative: 'બીજા ડૉક્ટર પાસે ટોકન બુક કરવું છે?',
    bookToken: 'ટોકન બુક કરો',
    myTokens: 'મારા ટોકન',
    emergencyHeading: 'કતોકટી માર્ગ',
    abdmSummary: 'ABDM તબીબી ઇતિહાસ',
    voiceWizard: 'વૉઇસ પ્રોફાઇલ વિઝાર્ડ',
    confirmAction: 'પુષ્ટિ કરો',
    voiceConsent: 'હા, હું ડૉક્ટર ઍક્સેસની પરવાનગી આપું છું',
    dataFreshness: 'ડેટા તાજગી',
    freshLive: 'લાઇવ',
    freshRecent: 'તાજેતરનું',
    freshStale: 'જૂનું',
    poweredBySarvam: 'Sarvam AI દ્વારા • 23+ ભાષાઓ',
    voiceReady: 'અવાજ તૈયાર',
    listening: 'સાંભળી રહ્યો છું...',
    processing: 'સમજી રહ્યો છું...',
    speaking: 'બોલી રહ્યો છું...',
    speak_option: '🎙️ બોલો',
    type_option: '⌨️ ટાઇપ કરો',
    type_or_speak_placeholder: 'અહીં ટાઇપ કરો અથવા બોલો...',
    replay_intro: '🔊 ફરી સાંભળો (Replay)',
    voice_unavailable_msg: '⚠️ અવાજ સેવા અસ્થાયી રૂપે અપ્રાપ્ય છે. તમે ટાઇપ કરી શકો છો.',
    you_said: 'તમે કહ્યું',
    change_language: '🌐 ભાષા બદલો',
  },

  'kn-IN': {
    janvaani_intro: 'ಜನವಾಣಿಗೆ സ്വാಗತ — ಜನರ ಧ್ವನಿ!',
    choose_language_title: '🌐 ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    choose_language_subtitle: 'ಜನವಾಣಿಗೆ ಪ್ರವೇಶಿಸಲು ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    confirm_language_btn: 'ಭಾಷೆಯನ್ನು ಖಚಿತಪಡಿಸಿ ಮುಂದುವರಿಯಿರಿ →',
    brandTagline: "Let's Begin With JanVaani - The Voice Of The People !",
    welcomeTitle: 'ಜನವಾಣಿ - ನಿಮ್ಮ ಧ್ವನಿಯಲ್ಲಿ ಆರೋಗ್ಯ ಸೇವೆ',
    welcomeSubtitle: 'ಭಾರತದ ಡಿಜಿಟಲ್ ಆರೋಗ್ಯ ಮೂಲಸೌಕರ್ಯಕ್ಕೆ ವಾಯ್ಸ್ ಸಂಪರ್ಕ',
    patientRole: 'ರೋಗಿ (Patient)',
    providerRole: 'ವೈದ್ಯರು / ಆಡಳಿತಾಧಿಕಾರಿ (Provider)',
    emergencyButton: 'ತುರ್ತು ಸೇವೆ (112 / ಆಂಬ್ಯುಲೆನ್ಸ್)',
    listenPrompt: 'ಮಾತನಾಡಲು ಮೈಕ್ ಒತ್ತಿ',
    current_token: 'ಪ್ರಸ್ತುತ ಟೋಕನ್',
    patients_ahead: 'ನಿಮಗಿಂತ ಮೊದಲಿನ ರೋಗಿಗಳು',
    stop_new_tokens: 'ಹೊಸ ಟೋಕನ್‌ಗಳನ್ನು ನಿಲ್ಲಿಸಿ',
    acceptingTokens: 'ಹೊಸ ಟೋಕನ್ ಸ್ವೀಕರಿಸಲಾಗುತ್ತಿದೆ',
    offline: 'ಆಫ್‌ಲೈನ್',
    doctorPausedMsg: '{doctor} ಪ್ರಸ್ತುತ ಹೊಸ ಟೋಕನ್‌ಗಳನ್ನು ಸ್ವೀಕರಿಸುತ್ತಿಲ್ಲ.',
    suggestAlternative: 'ಮತ್ತೊಬ್ಬ ವೈದ್ಯರನ್ನು ಆಯ್ಕೆ ಮಾಡಲು ಬಯಸುವಿರಾ?',
    bookToken: 'ಟೋಕನ್ ಬುಕ್ ಮಾಡಿ',
    myTokens: 'ನನ್ನ ಟೋಕನ್‌ಗಳು',
    emergencyHeading: 'ತುರ್ತು ಮಾರ್ಗ',
    abdmSummary: 'ABDM ವೈದ್ಯಕೀಯ ಇತಿಹಾಸ',
    voiceWizard: 'ವಾಯ್ಸ್ ಪ್ರೊಫೈಲ್ ಮಾರ್ಗದರ್ಶಿ',
    confirmAction: 'ಖಚಿತಪಡಿಸಿ',
    voiceConsent: 'ಹೌದು, ನಾನು ವೈದ್ಯರ ಪ್ರವೇಶಕ್ಕೆ ಅನುಮತಿಸುತ್ತೇನೆ',
    dataFreshness: 'ಡೇಟಾ ತಾಜಾತನ',
    freshLive: 'ಲೈವ್',
    freshRecent: 'ಇತ್ತೀಚಿನ',
    freshStale: 'ಹಳೆಯದು',
    poweredBySarvam: 'Sarvam AI ಮೂಲಕ • 23+ ಭಾಷೆಗಳು',
    voiceReady: 'ಧ್ವನಿ ಸಿದ್ಧ',
    listening: 'ಕೇಳುತ್ತಿದ್ದೇನೆ...',
    processing: 'ಅರ್ಥಮಾಡಿಕೊಳ್ಳುತ್ತಿದ್ದೇನೆ...',
    speaking: 'ಮಾತನಾಡುತ್ತಿದ್ದೇನೆ...',
    speak_option: '🎙️ ಮಾತನಾಡಿ',
    type_option: '⌨️ ಟೈಪ್ ಮಾಡಿ',
    type_or_speak_placeholder: 'ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಮಾತನಾಡಿ...',
    replay_intro: '🔊 ಮತ್ತೆ ಕೇಳಿ (Replay)',
    voice_unavailable_msg: '⚠️ ಧ್ವನಿ ಇನ್‌ಪುಟ್ ತಾತ್ಕಾಲಿಕವಾಗಿ ಲಭ್ಯವಿಲ್ಲ. ನೀವು ಟೈಪ್ ಮಾಡಬಹುದು.',
    you_said: 'ನೀವು ಹೇಳಿದ್ದು',
    change_language: '🌐 ಭಾಷೆ ಬದಲಾಯಿಸಿ',
  },

  'ml-IN': {
    janvaani_intro: 'ജനവാണിയിലേക്ക് സ്വാഗതം — ജനങ്ങളുടെ ശബ്ദം!',
    choose_language_title: '🌐 നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കൂ',
    choose_language_subtitle: 'ജനവാണിയിലേക്ക് പ്രവേശിക്കാൻ ഭാഷ തിരഞ്ഞെടുക്കൂ',
    confirm_language_btn: 'ഭാഷ സ്ഥിരീകരിച്ച് തുടരൂ →',
    brandTagline: "Let's Begin With JanVaani - The Voice Of The People !",
    welcomeTitle: 'ജനവാണി - നിങ്ങളുടെ ശബ്ദത്തിൽ ആരോഗ്യ സേവനം',
    welcomeSubtitle: 'ഭാരതത്തിന്റെ ഡിജിറ്റൽ ആരോഗ്യ അടിസ്ഥാന സൗകര്യവുമായി ശബ്ദ ബന്ധം',
    patientRole: 'രോഗി (Patient)',
    providerRole: 'ഡോക്ടർ / ഭരണാധികാരി (Provider)',
    emergencyButton: 'അടിയന്തര സേവനം (112 / ആംബുലൻസ്)',
    listenPrompt: 'സംസാരിക്കാൻ മൈക്ക് അമർത്തൂ',
    current_token: 'നിലവിലെ ടോക്കൺ',
    patients_ahead: 'നിങ്ങൾക്ക് മുന്നിലുള്ള രോഗികൾ',
    stop_new_tokens: 'പുതിയ ടോക്കണുകൾ നിർത്തൂ',
    acceptingTokens: 'പുതിയ ടോക്കണുകൾ സ്വീകരിക്കുന്നു',
    offline: 'ഓഫ്‌ലൈൻ',
    doctorPausedMsg: '{doctor} ഇപ്പോൾ പുതിയ ടോക്കണുകൾ സ്വീകരിക്കുന്നില്ല.',
    suggestAlternative: 'മറ്റൊരു ഡോക്ടറുമായി ടോക്കൺ ബുക്ക് ചെയ്യണോ?',
    bookToken: 'ടോക്കൺ ബുക്ക് ചെയ്യൂ',
    myTokens: 'എന്റെ ടോക്കണുകൾ',
    emergencyHeading: 'അടിയന്തര മാർഗം',
    abdmSummary: 'ABDM ചികിത്സാ ചരിത്രം',
    voiceWizard: 'ശബ്ദ പ്രൊഫൈൽ വിസാർഡ്',
    confirmAction: 'സ്ഥിരീകരിക്കൂ',
    voiceConsent: 'അതെ, ഡോക്ടർ ആക്‌സസ് അനുവദിക്കുന്നു',
    dataFreshness: 'ഡേറ്റ പുതുമ',
    freshLive: 'തത്സമയം',
    freshRecent: 'സമീപകാലം',
    freshStale: 'പഴക്കമുള്ളത്',
    poweredBySarvam: 'Sarvam AI വഴി • 23+ ഭാഷകൾ',
    voiceReady: 'ശബ്ദം തയ്യാർ',
    listening: 'കേൾക്കുന്നു...',
    processing: 'മനസ്സിലാക്കുന്നു...',
    speaking: 'സംസാരിക്കുന്നു...',
    speak_option: '🎙️ പറയൂ',
    type_option: '⌨️ ടൈപ്പ് ചെയ്യൂ',
    type_or_speak_placeholder: 'ഇവിടെ ടൈപ്പ് ചെയ്യുക അല്ലെങ്കിൽ പറയുക...',
    replay_intro: '🔊 വീണ്ടും കേൾക്കൂ (Replay)',
    voice_unavailable_msg: '⚠️ ശബ്ദ സേവനം താൽക്കാലികമായി ലഭ്യമല്ല. ടൈപ്പ് ചെയ്യാം.',
    you_said: 'നിങ്ങൾ പറഞ്ഞത്',
    change_language: '🌐 ഭാഷ മാറ്റൂ',
  },

  'pa-IN': {
    janvaani_intro: 'ਜਨਵਾਣੀ \'ਤੇ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ — ਜਨਤਾ ਦੀ ਆਵਾਜ਼!',
    choose_language_title: '🌐 ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ',
    choose_language_subtitle: 'ਜਨਵਾਣੀ ਵਿੱਚ ਦਾਖਲ ਹੋਣ ਲਈ ਭਾਸ਼ਾ ਚੁਣੋ',
    confirm_language_btn: 'ਭਾਸ਼ਾ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ ਅਤੇ ਅੱਗੇ ਵਧੋ →',
    brandTagline: "Let's Begin With JanVaani - The Voice Of The People !",
    welcomeTitle: 'ਜਨਵਾਣੀ - ਤੁਹਾਡੀ ਆਵਾਜ਼ ਵਿੱਚ ਸਿਹਤ ਸੇਵਾ',
    welcomeSubtitle: 'ਭਾਰਤ ਦੇ ਡਿਜੀਟਲ ਸਿਹਤ ਢਾਂਚੇ ਨਾਲ ਵੌਇਸ ਕਨੈਕਸ਼ਨ',
    patientRole: 'ਮਰੀਜ਼ (Patient)',
    providerRole: 'ਡਾਕਟਰ / ਪ੍ਰਬੰਧਕ (Provider)',
    emergencyButton: 'ਐਮਰਜੈਂਸੀ ਸੇਵਾ (112 / ਐਂਬੂਲੈਂਸ)',
    listenPrompt: 'ਬੋਲਣ ਲਈ ਮਾਈਕ ਦਬਾਓ',
    current_token: 'ਮੌਜੂਦਾ ਟੋਕਨ',
    patients_ahead: 'ਤੁਹਾਡੇ ਤੋਂ ਪਹਿਲਾਂ ਮਰੀਜ਼',
    stop_new_tokens: 'ਨਵੇਂ ਟੋਕਨ ਬੰਦ ਕਰੋ',
    acceptingTokens: 'ਨਵੇਂ ਟੋਕਨ ਲਏ ਜਾ ਰਹੇ ਹਨ',
    offline: 'ਔਫਲਾਈਨ',
    doctorPausedMsg: '{doctor} ਇਸ ਵੇਲੇ ਨਵੇਂ ਟੋਕਨ ਨਹੀਂ ਲੈ ਰਹੇ।',
    suggestAlternative: 'ਕੀ ਤੁਸੀਂ ਕਿਸੇ ਹੋਰ ਡਾਕਟਰ ਕੋਲ ਟੋਕਨ ਬੁੱਕ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?',
    bookToken: 'ਟੋਕਨ ਬੁੱਕ ਕਰੋ',
    myTokens: 'ਮੇਰੇ ਟੋਕਨ',
    emergencyHeading: 'ਐਮਰਜੈਂਸੀ ਮਾਰਗ',
    abdmSummary: 'ABDM ਮੈਡੀਕਲ ਇਤਿਹਾਸ',
    voiceWizard: 'ਵੌਇਸ ਪ੍ਰੋਫਾਈਲ ਵਿਜ਼ਾਰਡ',
    confirmAction: 'ਪੁਸ਼ਟੀ ਕਰੋ',
    voiceConsent: 'ਹਾਂ, ਮੈਂ ਡਾਕਟਰ ਐਕਸੈੱਸ ਦੀ ਇਜਾਜ਼ਤ ਦਿੰਦਾ ਹਾਂ',
    dataFreshness: 'ਡੇਟਾ ਤਾਜ਼ਗੀ',
    freshLive: 'ਲਾਈਵ',
    freshRecent: 'ਤਾਜ਼ਾ',
    freshStale: 'ਪੁਰਾਣਾ',
    poweredBySarvam: 'Sarvam AI ਦੁਆਰਾ • 23+ ਭਾਸ਼ਾਵਾਂ',
    voiceReady: 'ਆਵਾਜ਼ ਤਿਆਰ',
    listening: 'ਸੁਣ ਰਿਹਾ ਹਾਂ...',
    processing: 'ਸਮਝ ਰਿਹਾ ਹਾਂ...',
    speaking: 'ਬੋਲ ਰਿਹਾ ਹਾਂ...',
    speak_option: '🎙️ ਬੋਲੋ',
    type_option: '⌨️ ਟਾਈਪ ਕਰੋ',
    type_or_speak_placeholder: 'ਇੱਥੇ ਟਾਈਪ ਕਰੋ ਜਾਂ ਬੋਲੋ...',
    replay_intro: '🔊 ਦੁਬਾਰਾ ਸੁਣੋ (Replay)',
    voice_unavailable_msg: '⚠️ ਆਵਾਜ਼ ਸੇਵਾ ਅਸਥਾਈ ਤੌਰ \'ਤੇ ਉਪਲਬਧ ਨਹੀਂ ਹੈ। ਤੁਸੀਂ ਟਾਈਪ ਕਰ ਸਕਦੇ ਹੋ।',
    you_said: 'ਤੁਸੀਂ ਕਿਹਾ',
    change_language: '🌐 ਭਾਸ਼ਾ ਬਦਲੋ',
  },

  'or-IN': {
    janvaani_intro: 'ଜନବାଣୀରେ ଆପଣଙ୍କୁ ସ୍ୱାଗତ — ଜନତାଙ୍କ ସ୍ୱର!',
    choose_language_title: '🌐 ଆପଣଙ୍କ ଭାଷା ବାଛନ୍ତୁ',
    choose_language_subtitle: 'ଜନବାଣୀରେ ପ୍ରବେଶ କରିବାକୁ ଭାଷା ବାଛନ୍ତୁ',
    confirm_language_btn: 'ଭାଷା ନିଶ୍ଚିତ କରନ୍ତୁ ଏବଂ ଆଗକୁ ବଢ଼ନ୍ତୁ →',
    brandTagline: "Let's Begin With JanVaani - The Voice Of The People !",
    welcomeTitle: 'ଜନବାଣୀ - ଆପଣଙ୍କ ସ୍ୱରରେ ସ୍ୱାସ୍ଥ୍ୟ ସେବା',
    welcomeSubtitle: 'ଭାରତର ଡିଜିଟାଲ ସ୍ୱାସ୍ଥ୍ୟ ଭିତ୍ତିଭୂମି ସହ ସ୍ୱର ସଂଯୋଗ',
    patientRole: 'ରୋଗୀ (Patient)',
    providerRole: 'ଡାକ୍ତର / ପ୍ରଶାସକ (Provider)',
    emergencyButton: 'ଜରୁରୀ ସେବା (112 / ଆମ୍ବୁଲାନ୍ସ)',
    listenPrompt: 'କଥା କହିବାକୁ ମାଇକ ଦବାନ୍ତୁ',
    current_token: 'ବର୍ତ୍ତମାନ ଟୋକେନ',
    patients_ahead: 'ଆପଣଙ୍କ ପୂର୍ବରୁ ରୋଗୀ',
    stop_new_tokens: 'ନୂଆ ଟୋକେନ ବନ୍ଦ କରନ୍ତୁ',
    acceptingTokens: 'ନୂଆ ଟୋକେନ ଗ୍ରହଣ ହେଉଛି',
    offline: 'ଅଫ୍‌ଲାଇନ',
    doctorPausedMsg: '{doctor} ବର୍ତ୍ତମାନ ନୂଆ ଟୋକେନ ଗ୍ରହଣ କରୁ ନାହାଁନ୍ତି।',
    suggestAlternative: 'ଅନ୍ୟ ଡାକ୍ତରଙ୍କ ସହ ଟୋକେନ ବୁକ କରିବେ?',
    bookToken: 'ଟୋକେନ ବୁକ କରନ୍ତୁ',
    myTokens: 'ମୋ ଟୋକେନ',
    emergencyHeading: 'ଜରୁରୀ ମାର୍ଗ',
    abdmSummary: 'ABDM ଚିକିତ୍ସା ଇତିହାସ',
    voiceWizard: 'ଭଏସ ପ୍ରୋଫାଇଲ ଉଇଜାର୍ଡ',
    confirmAction: 'ନିଶ୍ଚିତ କରନ୍ତୁ',
    voiceConsent: 'ହଁ, ଡାକ୍ତର ଆକ୍ସେସ ଅନୁମତି ଦେଉଛି',
    dataFreshness: 'ଡାଟା ସତ୍ୱରତା',
    freshLive: 'ଲାଇଭ',
    freshRecent: 'ସ୍ୱଳ୍ପ ପୁରୁଣା',
    freshStale: 'ପୁରୁଣା',
    poweredBySarvam: 'Sarvam AI ଦ୍ୱାରା • 23+ ଭାଷା',
    voiceReady: 'ସ୍ୱର ପ୍ରସ୍ତୁତ',
    listening: 'ଶୁଣୁଛି...',
    processing: 'ବୁଝୁଛି...',
    speaking: 'କଥା ହେଉଛି...',
    speak_option: '🎙️ କୁହନ୍ତୁ',
    type_option: '⌨️ ଟାଇପ କରନ୍ତୁ',
    type_or_speak_placeholder: 'ଏଠାରେ ଟାଇପ କରନ୍ତୁ କିମ୍ବା କୁହନ୍ତୁ...',
    replay_intro: '🔊 ପୁଣି ଶୁଣନ୍ତୁ (Replay)',
    voice_unavailable_msg: '⚠️ ସ୍ୱର ସେବା ଅସ୍ଥାୟୀ ଭାବେ ଅନୁପଲବ୍ଧ। ଆପଣ ଟାଇପ କରିପାରିବେ।',
    you_said: 'ଆପଣ କହିଲେ',
    change_language: '🌐 ଭାଷା ବଦଳାନ୍ତୁ',
  },

  'as-IN': {
    janvaani_intro: 'জনবাণীত আপোনাক স্বাগতম — ৰাইজৰ কণ্ঠ!',
    choose_language_title: '🌐 আপোনাৰ ভাষা বাছনি কৰক',
    choose_language_subtitle: 'জনবাণীত প্ৰৱেশ কৰিবলৈ ভাষা বাছনি কৰক',
    confirm_language_btn: 'ভাষা নিশ্চিত কৰক →',
    brandTagline: "Let's Begin With JanVaani - The Voice Of The People !",
    welcomeTitle: 'জনবাণী - আপোনাৰ কণ্ঠত স্বাস্থ্যসেৱা',
    bookToken: 'টোকেন বুক কৰক',
    myTokens: 'মোৰ টোকেন',
    speak_option: '🎙️ ক\'ওক',
    type_option: '⌨️ টাইপ কৰক',
    replay_intro: '🔊 পুনৰ শুনক',
    change_language: '🌐 ভাষা সলনি কৰক',
  },

  'ur-IN': {
    janvaani_intro: 'جن وانی میں آپ کا استقبال ہے — عوام کی آواز!',
    choose_language_title: '🌐 اپنی زبان منتخب کریں',
    choose_language_subtitle: 'جن وانی میں داخل ہونے کے لیے زبان منتخب کریں',
    confirm_language_btn: 'زبان کی تصدیق کریں →',
    brandTagline: "Let's Begin With JanVaani - The Voice Of The People !",
    welcomeTitle: 'جن وانی - آپ کی آواز میں صحت خدمات',
    bookToken: 'ٹوکن بک کریں',
    myTokens: 'میرے ٹوکن',
    speak_option: '🎙️ بولیں',
    type_option: '⌨️ ٹائپ کریں',
    replay_intro: '🔊 دوبارہ سنیں',
    change_language: '🌐 زبان تبدیل کریں',
  },

  'sa-IN': {
    janvaani_intro: 'जनवाण्यां भवतः स्वागतम् — जनानां वाक्!',
    choose_language_title: '🌐 स्वभाषां चिनुत',
    choose_language_subtitle: 'जनवाण्यां प्रवेशार्थं भाषां चिनुत',
    confirm_language_btn: 'भाषां दृढीकरोतु →',
    brandTagline: "Let's Begin With JanVaani - The Voice Of The People !",
    welcomeTitle: 'जनवाणी - आरोग्यसेवा आपस्य वाचि',
    bookToken: 'टोकन बुक करोतु',
    myTokens: 'मम टोकनानि',
    speak_option: '🎙️ वदतु',
    type_option: '⌨️ टङ्कणं करोतु',
    replay_intro: '🔊 पुनः शृणोतु',
    change_language: '🌐 भाषां परिवर्तयतु',
  },

  'ne-IN': {
    janvaani_intro: 'जनवाणीमा तपाईंलाई स्वागत छ — जनताको आवाज!',
    choose_language_title: '🌐 आफ्नो भाषा छान्नुहोस्',
    choose_language_subtitle: 'जनवाणीमा प्रवेश गर्न भाषा छान्नुहोस्',
    confirm_language_btn: 'भाषा पुष्टि गर्नुहोस् →',
    brandTagline: "Let's Begin With JanVaani - The Voice Of The People !",
    welcomeTitle: 'जनवाणी - तपाईंको आवाजमा स्वास्थ्य सेवा',
    bookToken: 'टोकन बुक गर्नुहोस्',
    myTokens: 'मेरो टोकन',
    speak_option: '🎙️ बोल्नुहोस्',
    type_option: '⌨️ टाइप गर्नुहोस्',
    replay_intro: '🔊 फेरि सुन्नुहोस्',
    change_language: '🌐 भाषा फेर्नुहोस्',
  },

  'kok-IN': {
    janvaani_intro: 'जनवाणींत तुमचें स्वागत — लोकांचो आवाज!',
    choose_language_title: '🌐 तुमची भास निवडात',
    choose_language_subtitle: 'जनवाणींत भितर सरपाक भास निवडात',
    confirm_language_btn: 'भास पक्की करात →',
    brandTagline: "Let's Begin With JanVaani - The Voice Of The People !",
    welcomeTitle: 'जनवाणी - तुमच्या आवाजांत आरोग्य सेवा',
    bookToken: 'टोकन बुक करात',
    myTokens: 'माझें टोकन',
    speak_option: '🎙️ उलयात',
    type_option: '⌨️ टायप करात',
    replay_intro: '🔊 परतून आयकात',
    change_language: '🌐 भास बदलात',
  },

  'mai-IN': {
    janvaani_intro: 'जनवाणीमे अहाँक स्वागत अछि — जनताक आवाज!',
    choose_language_title: '🌐 अपन भाषा चुनू',
    choose_language_subtitle: 'जनवाणीमे प्रवेश लेल भाषा चुनू',
    confirm_language_btn: 'भाषा पुष्टि करू →',
    brandTagline: "Let's Begin With JanVaani - The Voice Of The People !",
    welcomeTitle: 'जनवाणी - अहाँक आवाजमे स्वास्थ्य सेवा',
    bookToken: 'टोकन बुक करू',
    myTokens: 'हमर टोकन',
    speak_option: '🎙️ बाजूनू',
    type_option: '⌨️ टाइप करू',
    replay_intro: '🔊 पुनः सुनू',
    change_language: '🌐 भाषा बदलू',
  },

  'brx-IN': {
    janvaani_intro: 'जनवाणीआव थांनो बरायबाय — सुबुंनि सोर!',
    choose_language_title: '🌐 नांगौ हाबा सायख',
    choose_language_subtitle: 'जनवाणीआव थांनो हाबा सायख',
    confirm_language_btn: 'हाबा खाथि खालामो →',
    brandTagline: "Let's Begin With JanVaani - The Voice Of The People !",
    welcomeTitle: 'जनवाणी - नांगौ सोरनिफ्रा थाखो होनाय सेवा',
    bookToken: 'टोकन बुक खो',
    myTokens: 'मोन टोकन',
    speak_option: '🎙️ बुं',
    type_option: '⌨️ टाइप खो',
    replay_intro: '🔊 फिन खोनासं',
    change_language: '🌐 हाबा सोलाय',
  },

  'doi-IN': {
    janvaani_intro: 'जनवाणी च तुंदा स्वागत है — लोकें दी आवाज!',
    choose_language_title: '🌐 अपनी भाशा चुनो',
    choose_language_subtitle: 'जनवाणी च प्रवेश लेई भाशा चुनो',
    confirm_language_btn: 'भाशा पक्की करो →',
    brandTagline: "Let's Begin With JanVaani - The Voice Of The People !",
    welcomeTitle: 'जनवाणी - तुंदी आवाज च स्वास्थ्य सेवा',
    bookToken: 'टोकन बुक करो',
    myTokens: 'मेरे टोकन',
    speak_option: '🎙️ बोलो',
    type_option: '⌨️ टाइप करो',
    replay_intro: '🔊 फिर सुनो',
    change_language: '🌐 भाशा बदलो',
  },

  'ks-IN': {
    janvaani_intro: 'جنوانی میں خوش آمدید — لوکن ہنٛز آواز!',
    choose_language_title: '🌐 اپنٕ زبان چُنو',
    choose_language_subtitle: 'جنوانی میں داخل گژھنہٕ باپتھ زبان چُنو',
    confirm_language_btn: 'زبان تصدیق کرو →',
    brandTagline: "Let's Begin With JanVaani - The Voice Of The People !",
    welcomeTitle: 'جنوانی - صحت خدمت تُہند آواز میں',
    bookToken: 'ٹوکن بُک کرو',
    myTokens: 'میۂ ٹوکن',
    speak_option: '🎙️ بۄلیو',
    type_option: '⌨️ ٹائپ کرو',
    replay_intro: '🔊 دوبارہ بوزیو',
    change_language: '🌐 زبان بدلیو',
  },

  'mni-IN': {
    janvaani_intro: 'জনবাণীদা তরামনা ওকচরি — মীয়ামগী খোঞ্জেল!',
    choose_language_title: '🌐 নংগি লোন চিনবিয়ু',
    choose_language_subtitle: 'জনবাণীদা চংনবগীদমক লোন খনবিয়ু',
    confirm_language_btn: 'লোন কনফার্ম তৌবিয়ু →',
    brandTagline: "Let's Begin With JanVaani - The Voice Of The People !",
    welcomeTitle: 'জনবাণী - নংগি য়াইফরবা হেলথ সর্বিস',
    bookToken: 'টোকেন বুক তৌবিয়ু',
    myTokens: 'ঐগি টোকেন',
    speak_option: '🎙️ হায়বিয়ু',
    type_option: '⌨️ টাইপ তৌবিয়ু',
    replay_intro: '🔊 অমুক তাংবিয়ু',
    change_language: '🌐 লোন হোংবিয়ু',
  },

  'sat-IN': {
    janvaani_intro: 'JANVAANI RE SAGUN DARAM — JANTARAÂ AWAJ!',
    choose_language_title: '🌐 ᱟᱯᱮ ᱠᱷᱚᱱ ᱮᱢᱟᱜ',
    choose_language_subtitle: 'JANVAANI ᱨᱮ ᱵᱚᱞᱚ ᱞᱟᱹᱜᱤᱫ ᱯᱟᱹᱨᱥᱤ ᱥᱟᱞᱟᱭ ᱢᱮ',
    confirm_language_btn: 'ᱯᱟᱹᱨᱥᱤ ᱯᱩᱥᱴᱤ ᱢᱮ →',
    brandTagline: "Let's Begin With JanVaani - The Voice Of The People !",
    welcomeTitle: 'ᱡᱚᱱᱵᱟᱱᱤ - ᱟᱯᱮ ᱟᱣᱟᱡ ᱨᱮ ᱥᱮᱦᱮᱫ ᱥᱮᱵᱟ',
    bookToken: 'ᱴᱳᱠᱮᱱ ᱵᱩᱠ ᱢᱮ',
    myTokens: 'ᱟᱢ ᱴᱳᱠᱮᱱ',
    speak_option: '🎙️ ᱜᱟލᱚᱜ ᱢᱮ',
    type_option: '⌨️ ᱴᱟᱭᱤᱯ ᱢᱮ',
    replay_intro: '🔊 ᱟᱨᱦᱚᱸ ᱟᱸᱡᱚᱢ ᱢᱮ',
    change_language: '🌐 ᱯᱟᱹᱨᱥᱤ ᱵᱚᱫᱚᱞ ᱢᱮ',
  },

  'sd-IN': {
    janvaani_intro: 'جنواڻي ۾ ڀليڪار — عوام جي آواز!',
    choose_language_title: '🌐 پنهنجي ٻولي چونڊيو',
    choose_language_subtitle: 'جنواڻي ۾ داخل ٿيڻ لاء ٻولي چونڊيو',
    confirm_language_btn: 'ٻولي مڃتا ڪريو →',
    brandTagline: "Let's Begin With JanVaani - The Voice Of The People !",
    welcomeTitle: 'جنواڻي - توهانجي آواز ۾ صحت خدمت',
    bookToken: 'ٽوڪن بُڪ ڪريو',
    myTokens: 'منهنجا ٽوڪن',
    speak_option: '🎙️ ڳالهايو',
    type_option: '⌨️ ٽائپ ڪريو',
    replay_intro: '🔊 ٻيهر ٻڌو',
    change_language: '🌐 ٻولي تبديل ڪريو',
  },
};

// ─── Context Types ────────────────────────────────────────────────────────
interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  isLanguageConfirmed: boolean;
  confirmLanguageSelection: (code: LanguageCode) => void;
  t: (key: string, replacements?: Record<string, string>) => string;
  currentLangObj: LanguageOption;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>('hi-IN');
  const [isLanguageConfirmed, setIsLanguageConfirmed] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem('janvaani_language') as LanguageCode;
    const confirmed = localStorage.getItem('janvaani_lang_confirmed') === 'true';

    if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
      setLanguageState(saved);
    }
    if (confirmed) {
      setIsLanguageConfirmed(true);
    }
  }, []);

  const setLanguage = (code: LanguageCode) => {
    setLanguageState(code);
    localStorage.setItem('janvaani_language', code);
  };

  const confirmLanguageSelection = (code: LanguageCode) => {
    setLanguageState(code);
    setIsLanguageConfirmed(true);
    localStorage.setItem('janvaani_language', code);
    localStorage.setItem('janvaani_lang_confirmed', 'true');
  };

  // Translation lookup with English fallback
  const t = (key: string, replacements?: Record<string, string>): string => {
    const dict = TRANSLATIONS[language] || {};
    let str = dict[key] ?? TRANSLATIONS['hi-IN'][key] ?? TRANSLATIONS['en-IN'][key] ?? key;
    if (replacements) {
      Object.keys(replacements).forEach((k) => {
        str = str.replace(`{${k}}`, replacements[k]);
      });
    }
    return str;
  };

  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        isLanguageConfirmed,
        confirmLanguageSelection,
        t,
        currentLangObj,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
};
