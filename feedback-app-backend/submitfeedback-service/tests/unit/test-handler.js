"use strict";

const app = require("../../app.js");
const chai = require("chai");
const fs = require("fs");
const expect = chai.expect;
var event, context;

event = JSON.parse(fs.readFileSync("../../event/event.json"));
console.log(event);

// Tests to run
// - Verify response when event is null
// - Verify response when event.feedback_text or event.feedback_recipient is null or undefined
// - Verify response when event.feedback_text or event.feedback_recipient is an empty string
// - Veryify response when event is populated correctly i.e. non of teh above is true

describe("Testing SubmitFeedback Service", function () {
  // Verify response when event is null
  it("Verify response when event is null", async () => {
    event = null;
    const result = await app.submitFeedbackHandler(event, context);

    expect(result).to.be.an("object");
    expect(result.statusCode).to.equal(400);
    expect(result.body).to.be.an("string");
    expect(result.body).to.be.equal(
      "The event parameter cannot be null or undefined"
    );
  });
});
