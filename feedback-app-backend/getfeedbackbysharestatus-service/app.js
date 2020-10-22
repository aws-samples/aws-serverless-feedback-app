const dynamoDB = require("aws-sdk/clients/dynamodb");
const doClient = new dynamoDB.DocumentClient();

const tableName = process.env.FEEDBACK_DB;

exports.getFeedbackByShareStatusHandler = async (event, context) => {
  console.log(JSON.stringify(event));
  let response = {};

  console.log(
    "value of share status " + event.queryStringParameters.sharestatus
  );
  console.log(
    "check value of this operation " +
      event.queryStringParameters.sharestatus !=
      null
  );

  if (event.queryStringParameters.sharestatus != null) {
    let shareStatusParam = event.queryStringParameters.sharestatus;

    const params = {
      TableName: tableName,
      IndexName: "ShareFeedbackStatusIndex",
      KeyConditionExpression: "share_feedback = :hkey",
      ExpressionAttributeValues: {
        ":hkey": shareStatusParam,
      },
    };
    let scanResults = [];
    let items;

    do {
      try {
        items = await doClient.query(params).promise();
        items.Items.forEach((item) => scanResults.push(item));
        params.ExclusiveStartKey = items.LastEvaluatedKey;
      } catch (err) {
        response = {
          statusCode: 400,
          body: "Error in retreiving feedback data from database " + err,
        };
        console.log(err);
        return response;
      }
    } while (typeof items.LastEvaluatedKey != "undefined");

    console.log(JSON.stringify(scanResults));

    response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers":
          "Content-Type,x-requested-with,Access-Control-Allow-Origin,Access-Control-Allow-Headers,Access-Control-Allow-Methods",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
      body: JSON.stringify(scanResults),
    };

    return response;
  } else {
    response = {
      statusCode: 400,
      body:
        "The share_status parameter is null and must be provided - can be either true or false",
    };
    console.log(err);
    return response;
  }
};
