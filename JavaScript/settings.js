import {
    saveTranslationSettings,
    saveLingoScanSettings,
    getUserPreferences
} from './webLingoDatabase/userPrefDatabase.js'


//DOM ELEMENTS
const translateNav = document.querySelector('.trans-nav')
const lingoScanNav = document.querySelector('.scan-nav')
const translateSettings = document.querySelector('.translate-settings')
const lingoScanSettings = document.querySelector('.lingo-settings')
const autoDetectCheckbox = document.querySelector('#auto_detect')
const select_src_lang = document.getElementById('source_lang')
const select_trgt_lang = document.getElementById('target_lang')
const select_trans_api = document.getElementById('translation_api')
const select_trans_display = translateSettings.querySelector('#trans_display')
const select_scan_display = lingoScanSettings.querySelector('#scan_display')
const select_lingoScan_api = document.getElementById('lingoscan_api')
const submitTranslationBtn = document.querySelector('.translation-submit')
const submitScanBtn = document.querySelector('.lingoscan-submit')
const featuresCheckBox = lingoScanSettings.querySelectorAll('input[type="checkbox"]')
console.log(featuresCheckBox);

//SETS DEFAULT USER TRANSLATION SETTINGS
const default_user_trans_preferences = {
    auto_detect_src: false,
    src_lang: 'en',
    target_lang: 'fr',
    trans_api: 'googleTranslation',
    trans_display: 'dialogue',
}

const oxfordFeatures = {
    shortDef: true,
    partOfSpeech: true,
    pronunciation: true,
    phoneSpelling: true,
    usages: true,
    synonyms: true,
    antonyms: false
}

const websterFeatures = {
    shortDef: true,
    partOfSpeech: true,
    phoneSpelling: true,
    variations: true,
}

//SETS DEFAULT USER LINGOSCAN SETTINGS
const default_user_lingo_scan_preferences = {
    scan_api: 'oxford',
    scan_display: 'dialogue',   
    oxfordFeatures: oxfordFeatures,
    websterFeatures: websterFeatures,
    lemmatize: true
}

//DISABLES AN INPUT ELEMENT
const disableElement = (element, value) => {
    element.disabled = value
}

//DEBUGGER
/* const l = await getUserPreferences('translationSettings')
const p = await getUserPreferences('lingoScanSettings')
console.log(l, 'h');
console.log(p); */


//ACTIVATES TRANSLATION SETTINGS
const activateTransNav = () => {
    //changes the color of the active nav link
    translateNav.classList.add('active')
    lingoScanNav.classList.remove('active')

    //shows active translate settings and hides lingoscan settings
    translateSettings.classList.add('show')
    lingoScanSettings.classList.remove('show')
}

//ACTIVATES LINGOSCAN SETTINGS
const activateLingoScanNav = () => {
    //changes the color of the active nav link
    lingoScanNav.classList.add('active')
    translateNav.classList.remove('active')

    //shows active lingoscan settings and hides translate settings
    lingoScanSettings.classList.add('show')
    translateSettings.classList.remove('show')
}

//CREATES OPTIONS WITH EMPTY CONTENTS
const createEmptyOption = (value, parentElement) => {
    const emptyOption = document.createElement('option')
    emptyOption.textContent = ''
    emptyOption.value = value
    parentElement.appendChild(emptyOption)
    
    return emptyOption
}

//POPULATES SELECT ELEMENT WITH OPTIONS
const populateSelectELement = (optionsJSON, selectElement1, selectElement2, selectedOption) => {
    optionsJSON.forEach((option) => {
        const optionEl = document.createElement('option')

        optionEl.value = option.code
        optionEl.textContent = option.name

        if (selectedOption != null && optionEl.textContent === selectedOption) {
            optionEl.selected = true
        }

        selectElement1.appendChild(optionEl)
        if (selectElement2 != null) {
            selectElement2.appendChild(optionEl.cloneNode(true))
        }
    })
}

const disableSave = (parent) => {
    const savedChanges = parent.querySelector('.saved')
    const unsavedChanges = parent.querySelector('.unsaved')

    parent.classList.add('disable')
    unsavedChanges.classList.add('hide')
    savedChanges.classList.add('show')
}

const enableSave = (parent) => {
    const savedChanges = parent.querySelector('.saved')
    const unsavedChanges = parent.querySelector('.unsaved')

    parent.classList.remove('disable')
    unsavedChanges.classList.remove('hide')
    savedChanges.classList.remove('show')
}

