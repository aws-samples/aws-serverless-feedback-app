const ssmClient = require("aws-sdk/clients/ssm");
const axios = require("axios");
const fs = require("fs");
const dateFormat = require("dateformat");

var ssm = new ssmClient();

const webHookParameterStoreName = process.env.WEBHOOK_PARAM;

var chimeMessageTemplate = fs.readFileSync(
  "./resources/chime_message_template.txt",
  "utf8"
);

exports.webHookNotificationHandler = async (event, context) => {
  console.info(
    "The event to the notification handler " + JSON.stringify(event)
  );
  console.info("Parameter store name " + webHookParameterStoreName);

  var ssmOptions = {
    Name: webHookParameterStoreName,
    WithDecryption: false,
  };

  var chimeURL = "";
  var response = {};

  await ssm
    .getParameter(ssmOptions)
    .promise()
    .then((res) => {
      console.info("webhook parameter: " + JSON.stringify(res.Parameter));
      chimeURL = res.Parameter.Value;
      console.info("The chime url: " + chimeURL);
    })
    .catch((err) => {
      const errMessage = "Error retrieving web hook parameter 1: " + err;
      response = {
        statusCode: 400,
        body: errMessage,
      };
      console.info(errMessage);
      return response;
    });
  let chimeMessage = formatMessage(event);
  console.log("what will be passed to the http call" + chimeMessage);
  await makeHttpCall(chimeURL, chimeMessage)
    .then((res) => {
      console.log(JSON.stringify(res));
      response = {
        statusCode: 200,
        body: event,
      };
    })
    .catch((err) => {
      const errMessage = "Error making webhook http call: " + err;
      response = {
        statusCode: 400,
        body: errMessage,
      };
      console.info(errMessage);
    });
  return response;
};

async function makeHttpCall(url, chimeMessage) {
  const data = {
    Content: chimeMessage,
  };
  const requestHeaders = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axios.post(url, data, requestHeaders);
    console.info("Status: " + res.status);
    console.info("Body: " + JSON.stringify(res.data));
  } catch (err) {
    console.info(err);
  }
}

function formatMessage(event) {
  let formattedMessage = "";
  const formattedSentiments = {
    NEUTRAL: "NEUTRAL :left_right_arrow:",
    POSITIVE: "POSITIVE :+1:", // tick good code - :white_check_mark:, plus one code :+1:
    NEGATIVE: "NEGATIVE :-1:",
  };

  const templatePlaceholders = {
    fd_sentiment: formattedSentiments[event.feedback_sentitment],
    fd_concerning: event.feedback_recepient,
    fd_from: event.feedback_sender,
    fd_date: dateFormat(event.feedback_date, "dd-mm-yyyy").toString(),
    fd_status: event.share_feedback === "true" ? "PUBLIC" : "PRIVATE",
    fd_feedbacktext: event.feedback_text,
    fd_feedbacksituation: event.feedback_situation,
    fd_feedbackbehaviour: event.feedback_behaviour,
    fd_feedbackimpact: event.feedback_impact,
  };

  formattedMessage = chimeMessageTemplate.replace(
    /fd_sentiment|fd_concerning|fd_from|fd_date|fd_status|fd_feedbacktext|fd_feedbacksituation|fd_feedbackbehaviour|fd_feedbackimpact/gi,
    function (matched) {
      return templatePlaceholders[matched];
    }
  );

  console.log("what will be returned" + formattedMessage);
  return formattedMessage;
}
