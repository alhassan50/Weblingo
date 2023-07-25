// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'backgroundToPopup') {
      // Extract the translatedText from the message
      const { translatedText } = message.data;
  
      // Do whatever you need to do with the translatedText in the popup
      console.log("Translated Text: ", translatedText);
  
      // Send a response back to the background script (if needed)
      sendResponse({ response: 'Message received by popup script' });
    }
  });
  
  // Trigger the communication from background to popup
  const triggerTransPopUp = () => {
    chrome.runtime.sendMessage({ action: 'triggerTransPopUp' });
  }
  
  triggerTransPopUp();
  