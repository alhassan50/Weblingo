let box

const go = () => {
    console.log('settting up listener(cnt)...');
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message && message.action === 'displayTranslationResult') {
          console.log('message received (cnt)');
          console.log("Message from bckgd script: ", message.message);
          const messageBck = message.message
          createBox(messageBck)
        }
    });
    console.log('finshed settting up listener(cnt)');
}



chrome.runtime.sendMessage(
    {
        action: "createWebLingoContextMenu",
        message: "switch off"
    }
)

go();
console.log('content');
//document.querySelector('body').innerText = `baaba`
console.log(document.querySelector('body'));

const injectFontLinks = () => {
    const fontFamilyLink = document.createElement('link');
    fontFamilyLink.rel = 'preconnect';
    fontFamilyLink.href = 'https://fonts.googleapis.com';

    const fontsGstaticLink = document.createElement('link');
    fontsGstaticLink.rel = 'preconnect';
    fontsGstaticLink.href = 'https://fonts.gstatic.com';
    fontsGstaticLink.crossOrigin = 'anonymous';

    const montserratFontLink = document.createElement('link');
    montserratFontLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&display=swap';
    montserratFontLink.rel = 'stylesheet';
    
    const headElement = document.querySelector('head');
    headElement.appendChild(fontFamilyLink);
    headElement.appendChild(fontsGstaticLink);
    headElement.appendChild(montserratFontLink);
}

const createDialogue = () => {
    /* let box = document.createElement('div')
    box.style.width = `200px`
    box.style.height = `200px`
    box.style.backgroundColor = `#fff`
    box.style.position = 'absolute';
    box.style.top = `0`
    box.style.right = `0`
    box.style.zIndex = `10000000000000000000000`

    return box */
    const box = document.createElement('div')
    box.style.boxSizing = `border-box`
    box.style.padding = `1.5rem 1rem`
    box.style.background = `white`
    box.style.minWidth = `300px`
    box.style.maxWidth = `300px`
    box.style.maxHeight = `300px`
    box.style.display = `flex`
    box.style.justifyContent = `start`
    box.style.alignItems = `flex-start`
    box.style.flexDirection = `column`
    box.style.overflow = `auto`
    box.style.borderRadius = `10px`
    box.style.boxShadow = `0 0 20px rgba(0, 0, 0, .9)`
    box.style.position = 'fixed';
    box.style.top = `10px`
    box.style.right = `10px`
    box.style.zIndex = `10000000000000000000000`    
    box.style.fontFamily = `'Montserrat', sans-serif`

    return box
}

const createMainHeader = (header, h3) => {
    const headerElement = document.createElement('h2')
    headerElement.innerText = header
    headerElement.style.margin = `0`
    headerElement.style.textAlign = `left`
    headerElement.style.fontSize = `16px`
    headerElement.style.color = `#000`
    headerElement.style.fontFamily = `'Montserrat', sans-serif`
    headerElement.style.marginBottom = `.7rem`

    const rule = document.createElement('div')
    rule.style.height = `1px`
    rule.style.width = `100%`
    rule.style.backgroundColor = `#eee`

    const subHeaderElement = document.createElement('h3')
    subHeaderElement.innerText = `${h3}`
    subHeaderElement.style.fontSize = `14px`
    subHeaderElement.style.color = `#000`
    subHeaderElement.style.fontFamily = `'Montserrat', sans-serif`
    subHeaderElement.style.marginTop = `.7rem`

    return {headerElement, rule, subHeaderElement}
}

let createMainContentTrans = (header, content) => {
    const {to, translatedText} = content
    const subHeadContent = `To: ${to}`
    const {headerElement, rule, subHeaderElement} = createMainHeader(header, subHeadContent)


    const contentElement = document.createElement('p')
    contentElement.style.margin = `0`
    contentElement.innerText = translatedText
    contentElement.style.lineHeight = `1.2rem`
    contentElement.style.letterSpacing = `.3px`
    contentElement.style.wordBreak = 'break-word';
    contentElement.style.marginTop = `.5rem`
    contentElement.style.fontSize = `14px`
    contentElement.style.color = `#000`
    contentElement.style.fontFamily = `'Montserrat', sans-serif`

    const mainContentContainer = document.createElement('div')
    mainContentContainer.style.color = `#000`
    mainContentContainer.appendChild(headerElement)
    mainContentContainer.appendChild(rule)
    mainContentContainer.appendChild(subHeaderElement)
    mainContentContainer.appendChild(contentElement)

    return mainContentContainer
}