const activateOxfordFeatures = (oxfordFeatures) => {
    document.querySelector('.webster-features').style.display = `none`
    document.querySelector('.oxford-features').style.display = ``

    /* ({ shortDef, partOfSpeech, pronunciation, phoneSpelling, usages, synonyms, antonyms } = oxfordFeatures) */

    lingoScanSettings.oxford_short_def.checked = oxfordFeatures.shortDef,
    lingoScanSettings.oxford_part_of_speech.checked = oxfordFeatures.partOfSpeech,
    lingoScanSettings.oxford_pronunciation.checked = oxfordFeatures.pronunciation,
    lingoScanSettings.oxford_phone_spelling.checked = oxfordFeatures.phoneSpelling,
    lingoScanSettings.oxford_usages.checked = oxfordFeatures.usages,
    lingoScanSettings.oxford_synonyms.checked = oxfordFeatures.synonyms,
    lingoScanSettings.oxford_antonyms.checked = oxfordFeatures.antonyms

    console.log('oxxford');
}

const activateWebsterFeatures = (websterFeatures) => {
    document.querySelector('.webster-features').style.display = ``
    document.querySelector('.oxford-features').style.display = `none`

    /* ({ shortDef, partOfSpeech, pronunciation, phoneSpelling, usages, synonyms, antonyms } = websterFeatures) */

    lingoScanSettings.webster_short_def.checked = websterFeatures.shortDef,
    lingoScanSettings.webster_part_of_speech.checked = websterFeatures.partOfSpeech,
    lingoScanSettings.webster_phoneSpelling.checked = websterFeatures.phoneSpelling,
    lingoScanSettings.webster_variations.checked = websterFeatures.variations,

    console.log('websster');
}

let userTranslationPref
let userLingoScanPref

//WHEN PAGE LOADS
document.addEventListener('DOMContentLoaded', async () => {
    userTranslationPref = await getUserPreferences('translationSettings')
    userLingoScanPref = await getUserPreferences('lingoScanSettings')

    //CREATES A TRANSLATION SETTINGS DATABASE IF ONE DOESN'T ALREADY EXISTS
    if (userTranslationPref === null) {
        console.log("shit trans doesn't exists");
        console.log('default translation starts');
        saveTranslationSettings(default_user_trans_preferences)
        userTranslationPref = await getUserPreferences('translationSettings')
        console.log('default translation done');
    }

    //CREATES A LINGOSCAN SETTINGS DATABASE IF ONE DOESN'T ALREADY EXISTS
    if ( userLingoScanPref === null) {
        console.log("shit lingo doesn't exists");
        saveLingoScanSettings(default_user_lingo_scan_preferences)
        userLingoScanPref = await getUserPreferences('lingoScanSettings')
        console.log('def scan done');
    }

    //EXTRACTS PROPERTIES FROM EACH DATABASE
    const { auto_detect_src, src_lang, target_lang, trans_api, trans_display} = userTranslationPref
    const { scan_api, scan_display, oxfordFeatures, websterFeatures } = userLingoScanPref
    
    /* console.log(oxfordFeatures);
    console.log(websterFeatures); */

    //ACTIVATE TRANSLATION SETTINGS
    activateTransNav()

    try {
        //GET SUPPORTED LANGUAGES 
        const langRaw = await fetch('./JavaScript/APIs/languages.json')

        //GET TRANSLATION APIs
        const transAPIsRaw = await fetch('./JavaScript/APIs/translationAPIs.json')

        //GET SUPPORTED LINGOSCAN APIs
        const scanAPIsRaw = await fetch('./JavaScript/APIs/lingoScanAPIs.json')

        //CONVERT RAW DATA TO JSON FORMAT
        const langJSON = await langRaw.json()
        const transAPIsJSON = await transAPIsRaw.json()
        const scanAPIsJSON = await scanAPIsRaw.json()
    

        //DEBUGGER
        /* console.log(langJSON)
        console.log(transAPIsJSON)
        console.log(scanAPIsJSON) */

        //DISABLES 'SRC LANG ELEMENT' IF AUTO-DETECT IS CHECKED
        if (auto_detect_src) {
            autoDetectCheckbox.checked = true
            disableElement(select_src_lang, true)
        }

        //POPULATES LANGUAGES IN SRC & TARGET DROPDOWN
        populateSelectELement(langJSON, select_src_lang, select_trgt_lang, null)


        if (src_lang === 'noLanguage') {
            createEmptyOption('noLanguage', select_src_lang)
        }

        //SET LANGUAGES FOR SRC & TARGET BASED ON USER PREF OR DEFAULT SETTINGS
        select_src_lang.querySelector(`option[value="${src_lang}"]`).selected = true
        select_trgt_lang.querySelector(`option[value="${target_lang}"]`).selected = true

        //POPULATES TRANSLATION APIS IN TRANSLATION DROPDOWN
        populateSelectELement(transAPIsJSON, select_trans_api, null, trans_api)

        //SET THE TRANSLATION API BASED ON USER PREF
        select_trans_api.value = trans_api

        //SET THE TRANSLATION DISPLAY OPTION BASED ON USER PREF
        select_trans_display.value = trans_display

        //POPULATES LINGOSCAN APIS IN LINGOSCAN DROPDOWN
        populateSelectELement(scanAPIsJSON, select_lingoScan_api, null, scan_api)

        //SET THE LINGOSCAN APIs BASED ON USER PREF
        select_lingoScan_api.value = scan_api

        //SET THE LINGOSCAN DISPLAY OPTION BASED ON USER PREF
        if (scan_api === 'oxford' ) {
            activateOxfordFeatures(oxfordFeatures)

        } else if (scan_api === 'webster') {
            activateWebsterFeatures(websterFeatures)
        }

        //SET THE SCAN DISPLAY OPTION BASED ON USER PREF
        select_scan_display.value = scan_display

    } catch (error) {
        console.log(error)
    }
})

