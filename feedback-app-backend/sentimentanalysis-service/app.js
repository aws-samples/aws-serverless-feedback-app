const comprehendClient = require('aws-sdk/clients/comprehend')

var comprehend = new comprehendClient();

exports.sentimentAnalysisHandler = async (event, context) => {
    console.info('received event: ', event);
    console.info("text to analyse: "+ event.feedback_text);

    var sentitmentParams = {
        Text: event.feedback_text,
        LanguageCode: "en"
    };

    var response = {};

    await comprehend.detectSentiment(sentitmentParams).promise()
    .then((res) => {
        console.info("sentiment txt: "+ res.Sentiment);
        event.feedback_sentitment = res.Sentiment;
        response = {
            statusCode: 200,
            body: event
        };
    })
    .catch((err) => {
        event.feedback_sentitment = "NA";
        const errMessage = "Error making webhook http call: " + err;
        response = {
            statusCode: 400,
            body: errMessage
        };
        console.info(errMessage);
    });
    return response;
};