const websterContent = (header, content) => {
    const {breakDown, lemma, features} = content
    const subHeadContent = `${lemma}`
    const {headerElement, rule, subHeaderElement} = createMainHeader(header, subHeadContent)

    const {shortDef, partOfSpeech, phoneSpelling, variations} = features

    console.log("features", features)
    
    const mainContentContainer = document.createElement('div')
    mainContentContainer.appendChild(headerElement)
    mainContentContainer.appendChild(rule)
    mainContentContainer.appendChild(subHeaderElement)

    breakDown.forEach((breakDownEl, index) => {
        const breakDownElContainer = document.createElement('div')
        const speechAndPhoneSp = document.createElement('h4')
        speechAndPhoneSp.innerText = `${breakDownEl.partOfSpeech} /${breakDownEl.phoneticSpelling}/`
        if (breakDownEl.phoneticSpelling === '' || !phoneSpelling) {
            speechAndPhoneSp.innerText = `${breakDownEl.partOfSpeech}`
        }
        speechAndPhoneSp.style.fontSize = `14px`
        speechAndPhoneSp.style.marginBottom = `3px`
        breakDownElContainer.appendChild(speechAndPhoneSp)
        
        let wordDefinitionsContainer = document.createElement('div')
        const wordDefinitions = breakDownEl.meaning
        let counter = 0
        wordDefinitions.forEach(definition => {
            counter++
            const wordDef = document.createElement('span')
            wordDef.innerText = `(${counter}) ${definition}`
            wordDef.style.display = `block`
            wordDefinitionsContainer.appendChild(wordDef)
        })
        wordDefinitionsContainer.style.fontSize = `12px`
        breakDownElContainer.appendChild(wordDefinitionsContainer)

        if (variations) {
            const wordVariation = breakDownEl.variation
            const wordVariationContainer = document.createElement('div')
            let wordStem = document.createElement('span')
            let variations = `<b>Forms:</b> `
            wordVariation.forEach((stem, index) => {
                variations += (index != wordVariation.length - 1) ? `${stem}, ` : `${stem} `
            })
            wordStem.innerHTML = variations.trim()
            wordVariationContainer.appendChild(wordStem) 
            wordVariationContainer.style.fontSize = `12px` 
            wordVariationContainer.style.marginTop = `5px`
            breakDownElContainer.appendChild(wordVariationContainer)
        } 
        
        if (index != breakDown.length - 1) {
            const ruleClone = rule.cloneNode(true)
            ruleClone.style.marginTop = `.7rem`
            breakDownElContainer.appendChild(ruleClone)
        }
        breakDownElContainer.style.marginTop = `.7rem`
        breakDownElContainer.style.marginBottom = `.7rem`
    
        mainContentContainer.appendChild(breakDownElContainer)

    });

    return mainContentContainer
}

const playSound = (url) => {
    const audio = new Audio(url); // Replace 'path/to/sound.mp3' with the actual path to your sound file
    audio.play();
}

