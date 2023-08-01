/* const translationData = {
    text: "bread is good",
    from: "en",
    to: "fr",
    APIChoice: "googleTranslate",
};
  
const translationURL = `http://127.0.0.1:5001/platinum-hostels/us-central1/translateText`; */
  
/* try {
    const res = await fetch(translationURL, {
      method: "POST", // Add the method for the HTTP request
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(translationData),
    });
  
    const data = await res.text(); // Parse the response data as JSON
    console.log(data);
} catch (error) {
    console.error("Error during fetch:", error);
} */
/* const phrase = 'empathy';
const fetchURL = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${phrase}?key=e0deb228-d721-49a8-9b64-5cb72fee8698`;
const breakdown = await fetch(fetchURL);
const jsonResponse = await breakdown.json();

// Filter the entries where the meta id starts with the phrase or is equal to the phrase
const filteredEntries = jsonResponse.filter(
  (entry) => entry?.meta?.id.startsWith(`${phrase}:`) || entry?.meta?.id === phrase
);

// Create an array of objects with the required fields
const resultArray = filteredEntries.map((entry) => {
  const obj = {
    partOfSpeech: entry.fl, // Part of speech is stored in the 'fl' field
    variation: entry?.meta?.stems ? entry.meta.stems : [], // Variation is stored in the 'stems' field
    meaning: entry?.shortdef ? entry.shortdef : [], // Meaning is stored in the 'shortdef' field
    phoneticSpelling: entry?.hwi?.prs ? entry.hwi.prs[0]?.mw : '', // Phonetic spelling is stored in the 'hwi.prs' field
    synonyms: extractSynonyms(entry), // Extract synonyms from the entry
  };
  return obj;
});

// Helper function to extract synonyms from the entry
function extractSynonyms(entry) {
  const synonyms = [];

  // Check for 'syn_list' containing synonyms
  if (Array.isArray(entry?.syn_list)) {
    entry.syn_list.forEach((synonymGroup) => {
      synonymGroup.forEach((wordObject) => {
        if (wordObject?.wd && typeof wordObject.wd === 'string') {
          synonyms.push(wordObject.wd);
        }
      });
    });
  }

  // Check for 'sim_list' containing synonyms and near synonyms
  if (Array.isArray(entry?.sim_list)) {
    entry.sim_list.forEach((synonymGroup) => {
      synonymGroup.forEach((wordObject) => {
        if (wordObject?.wd && typeof wordObject.wd === 'string') {
          synonyms.push(wordObject.wd);
        }
      });
    });
  }

  return synonyms;
}

console.log(resultArray); */
// Load wink-lemmatizer
import lemmatizer from 'node-lemmatizer';
console.log(lemmatizer.only_lemmas('empathy'))
/* import natural from 'natural';
const PorterStemmer = natural.PorterStemmer;

export const lemmatizer = (text) => {
  return PorterStemmer.stem(text);
}

console.log(lemmatizer('signed')); */


