const dynamoDB = require("aws-sdk/clients/dynamodb");
const { v4: uuidv4 } = require("uuid");
const doClient = new dynamoDB.DocumentClient();
const dateFormat = require("dateformat");

const tableName = process.env.FEEDBACK_DB;

exports.submitFeedbackHandler = async (event, context) => {
  console.info("received: ", event);

  const feedback_recepient = event.feedback_recepient;
  const feeback_text = event.feedback_text;
  const feedback_sender = event.feedback_sender;
  const feedback_situation = event.feedback_situation;
  const feedback_behaviour = event.feedback_behaviour;
  const feedback_impact = event.feedback_impact;
  const share_feedback = event.share_feedback;
  const feedback_date = dateFormat(new Date(), "isoDateTime");
  const feedback_id = uuidv4();
  const feedback_sentitment = event.feedback_sentitment;

  if (feeback_text == "") {
    console.info("The feedback text cannot be an empty string");
    return;
  }

  var params = {
    TableName: tableName,
    Item: {
      feedback_id: feedback_id,
      feedback_sentitment: feedback_sentitment,
      feedback_date: feedback_date.toString(),
      feedback_recepient: feedback_recepient,
      feeback_text: feeback_text,
      feedback_situation: feedback_situation,
      feedback_behaviour: feedback_behaviour,
      feedback_impact: feedback_impact,
      feedback_sender: feedback_sender,
      share_feedback: share_feedback,
      number_of_votes: 1,
    },
  };

  var response = {};

  try {
    await doClient.put(params).promise();
    event.feedback_date = feedback_date.toString();
    response = {
      statusCode: 200,
      body: event,
    };
    console.info(
      "statusCode: " +
        response.statusCode +
        "body: " +
        JSON.stringify(response.body)
    );
  } catch (err) {
    const errMessage = "Error encountered while saving to the database: " + err;
    response = {
      statusCode: 400,
      body: errMessage,
    };
    console.info(errMessage);
  }

  return response;
};

/*
// Generate a random number for the dynamoDB id
function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
*/