const freeDictionaryContent = (header, content) => {
    const {breakDown, lemma, features} = content
    const {headerElement, rule, subHeaderElement} = createMainHeader(header, lemma)

    const {pronunciation, phoneSpelling, usages, synonyms, antonyms} = features

    console.log("features", features)

    const mainContentContainer = document.createElement('div')
    mainContentContainer.appendChild(headerElement)
    mainContentContainer.appendChild(rule)
    //mainContentContainer.appendChild(subHeaderElement)

    let mainCounter = 0
    breakDown.forEach((breakDownEl, index) => {
        mainCounter++
        const breakDownElContainer = document.createElement('div')
        let pronunciationURL

        if (breakDownEl.ukPronunciation != '' && breakDownEl.usPronunciation != '') {
            const accent = 'ukPronunciation'
            pronunciationURL = breakDownEl[accent]
        } else if (breakDownEl.ukPronunciation != '' || breakDownEl.usPronunciation != '') {
            pronunciationURL = breakDownEl.ukPronunciation != '' ? breakDownEl.ukPronunciation : breakDownEl.usPronunciation
        } else {
            pronunciation = false
        }

        if (pronunciation) {
            console.log("pronunciation: ", pronunciation)
            const fontAwesomeScript = `<script src="https://kit.fontawesome.com/a08852d450.js" crossorigin="anonymous"></script>`
            document.querySelector('head').innerHTML += fontAwesomeScript
            console.log(document.querySelector('head'));
        }

        const phoneticSpelling = phoneSpelling ? `/${breakDownEl.phoneticSpelling}/` : ``
        const icon = pronunciation ? `<i class="fa-solid fa-volume-high">sound </i>` : ``
        subHeaderElement.innerHTML = `${icon} <b>(${mainCounter})${lemma.toUpperCase()}</b> ${phoneticSpelling}`
        console.log(subHeaderElement);
        const cloneSubHeader = subHeaderElement.cloneNode(true)
        breakDownElContainer.appendChild(cloneSubHeader)
        cloneSubHeader.addEventListener('click', () => {
            //playSound('https://api.dictionaryapi.dev/media/pronunciations/en/rare-us.mp3')
            playSound(pronunciationURL)
        })

        const wikiLink = createLink(breakDownEl.wikiURL, 'Visit Wikipedia Page');
        const wikiURL = document.createElement('h4')
        wikiURL.innerHTML = `Wikipedia: `;
        wikiURL.appendChild(wikiLink);
        wikiURL.style.fontSize = `12px`
        wikiURL.style.marginBottom = `0`
        wikiURL.style.marginTop = `5px`
        breakDownElContainer.appendChild(wikiURL)

        const bodyDef = document.createElement('div')
        const breakDownBody = breakDownEl.body
        breakDownBody.forEach((breakDownBodyObj, index) => {
            //creates part of speech
            const partOfSpeech = document.createElement('h4')
            partOfSpeech.innerText = `${breakDownBodyObj.partOfSpeech}: ${lemma}`
            partOfSpeech.style.fontSize = `14px`
            partOfSpeech.style.marginBottom = `1px`
            partOfSpeech.style.marginTop = `10px`
            bodyDef.appendChild(partOfSpeech)
            
            const mainDefContainer = document.createElement('div')
            const wordDefs = breakDownBodyObj.definitions
            console.log(wordDefs);
            let counter = 0
            wordDefs.forEach(def => {
                counter++
                const defContainer = document.createElement('div')
                const definition = document.createElement('p')
                definition.style.marginBottom = `2px`
                definition.style.marginTop = `2px`
                if (def.definition) {
                    definition.innerHTML = `<b>(${counter})</b> ${def.definition}`;
                } else {
                    definition.innerText = ``
                    //definition.innerText = def.definition ? def.definition : ''
                }
                const exampleBox = document.createElement('div')
                if (def.examples) {
                    const examplesList = def.examples
                    examplesList.forEach(example => {
                        const exampleInd = document.createElement('i')
                        exampleInd.innerText = `${example}`
                        exampleInd.style.display = `block`
                        exampleBox.appendChild(exampleInd)
                    })
                    exampleBox.style.marginLeft = `10px`
                } else {
                    example.innerText = ``
                }
                defContainer.appendChild(definition)
                //defContainer.innerHTML += `USAGES: &nbsp;`
                defContainer.appendChild(exampleBox)
                defContainer.style.marginBottom = `7px`
                mainDefContainer.appendChild(defContainer)
            })
            bodyDef.appendChild(mainDefContainer)

            const synonymsEl = synonyms ? breakDownBodyObj.synonyms : []
            const antonymsEl = antonyms ? breakDownBodyObj.antonyms : []
            console.log(synonymsEl)
            console.log(antonymsEl)
            if (synonymsEl.length != 0) {
                const synonymsContainer = document.createElement('div')

                let syn_list = `<b>Similar: </b>`

                synonymsEl.forEach((syn, index) => {
                    syn_list += (index != synonymsEl.length - 1) ? `${syn}, ` : `${syn}. `
                })

                synonymsContainer.innerHTML = syn_list.trim()
                bodyDef.appendChild(synonymsContainer) 
            }

            if (antonymsEl.length != 0) {
                const antonymsContainer = document.createElement('div')

                let ant_list = `<b>Opposite: </b>`

                antonymsEl.forEach((ant, index) => {
                    ant_list += (index != antonymsEl.length - 1) ? `${ant}, ` : `${ant}. `
                })

                antonymsContainer.innerHTML = ant_list.trim()
                antonymsContainer.style.marginTop = `5px`
                bodyDef.appendChild(antonymsContainer)
            }

           
            
            bodyDef.style.fontSize = `12px`
            
            breakDownElContainer.appendChild(bodyDef)

            /* if (index != breakDownBody.length - 1) {
                const ruleClone = rule.cloneNode(true)
                ruleClone.style.marginTop = `.7rem`
                breakDownElContainer.appendChild(ruleClone)
            } */
        })

        mainContentContainer.appendChild(breakDownElContainer)
        if (index != breakDown.length - 1) {
            const ruleClone = rule.cloneNode(true)
            ruleClone.style.marginTop = `.7rem`
            mainContentContainer.appendChild(ruleClone)
        }
    });
    return mainContentContainer
}

