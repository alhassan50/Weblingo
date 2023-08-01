let getBody = (widtheight, marginpadding) => {
    const htmlElement = document.querySelector('html')
    htmlElement.style.width = widtheight
    htmlElement.style.height = widtheight
    htmlElement.style.padding = marginpadding
    htmlElement.style.margin = marginpadding

    const bodyElement = document.querySelector('body')
    bodyElement.style.width = widtheight
    bodyElement.style.height = widtheight
    bodyElement.style.padding = marginpadding
    bodyElement.style.margin = marginpadding

    return bodyElement
}

let createOuterContainer = () => {
    const divContainer = document.createElement('div')
    divContainer.style.boxSizing = `border-box`
    divContainer.style.width = `100%`
    divContainer.style.height = `100%`
    divContainer.style.padding = `1rem`
    divContainer.style.background = `rgba(0, 0, 0, .5)`
    divContainer.style.display = `flex`
    divContainer.style.justifyContent = `center`
    divContainer.style.alignItems = `center`
    divContainer.style.position = `fixed`

    return divContainer
}

let createInnerContainer = () => {
    const divContent = document.createElement('div')
    divContent.style.boxSizing = `border-box`
    divContent.style.padding = `2.2rem 1.8rem`
    divContent.style.background = `white`
    divContent.style.minWidth = `200px`
    divContent.style.maxWidth = `400px`
    divContent.style.minHeight = `200px`
    divContent.style.maxHeight = `500px`
    divContent.style.display = `flex`
    divContent.style.justifyContent = `start`
    divContent.style.alignItems = `flex-start`
    divContent.style.flexDirection = `column`
    divContent.style.overflow = `auto`
    divContent.style.borderRadius = `10px`
    divContent.style.boxShadow = `0 0 20px rgba(0, 0, 0, .9)`
    divContent.style.position = `relative`
    divContent.style.fontFamily = `'Montserrat', sans-serif`

    return divContent
}

let createMainContent = (header, content) => {
    const headerElement = document.createElement('h2')
    headerElement.innerText = header
    headerElement.style.margin = `0`
    headerElement.style.textAlign = `left`
    headerElement.style.fontSize = `18px`

    const contentElement = document.createElement('p')
    contentElement.style.margin = `0`
    contentElement.innerText = content
    contentElement.style.lineHeight = `1.5rem`
    contentElement.style.letterSpacing = `.2px`
    contentElement.style.wordBreak = 'break-word';
    contentElement.style.marginTop = `.5rem`
    contentElement.style.fontSize = `14px`

    return {
        headerElement, contentElement
    }
}


let createCloseBtn = () => {
    const closeBtn = document.createElement('div')
    closeBtn.style.position = `absolute`
    closeBtn.style.top = `0`
    closeBtn.style.right = `0`
    closeBtn.style.width = `50px`
    closeBtn.style.height = `50px`
    closeBtn.style.cursor = 'pointer'
    closeBtn.style.background = `#eee`
    closeBtn.style.transition = `.15s linear`
    closeBtn.style.display = `flex`
    closeBtn.style.justifyContent = `center`
    closeBtn.style.alignItems = `center`

    return closeBtn
}

let createCloseIcon = () => {
    const closeIcon = document.createElement('span')
    closeIcon.innerHTML = `<i class="fa-solid fa-xmark"></i>`
    closeIcon.style.fontSize = `2.5rem`

    return closeIcon
}

let createIconScript = () => {
    const script = document.createElement('script')
    script.src = `https://kit.fontawesome.com/a08852d450.js`
    script.crossOrigin = 'anonymous'

    return script
}


export let createDialogueBox = (header, content) => {
    const body = getBody(`100%`, `0`)
    const outerContainer = createOuterContainer()
    const innerContainer = createInnerContainer()
    const {headerElement, contentElement} = createMainContent(header, content)
    const closeBtn = createCloseBtn()
    const closeIcon = createCloseIcon()
    const iconScript = createIconScript()

    body.appendChild(outerContainer)
    outerContainer.appendChild(innerContainer)
    outerContainer.appendChild(closeBtn)
    document.querySelector('head').appendChild(iconScript)
    closeBtn.appendChild(closeIcon)
    innerContainer.appendChild(headerElement)
    innerContainer.appendChild(contentElement)

    window.addEventListener('resize', () => {
        const windowWidth = window.innerWidth;
    
        if (windowWidth < 400) {
            console.log('yep');
            outerContainer.style.padding = `1rem`
        } else {
            console.log('nope');
            outerContainer.style.padding = `2rem`
        }
    })

    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = `#1473e6`
        closeIcon.style.color = `#fff`
        console.log(1245432);
    })
    
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = `#eee`
        closeIcon.style.color = `#000`
    })
    
    closeBtn.addEventListener('click', () => {
        getBody(``, ``)
        outerContainer.remove()
    })

    window.addEventListener('resize', () => {
        const windowWidth = window.innerWidth;
    
        if (windowWidth < 400) {
            console.log('yep');
            innerContainer.style.padding = `1rem`
        } else {
            console.log('nope');
            innerContainer.style.padding = `2rem`
        }
    })

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            getBody(``, ``)
            outerContainer.remove()
        }
    })
}

const heading = `WebLingo Translation`
const mainContent = `Lorem ipsum dolor sit amet, consectetur id nisl facilisis dapibus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipinsectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur id nisl facilisis dapibus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipinsectetur adipiscing elit.`
createDialogueBox(heading, mainContent)


console.log(123);