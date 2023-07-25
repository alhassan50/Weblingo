const oxfordFeatures = [
    {
        name: 'shortdef',
        id: 'short_def',
        type: `checkbox`,
        text: `&nbsp;Definition`,
        isChecked: true,
        isEnable: false
    },

    {
        name: 'partOfSpeech',
        id: 'part_of_speech',
        type: `checkbox`,
        text: `&nbsp;Grammatical feature`,
        isChecked: true,
        isEnable: false
    },

    {
        name: 'pronunciation',
        id: 'pronunciation',
        type: `checkbox`,
        text: `&nbsp;Definition`,
        isChecked: true,
        isEnable: true
    },

    {
        name: 'phoneSpelling',
        id: 'phone_spelling',
        type: `checkbox`,
        text: `&nbsp;Phonetic spelling`,
        isChecked: true,
        isEnable: true
    },

    {
        name: 'synonyms',
        id: 'synonyms',
        type: `checkbox`,
        text: `&nbsp;Synonyms`,
        isChecked: true,
        isEnable: true
    },

    {
        name: 'antonyms',
        id: 'antonyms',
        type: `checkbox`,
        text: `&nbsp;Antonyms`,
        isChecked: false,
        isEnable: true
    },
]

//for ---- id
//title --- name

const featuresSection = document.querySelector('.main-features-container')

const populateFeatures = (class1, class2, featuresList) => {
    let featureContainer
    featuresList.forEach(feature => {
        featureContainer = document.createElement('div')

        const featureLabel = document.createElement('label')
        featureLabel['for'] =  feature.id
        featureLabel.innerHTML = feature.text

        const featureElement = document.createElement('input')
        featureElement.type = feature.type
        featureElement.title = feature.name
        featureElement.name = feature.name
        featureElement.id = feature.id
        featureElement.checked = feature.isChecked
        featureElement.disabled = !feature.isEnable

        featureContainer.appendChild(featureElement)
        featureContainer.appendChild(featureLabel)
        featureContainer.classList.add(class1)
        if (class2) {
            featureContainer.classList.add(class2)
        }


      featuresSection.appendChild(featureContainer)  
    })
}

populateFeatures(`oxford`, `main-features`, oxfordFeatures)

console.log('sit');