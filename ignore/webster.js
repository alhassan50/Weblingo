const phrase = 'rise';
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
  };
  return obj;
});

console.log(resultArray);