//MAIN NAVIGATION HANDLERS
translateNav.addEventListener('click', activateTransNav)
lingoScanNav.addEventListener('click', activateLingoScanNav)

//LISTENS FOR AUTO-DETECT AND DISABLE APPROPIRATE ELEMENTS
autoDetectCheckbox.addEventListener('change', (e) => {
    if (e.target.checked) {
        const optionValue = 'noLanguage'
        const emptySrcLang = createEmptyOption(optionValue, select_src_lang)
        emptySrcLang.selected = true
        disableElement(select_src_lang, true)
    } else {
        select_src_lang.disabled = false
        select_src_lang.querySelector('option[value="noLanguage"]').remove()
        select_src_lang.querySelector('option[value="en"]').selected = true
    }
    enableSave(submitTranslationBtn)
})

/* featuresCheckBox.addEventListener('click', () => {
    enableSave(submitScanBtn)
}) */

featuresCheckBox.forEach((feature) => {
    feature.addEventListener('change', () => {
        enableSave(submitScanBtn)
    })
})

const transDropDowns = translateSettings.querySelectorAll('select')
const scanDropDowns = lingoScanSettings.querySelectorAll('select')

transDropDowns.forEach((dropDown) => {
    dropDown.addEventListener('change', () => {
        enableSave(submitTranslationBtn)
    })
})

scanDropDowns.forEach((dropDown) => {
    dropDown.addEventListener('change', () => {
        enableSave(submitScanBtn)
        if (dropDown.value === 'webster') {
            const websterFeatures = userLingoScanPref.websterFeatures;
            activateWebsterFeatures(websterFeatures);
        } else if (dropDown.value === 'oxford') {
            const oxfordFeatures = userLingoScanPref.oxfordFeatures;
            activateOxfordFeatures(oxfordFeatures)
        }
    })
})


//HANDLE THE SUBMITION OF TRANSLATION SETTINGS
translateSettings.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log('yo');

    const user_trans_preferences = {
        auto_detect_src: translateSettings.auto_detect.checked,
        src_lang: translateSettings.source_lang.value,
        target_lang: translateSettings.target_lang.value,
        trans_api: translateSettings.translation_api.value,
        trans_display: translateSettings.display.value,
    }

    console.log(user_trans_preferences);

    saveTranslationSettings(user_trans_preferences)

    disableSave(submitTranslationBtn)
})

//HANDLE THE SUBMITION OF LINGOSCAN SETTINGS
lingoScanSettings.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log('yay')

    const oxfordFeatures = {
        shortDef: lingoScanSettings.oxford_short_def.checked,
        partOfSpeech: lingoScanSettings.oxford_part_of_speech.checked,
        pronunciation: lingoScanSettings.oxford_pronunciation.checked,
        phoneSpelling: lingoScanSettings.oxford_phone_spelling.checked,
        usages: lingoScanSettings.oxford_usages.checked,
        synonyms: lingoScanSettings.oxford_synonyms.checked,
        antonyms: lingoScanSettings.oxford_antonyms.checked
    }

    const websterFeatures = {
        shortDef: lingoScanSettings.webster_short_def.checked,
        partOfSpeech: lingoScanSettings.webster_part_of_speech.checked,
        phoneSpelling: lingoScanSettings.webster_phoneSpelling.checked,
        variations: lingoScanSettings.webster_variations.checked,
    }

    const user_lingo_scan_preferences = {
        scan_api: lingoScanSettings.lingoscan_api.value,
        scan_display: lingoScanSettings.display.value,
        oxfordFeatures: oxfordFeatures,
        websterFeatures: websterFeatures,
        lemmatize: lingoScanSettings.lingoscan_lemma.value,
    }

    console.log(oxfordFeatures);
    console.log(websterFeatures);

    saveLingoScanSettings(user_lingo_scan_preferences)

    disableSave(submitScanBtn)
})