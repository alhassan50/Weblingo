const axios = require("axios");
const {v4: uuidv4} = require("uuid");

const key = "3bcfdeff86d74cf698e0d65d10445b2d";
const endpoint = "https://api.cognitive.microsofttranslator.com";
const location = "westus";

/* const key = "3bcfdeff86d74cf698e0d65d10445b2d";
const endpoint = "https://api.cognitive.microsofttranslator.com";
const location = "westus"; */

const getMsTranslation = async (dataObj) => {
  const {from, to, text} = dataObj;

  try {
    const response = await axios({
      baseURL: endpoint,
      url: "/translate",
      method: "post",
      headers: {
        "Ocp-Apim-Subscription-Key": key,
        "Ocp-Apim-Subscription-Region": location,
        "Content-type": "application/json",
        "X-ClientTraceId": uuidv4().toString(),
      },
      params: {
        "api-version": "3.0",
        "from": from,
        "to": to,
      },
      data: [{
        "text": text,
      }],
      responseType: "json",
    });

    return JSON.stringify(response.data[0].translations[0].text, null, 4);
  } catch (error) {
    throw new Error("Translation error:", error.message);
  }
};

module.exports = {
  getMsTranslation,
};
