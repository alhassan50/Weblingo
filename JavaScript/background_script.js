import {
    getUserPreferences
} from './webLingoDatabase/userPrefDatabase.js'

let selectedText

let getLanguages = async () => {
    const languagesRaw = await fetch('APIs/languages.json')
    return await languagesRaw.json()
}

chrome.runtime.onMessage.addListener(
    async (message, sender, sendResponse) => {
        
        if (message.action === 'createWebLingoContextMenu') {
            // Create the Quick Translate context menu
            const menuItems = [
                {
                  id: 'quickTranslate',
                  title: 'Quick Translate',
                  contexts: ['selection'],
                },
                {
                  id: 'translateToTargetLang',
                  title: 'Translate to...',
                  contexts: ['selection'],
                },
                {
                  id: 'lingoScan',
                  title: 'LingoScan',
                  contexts: ['selection'],
                },
            ];

            menuItems.forEach((menuItem) => {
                chrome.contextMenus.create(
                    {
                        id: menuItem.id,
                        title: menuItem.title,
                        contexts: menuItem.contexts
                    }
                )
            })

            try {
                let languages = await getLanguages()

                languages.forEach((language) => {
                    chrome.contextMenus.create(
                        {
                            id: language.code,
                            title: language.name,
                            parentId: 'translateToTargetLang',
                            contexts: ['selection']
                        }
                    )
                });
            } catch(error) {
                console.log(error);
            }
        }
    }
)

let fetchApiResp = async (url, method, data, parseType) => {
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        console.log(response.status);

        if (response.status != 200) {
            throw new Error("Network response was not ok", response);
        }

        console.log(response);

        const parsedResp = await response.json()
        
        const finalResult = parseType ? parsedResp.translation : parsedResp.lemma
        return finalResult
    } catch (error) {
        /* console.error('Error fetching API response:', error); */
        return `Error: ${error}`
    }
}

chrome.contextMenus.onClicked.addListener( async (info, tab) => {
    let userTranslationPref = await getUserPreferences('translationSettings')
    let userLingoScanPref = await getUserPreferences('lingoScanSettings')
    console.log(userTranslationPref);
    console.log(userLingoScanPref);
    let { src_lang, target_lang } = userTranslationPref
    const { trans_api } = userTranslationPref
    const {websterFeatures, oxfordFeatures, lemmatize} = userLingoScanPref
    selectedText = info.selectionText
    const method = 'POST'

    if (info.menuItemId === 'quickTranslate' || info.parentMenuItemId === 'translateToTargetLang') {
        console.log(info.menuItemId, ' ', info.selectionText);
        console.log(info.menuItemId, ' ', info.parentMenuItemId, ' ', info.selectionText);

        
        if (src_lang === 'noLanguage') {
            src_lang = ''
        }

        if (info.menuItemId === 'quickTranslate') {
            target_lang = target_lang
        } else if (info.parentMenuItemId === 'translateToTargetLang') {
            target_lang = info.menuItemId
        }
    
        const translationData = {
            text: selectedText,
            from: info.menuItemId === 'quickTranslate' ? src_lang : '',
            to: target_lang,
            APIChoice: trans_api
        }

        console.log(translationData);
        const googletranslationURL = `https://46nykrhdzl.execute-api.eu-north-1.amazonaws.com/Dev/api/getgoogletranslation`
        const mstranslationURL = `https://46nykrhdzl.execute-api.eu-north-1.amazonaws.com/Dev/api/getmstranslations`
        const translationURL = (trans_api === 'googleTranslation') ? googletranslationURL : mstranslationURL
        const translation = await fetchApiResp(translationURL, method , translationData, "text")

        console.log(translation);
        const translationResultData = {
            to: target_lang,
            translatedText: translation
        }
        const messageData = {
            feature: 'translation',
            data: translationResultData
        }
        sendResp(tab, messageData)
        
    } else if(info.menuItemId === 'lingoScan') {
        /* console.log(info.menuItemId, ' ', info.selectionText);
        console.log('yo wtf'); */

        try {
            let breakDown
            let formatedText = selectedText.toLowerCase();
            let features

            console.log('formatedText ', formatedText)
            if (lemmatize) {
                const lemmaURL = `https://46nykrhdzl.execute-api.eu-north-1.amazonaws.com/Dev/lemmatizerapi`
                const lemmaObj = {formatedText: formatedText}
                console.log(lemmaObj)
                formatedText = await fetchApiResp(lemmaURL, method , lemmaObj)
                console.log('lemma: ', formatedText)
                if (formatedText.length > 1) {
                    const messageData = {
                        feature: 'lingoScan redirect',
                        data: formatedText
                    }
                    sendResp(tab, messageData)
                    return
                } else if (formatedText.length === 1) {
                    formatedText = formatedText[0]
                } else {
                    throw new Error(`Lemmatizer Error`)
                }
            }

            //console.log('before fomttng: ', selectedText);
            if (userLingoScanPref.scan_api === 'webster') {
                console.log('websterrrrrrr');
                breakDown = await fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${formatedText}?key=e0deb228-d721-49a8-9b64-5cb72fee8698`)
            } else if (userLingoScanPref.scan_api === "oxford") {
                console.log('ox or free');
                breakDown = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${formatedText}`);
            }
            
            const breakDownJSON = await breakDown.json()
            let breakDownObjArr
            console.log(breakDownJSON);

            if (userLingoScanPref.scan_api === 'webster') {
                breakDownObjArr = websterFilter(breakDownJSON, formatedText)
                console.log("object ", breakDownObjArr);
                features = websterFeatures
            } else if (userLingoScanPref.scan_api === "oxford") {
                if (breakDownJSON.message && breakDownJSON.title && breakDownJSON.resolution) {
                    breakDownObjArr = []
                } else {
                    breakDownObjArr = filterFreeDictionary(breakDownJSON, formatedText)
                }
                console.log("JSON ", breakDownObjArr);
                features = oxfordFeatures
            } else {
                throw new Error("Error! Diictionary API not found")
            }

            const breakDownObjData = {
                breakDown: breakDownObjArr,
                apiType: userLingoScanPref.scan_api,
                lemma: formatedText,
                features: features
            }

            /* console.log(breakDownObjData.lemma);
            console.log(formatedText); */

            const messageData = {
                feature: 'lingoScan',
                data: breakDownObjData
            }
            sendResp(tab, messageData)
        } catch (error) {
            console.error('Error! ', error)
        }

    } else {
        console.log('Error', ' ', info.selectionText)        
    }
})

/* const sendResp = (action, res) => {
    console.log("sending message (bck)...");
    chrome.tabs.sendMessage(
        tab.id,
        { 
            action: 'displayTranslationResult',
        }
    );
    console.log("message sent(bck)...")
} */

function sendResp(tab, resp) {
    console.log('sending message (bck)...');
    chrome.tabs.sendMessage(
        tab.id,
        { 
            action: 'displayTranslationResult', 
            message: resp
        }
    );
    console.log('message sent (bck)...');
}

/////////////////////////FREE DICIONARY
const filterFreeDictionary = (breakDownJSON, phrase) => {
    const sourceUrls = breakDownJSON[0]?.sourceUrls;

    const finalscanResults = breakDownJSON.map((entry) => {
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
    return finalscanResults
}

/////////////////////////WEBSTER FILTER
const websterFilter = (breakDownJSON, phrase) => {
    // Filter the entries where the meta id starts with the phrase or is equal to the phrase
    const filteredEntries = breakDownJSON.filter(
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
  
    //console.log(resultArray);
    return resultArray;
};


/////////////////////google 

console.log("bckgrd");