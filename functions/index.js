const {setGlobalOptions} = require("firebase-functions/v2");
setGlobalOptions({maxInstances: 10});
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const {getMsTranslation} = require("./APIs/msTranslate");
const {getGoogleTranslateText} = require("./APIs/googleTranslate");

exports.weblingoTranslation = onRequest(async (request, response) => {
  const {APIChoice} = request.body;
  logger.info(`${APIChoice} logs!`, {structuredData: true});
  let translationResult;
  const translationParam = request.body;
  try {
    if (APIChoice === "googleTranslation") {
      translationResult = await getGoogleTranslateText(translationParam);
    } else if (APIChoice === "msTranslation") {
      translationResult = await getMsTranslation(translationParam);
    }
    response.status(200).send(translationResult);
  } catch (error) {
    console.error("Translation error:", error.message);
    response.status(500).send("Translation failed");
  }
});

/* exports.lingoScan = onRequest( async (request, response) => {
  const lingoScanParam = request.body;
  const {phrase, APIChoice} = lingoScanParam;
  logger.info(`${APIChoice} ${phrase} logs!`, {structuredData: true});
  let breakdown;
  let fetchURL;
  try {
    if (APIChoice === "webster") {
      fetchURL = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${phrase}?key=e0deb228-d721-49a8-9b64-5cb72fee8698`;
      breakdown = await fetch(fetchURL);
    } else if (APIChoice === "freeDictionary") {
      fetchURL = `https://api.dictionaryapi.dev/api/v2/entries/en/${phrase}`;
      breakdown = await fetch(fetchURL);
    }
    logger.info(`${fetchURL} logs!`, {structuredData: true});
    const breakDownJSON = await breakdown.json();
    response.status(200).send(breakdown);
  } catch (error) {
    console.error("Breakdown error:", error.message);
    response.status(500).send("Breakdown failed");
  }
}); */

