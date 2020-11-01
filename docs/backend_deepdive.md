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

  - #### Integration with Chime

    Follow the instruction [here](https://docs.aws.amazon.com/chime/latest/ug/webhooks.html) to create a webhook for a chime room. The webhook URL is stored in AWS Paramter Store, a default value (which needs to be updated) is specified in the SAM template [here](../feedback-app-backend/template.yaml) within the "WebhookURLSSMParameter" resource. Update the SAM template with the webhook URL and run the commands below to build and deploy the changes.

    - **`cd /home/ec2-user/environment/aws-serverless-feedback-app/feedback-app-backend/`**
    - **`sam build`**
    - **`git add .`**
    - **`git commit -m "updated webhook url"`**
    - **`git remote add codecommit codecommit::eu-west-1://feedback-app-repo-backend`**
    - **`git push -u codecommit master`**

    The webhook url is retrieved from parameter store within the lambda function by using the SSM Paramater Store SDK. The template for the markdown formatting to display the notification as shown below can be found [here](../feedback-app-backend/webhooknotification-service/resources/chime_message_template.txt)

    <p align="center">
        <img src="images/manager_chime_room.png" alt="Chime Room Notification"/>
    </p>

  - #### Infrastructure as Code

    The backend resources which include: API Gateway, Step Machine, Lambda Functions, DynamoDB and Parameter in Parameter Store are created using [AWS Serverless Application Model (SAM)](https://aws.amazon.com/serverless/sam/). Given this is a simple web application that leverages AWS serverless services, AWS SAM is a good fit that makes it easier to create these resources in yaml and easily deploy the resources to AWS. AWS SAM also provide local testing using SAM local to test the serverless app on a local machine prior to deploying to AWS. The template that defines the configuration of these resources can be found [here](../feedback-app-backend/template.yaml).

    The resources for the CI/CD pipeline which includes AWS CodeCommit, AWS CodePipeline, AWS CodeBuild and AWS CodeDeploy were created with [AWS Cloud Development Kit](https://aws.amazon.com/cdk/). Using a familiar programming language like Typescript (as against using yaml), these resources can be created and configured as specified in the file [here](../feedback-app-backend/cicd-pipeline/lib/cicd-pipeline-stack.ts).

  - #### CI/CD Pipeline

    <p align="center">
        <img src="images/backend_dev_pipeline.png" alt="Backend Dev Pipeline"/>
    </p>

    The CI/CD pipeline is used to automate the build, test and deployment of the infrastructure resources and lambda functions for the backend. The pipeline is triggered by committing code to the CodeCommit repository where the CodePipeline kicks off the building of the sam template as specified [here](../feedback-app-backend/buildspec.yaml) using AWS CodeBuild. AWS CodeDeploy is used to deploy the artifacts as a CloudFormation stack. This deployment will create the AWS resources including the lambda function with source codes.

  - #### Logging and Monitoring

    <p align="center">
        <img src="images/backend-x-ray-tracing.png" alt="Logging and Monitoring"/>
    </p>

  - #### Cost and Performance Tunning
    <p align="center">
        <img src="images/lambda_power_tunning_input.png" alt="Cost Tunning Input"/>
    </p>
    <p align="center">
        <img src="images/cost_tunning.png" alt="Cost Tunning"/>
    </p>
