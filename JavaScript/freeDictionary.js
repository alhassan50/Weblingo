import natural from 'natural';
const PorterStemmer = natural.PorterStemmer;
const wordToLemmatize = "happy"; // Replace "your_word_here" with the word you want to lemmatize
const lemma = PorterStemmer.stem(wordToLemmatize);
let breakDown;

if (lemma.trim().includes(' ')) {
  throw new Error("Invalid text. Only single words are allowed.");
} else {
  console.log('ox yes free');
  breakDown = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/happy`);
  const jsonResponse = await breakDown.json();
  const sourceUrls = jsonResponse[0]?.sourceUrls;

  const finalscanResults = jsonResponse.map((entry) => {
    const meanings = entry.meanings;
    const phoneticsArray = entry.phonetics;
    let ukPhoneticSpelling = ''; // Use 'let' instead of 'const'
    let usPhoneticSpelling = ''; // Use 'let' instead of 'const'
    let ukPronunciation = ''; // Use 'let' instead of 'const'
    let usPronunciation = ''; // Use 'let' instead of 'const'

    if (meanings && Array.isArray(meanings)) {
      const scanResult = {
        word: entry.word,
        phoneticSpelling: phoneticsArray[0]?.text,
        ukPhoneticSpelling: '',
        usPhoneticSpelling: '',
        ukPronunciation: '',
        usPronunciation: '',
        wikiURL: sourceUrls || '',
        body: meanings.map((meaning) => {
          let synonyms = [];
          let antonyms = [];
          let definitions = [];

          if (meaning.synonyms) {
            synonyms = Array.isArray(meaning.synonyms)
              ? meaning.synonyms
              : meaning.synonyms.split(',').map((syn) => syn.trim());
          }

          if (meaning.antonyms) {
            antonyms = Array.isArray(meaning.antonyms)
              ? meaning.antonyms
              : meaning.antonyms.split(',').map((ant) => ant.trim());
          }

          if (meaning.definitions) {
            definitions = meaning.definitions.map((def) => {
              const definition = def.definition.trim();
              const example = def.example ? def.example.trim() : null;

              return {
                definition: definition,
                synonyms: synonyms,
                antonyms: antonyms,
                examples: example ? [example] : [],
              };
            });
          }

          const ukPronunciationObj = phoneticsArray.find((pronunciation) => pronunciation.audio?.endsWith('uk.mp3'));
          const usPronunciationObj = phoneticsArray.find((pronunciation) => pronunciation.audio?.endsWith('us.mp3'));

          ukPhoneticSpelling = ukPronunciationObj?.text || ''; // Set value here
          usPhoneticSpelling = usPronunciationObj?.text || ''; // Set value here
          ukPronunciation = ukPronunciationObj?.audio || ''; // Set value here
          usPronunciation = usPronunciationObj?.audio || ''; // Set value here

          return {
            partOfSpeech: meaning.partOfSpeech,
            synonyms: synonyms,
            antonyms: antonyms,
            definitions: definitions,
          };
        }),
      };

      scanResult.ukPhoneticSpelling = ukPhoneticSpelling; // Set value here
      scanResult.usPhoneticSpelling = usPhoneticSpelling; // Set value here
      scanResult.ukPronunciation = ukPronunciation; // Set value here
      scanResult.usPronunciation = usPronunciation; // Set value here

      return scanResult;
    } else {
      return null;
    }
  }).filter((result) => result !== null);

  console.log(finalscanResults);
}
