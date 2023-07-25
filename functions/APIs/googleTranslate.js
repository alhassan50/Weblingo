const projectId = "inner-fx-389410";
const location = "global";


// Imports the Google Cloud Translation library
const {TranslationServiceClient} = require("@google-cloud/translate");

// Instantiates a client
const translationClient = new TranslationServiceClient({
  keyFilename: "./APIs/inner-fx-389410-6731f8264e00.json",
});

const getGoogleTranslateText = async (dataObj) => {
  const {from, to, text} = dataObj;
  // Construct request
  const request = {
    parent: `projects/${projectId}/locations/${location}`,
    contents: [text],
    mimeType: "text/plain", // mime types: text/plain, text/html
    sourceLanguageCode: from,
    targetLanguageCode: to,
  };

  // Run request
  const [response] = await translationClient.translateText(request);

  let result;
  for (const translation of response.translations) {
    result = `${translation.translatedText}`;
  }
  return result;
};

module.exports = {
  getGoogleTranslateText,
};
