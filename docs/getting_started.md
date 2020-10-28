# Getting started

## Setting up the Frontend

The following steps can be used to deploy the frontend:

1. Launch an AWS Cloud9 environment following the instructions in the link below

- [Launch AWS Cloud9 Environment](https://docs.aws.amazon.com/cloud9/latest/user-guide/create-environment-main.html) (Note: While creating the Cloud9 Environment, complete Step 1 and use default settings for Step 2 and Step 3)

2. Clone the aws-serverless-feedback-app project

- **`git clone https://github.com/aws-samples/aws-serverless-feedback-app.git`**

3. Navigate to the CDK Application to that will be used to create the following infrastructure: CodeCommit Repository (used as source repo) and AWS Amplify Application (used for hosting the frontend)

- **`cd /home/ec2-user/environment/aws-serverless-feedback-app/feedback-app-frontend/amplify-infra-code/`**

4. Install the packages required by the CDK Application (ignore any the warnings)

- **`npm install`**

5. Build the CDK Application

- **`npm run build`**

6. Deploy the CDK Application (Note: Ensure there is no existing AWS resource with the same name specified in the file aws-serverless-feedback-app/feedback-app-frontend/amplify-infra-code/global/constant.json )

- **`cdk deploy --require-approval never`**

7. Navigate back to the feedback-app-frontend folder

- **`cd /home/ec2-user/environment/aws-serverless-feedback-app/feedback-app-frontend/`**

8. Run the following git commands to commit code to the CodeCommit repository created in 5 above

- **`git init`**
- **`git add .`**
- **`git commit -m "first commit"`**
- **`git remote add codecommit codecommit::eu-west-1://feedback-app-repo-frontend`** (replace with the name of the repository if constant.json was modified)
- **`git push -u codecommit master`**

## Setting up the Backend

The following steps can be used to deploy the frontend:

1. Launch an AWS Cloud9 environment following the instructions in the link below

- [Launch AWS Cloud9 Environment](https://docs.aws.amazon.com/cloud9/latest/user-guide/create-environment-main.html) (Note: While creating the Cloud9 Environment, complete Step 1 and use default settings for Step 2 and Step 3)

2. Clone the aws-serverless-feedback-app project (Optional if the repository has not yet been cloned as part of setting up the Frontend)

- **`git clone https://github.com/aws-samples/aws-serverless-feedback-app.git`**

3. Navigate to the CDK Application to that will be used to create the CI/CD pipeline which consists of the following resources: Amazon CodePipeline, Amazon CodeCommit, Amazon CodeBuild and Amazon CodeDeploy

- **`cd /home/ec2-user/environment/aws-serverless-feedback-app/feedback-app-backend/cicd-pipeline/`**

4. Install the packages required by the CDK Application (ignore any the warnings)

- **`npm install`**

5. Build the CDK Application

- **`npm run build`**

6. Deploy the CDK Application (Note: Ensure there is no existing AWS resource with the same name specified in the file aws-serverless-feedback-app/feedback-app-backend/cicd-pipeline/global/constant.json )

- **`cdk deploy --require-approval never`**

7. Navigate back to the feedback-app-backend folder

- **`cd /home/ec2-user/environment/aws-serverless-feedback-app/feedback-app-backend/`**

8. Run the following git commands to commit code to the CodeCommit repository created in 5 above

- **`git init`**
- **`git add .`**
- **`git commit -m "first commit"`**
- **`git remote add codecommit codecommit::eu-west-1://feedback-app-repo-backend`** (replace with the name of the repository if constant.json was modified)
- **`git push -u codecommit master`**
