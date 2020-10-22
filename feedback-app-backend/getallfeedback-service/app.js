const dynamoDB = require("aws-sdk/clients/dynamodb");
const doClient = new dynamoDB.DocumentClient();

const tableName = process.env.FEEDBACK_DB;

exports.getAllFeedbackHandler = async (event, context) => {
  const params = {
    TableName: tableName,
    ConsistentRead: true,
  };
  let scanResults = [];
  let items;
  let response = {};

  do {
    try {
      items = await doClient.scan(params).promise();
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
};
