/* const {setGlobalOptions} = require("firebase-functions/v2");
setGlobalOptions({maxInstances: 10});

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

exports.weblingoTranslation = onRequest( async (request, response) => {
  const {APIChoice} = request.body;
  logger.info(`${APIChoice} logs!`, {structuredData: true});
  let breakdown;
  const translationParam = request.body;
  const {text} = translationParam;
  try {
    if (APIChoice === "webster") {
      breakdown = await fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${text}?key=e0deb228-d721-49a8-9b64-5cb72fee8698`);
    } else if (APIChoice === "freeDictionay") {
      breakdown = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${text}`);
    }
    response.status(400).send(breakdown);
  } catch (error) {
    console.error("Breakdown error:", error.message);
    response.status(500).send("Translation failed");
  }
});



else if (APIChoice === "freeDictionary") {
    fetchURL = `https://api.dictionaryapi.dev/api/v2/entries/en/${phrase}`;
    breakdown = await fetch(fetchURL);
  }
 */