const createMainContentLingoScan = (header, content) => {
    const {apiType} = content

    switch (apiType) {
        case "webster":
            createdContent = websterContent(header, content)
            break;
        case "oxford":
            createdContent = freeDictionaryContent(header, content)
            break;
        default:
            console.log("Error: no api type");
            break;
    }
    
    return createdContent
}

const createCloseBtn = () => {
    const closeBtn = document.createElement('div');
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '20px';
    closeBtn.style.right = '20px';
    closeBtn.style.width = '20px';
    closeBtn.style.height = '20px';
    closeBtn.style.borderRadius = '50%';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.display = 'flex';
    closeBtn.style.justifyContent = 'center';
    closeBtn.style.alignItems = 'center';
    closeBtn.style.alignItems = 'center';
    closeBtn.style.zIndex = '10000000000000000000001';
    closeBtn.style.background = `#eee`

    // Create the first div for the 'X'
    const closeX1 = document.createElement('div');
    closeX1.style.width = '15px';
    closeX1.style.height = '2px';
    closeX1.style.backgroundColor = '#000';
    closeX1.style.transform = 'rotate(45deg)';
    closeX1.style.position = 'absolute';
    closeX1.style.top = `9px`
    closeX1.style.right = `2.6px`

    // Create the second div for the 'X'
    const closeX2 = document.createElement('div');
    closeX2.style.width = '15px';
    closeX2.style.height = '2px';
    closeX2.style.backgroundColor = '#000';
    closeX2.style.transform = 'rotate(-45deg)';
    closeX2.style.position = 'absolute';
    closeX2.style.top = `9px`
    closeX2.style.right = `2.6px`

    // Add the 'X' divs to the close button
    closeBtn.appendChild(closeX1);
    closeBtn.appendChild(closeX2);

    return {closeBtn, closeX1, closeX2}
};

function createLink(url, phrase) {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.innerText = phrase;
    return link;
}
  
const loader = () => {
    const loaderBox = document.createElement('div')
    loaderBox.style.width = `100%`
    loaderBox.style.height = `100%`
    loaderBox.style.display = `flex`
    loaderBox.style.justifyContent = `center`
    loaderBox.style.alignItems = `center`
    
    const loaderMsg = document.createElement('h3')
    loaderMsg.innerText = `loading...`

    loaderBox.appendChild(loaderMsg)

    return loaderBox
}

const createBox = (message) => {
    /* const mainContent = `Lorem ipsum dolor sit amet, consectetur id nisl facilisis dapibus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipinsectetur adipiscing elit.em ipsum dolor sit amet, consectetur adipinsectetur adipiscing elit.` */
    if (box) {
        box.remove()
    }

    const {feature, data} = message

    injectFontLinks()
    
    let heading
    let mainContent
    let mainContentContainer

    box = createDialogue()
    const loaderBox = loader()
    box.appendChild(loaderBox)
    switch (feature) {
        case "translation":
            heading = `WebLingo Translation`
            mainContent = data
            mainContentContainer = createMainContentTrans(heading, mainContent)
            break;
        case "lingoScan":
            heading = `LingoScan`
            mainContent = data
            if (mainContent.breakDown.length != 0) {
                mainContentContainer = createMainContentLingoScan(heading, mainContent)
            } else {
                const errorBox = document.createElement('div')
                errorBox.innerHTML = `<p><b>:( &nbsp;LingoScan couldn't breakdown "${data.lemma}".</b><br><br>Troubleshoot...<br>1.&nbsp; Try selecting valid phrases eg. sign up.<br>2. &nbsp;Or select single words.<br>3. &nbsp;Turn on lemmatizer to convert words to &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;their basic form in WebLingo settings.</p>`
                errorBox.style.fontSize = `12px`
                errorBox.style.marginTop = `7px`
                mainContentContainer = createMainContentLingoScan(heading, mainContent)
                mainContentContainer.appendChild(errorBox)
            }
            break;
        default:
            break;
    }
    loaderBox.remove(loaderBox)
    box.appendChild(mainContentContainer)
    mainContentContainer.style.color = `#000`
    const {closeBtn, closeX1, closeX2} = createCloseBtn();
    box.appendChild(closeBtn);
    box.style.fontFamily = `'Montserrat', sans-serif`

    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = `#707070`
        closeX1.style.background = `#fff`
        closeX2.style.background = `#fff`
    })

    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = `#eee`
        closeX1.style.background = `#000`
        closeX2.style.background = `#000`
    })

    closeBtn.addEventListener('click', () => {
        box.remove()
    })

    const bodyElement = document.querySelector('body')
    bodyElement.appendChild(box)
}
