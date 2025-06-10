import axios from "axios";

export const apiRequest = axios.create({
    baseURL: "http://localhost:5173",
    params: {
        "api_key": import.meta.env.VITE_API_KEY,
        "excludePartOfSpeech": "combining-form,family-name,given-name,interjection,abbreviation,idiom,affix,phrasal-verb,suffix,proper-noun,proper-noun-posessive,proper-noun-plural",
        "minCorpusCount": 5000,
        "limit": 60
    }
});