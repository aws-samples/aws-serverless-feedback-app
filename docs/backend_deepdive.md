- ### Deep Dive on the Backend

  - #### Overview of Architecture

    <p align="center">
        <img src="images/backend_hl.png" alt="Backend High Level Architecture"/>
    </p>

    The backend API exposes two resources:

    1. /submit-feedback, a POST method for submitting a new feedback
    2. /get-feedback-by-sharestatus, a GET method for retreiving feedback based on the whether it is public or private

    **`Submit Feedback`**

    A feedback submission from the frontend triggers the invokes the /submit-feedback api which triggers an AWS Step Function. The purpose of the step function is to orchestrate the lambda functions created to process a new feedback submission. The 3 lambda function for processing feedback carry out the following:

    1. Sentiment Analysis - the feedback comment is analysed usings Amazon Comprehend which returns either "POSITIVE", "NEGATIVE" or "NEUTRAL" depending on the sentimemnts on the feedback. This is achieved using Amazon Comprehend SDK.
    2. Persisting Feedback - the feedback details together with the output of the sentiment analysis is stored in DynammoDB using the SDK
    3. Notification - the feedback details is formated with markdown and sent to the manager chime room via webhook.

    **`Public Feedback`**

    The public feedbacks are the feedbacks that the employee have indicated can be shared while submitting the feedback. A Global Secondary Index is created in DynamoDB with the share_feedback attribute set as the partition key. Using DynamoDB SDK, a call is made to the database to retrieve the public feedbacks.

  - Integration with Chime
  - Integration with Parameter Store
  - Infrastructure as Code
  - CI/CID Pipeline
    <p align="center">
        <img src="images/backend_dev_pipeline.png" alt="Backend Dev Pipeline"/>
    </p>
  - Logging and Monitoring
    <p align="center">
        <img src="images/backend-x-ray-tracing.png" alt="Logging and Monitoring"/>
    </p>
  - Cost and Performance Tunning
    <p align="center">
        <img src="images/lambda_power_tunning_input.png" alt="Cost Tunning Input"/>
    </p>
    <p align="center">
        <img src="images/cost_tunning.png" alt="Cost Tunning"/>
    </p>
