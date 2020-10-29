# Documentation

## How do I use it?

- [Getting started](getting_started.md): instructions to setup the project

## How does it work?

- ### Deep Dive on the Frontend

  - #### Overview of Architecture

    The frontend is a [React](https://reactjs.org/) application and the UI developed with [Ant Design](https://ant.design/). AWS CodeCommit and AWS Amplify are the two services used for source control and application hosting respectively. Once a code is committed to CodeCommit via `git push`, Amplify automatically forks the code from the repository and triggers a CI/CD pipeline fully managed by Amplify to deploy the changes. The build settings for the CI/CD pipeline can be specified in an "amplify.yml" file stored in the root folder of the repository.

    <p align="center">
        <img src="images/frontend_dev_pipeline.png" alt="Frontend Dev Pipeline"/>
    </p>

  - #### Hosting on AWS Amplify

    [AWS Amplify](https://aws.amazon.com/amplify/) provides developers with a set of tools and services to build secure and scalable full stack cloud applications. One of the tools is the AWS Amplify Console that provides a GUI with a git-based workflow for hosting web applications, with a fully managed underlying storage and global content distribition. Applications can be deployed by connecting to an existing repository (GitHub, BitBucket Cloud, GitLab and AWS CodeCommit) to set up a fully managed continuous deployment pipeline. Subsequently, any changes committed to the repository will trigger the pipeline to build, test and deploy the changes to the target environment. It also provides instant content delivery network (CDN) cache invalidation, atomic deploys, custom domains, password protection, and redirects without the need to manage any servers.

  - #### Invoking the Backend API

  - #### Infrastructure as Code

    The AWS resources used to deploy the frontend application is managed using [AWS Cloud Development Kit (CDK)](https://aws.amazon.com/cdk/). AWS CDK is an open source software development framework which can be used to model and provision your cloud application resources using familiar programming languages, including TypeScript, JavaScript, Python, C# and Java.

    Setting up the frontend application starts with deploying the CDK application to create the CodeCommit repository and the Amplify application. One of the key configuration while creating the Amplify application via CDK is to setup the CodeCommit repository as the source code provider for the Amplify application. This will ensure that any code committed to the repository triggers the Amplify managed CI/CD pipeline to deploy the changes. The CDK application source code can be found [here](amplify-infra-code)

    ```typescript
    import * as cdk from "@aws-cdk/core";
    import * as codecommit from "@aws-cdk/aws-codecommit";
    import * as amplify from "@aws-cdk/aws-amplify";
    import * as iam from "@aws-cdk/aws-iam";
    import Constants from "../global/constants.json";

    export class AmplifyInfraCodeStack extends cdk.Stack {
      constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // The code that defines your stack goes here
        const feedbackAppFrontEndRepo = new codecommit.Repository(
          this,
          "FeedbackAppFrontEndRepo",
          {
            repositoryName: Constants.code_commit_repo_name,
            description: "The repository for the frontend of the feedback app",
          }
        );

        const amplifyRole = new iam.Role(
          this,
          "Feedback-App-Frontend-AmplifyRole",
          {
            assumedBy: new iam.ServicePrincipal("amplify.amazonaws.com"),
            description: "The to be used by amplify to deploy the application",
            roleName: Constants.amplify_role_name,
          }
        );

        const feedbackFrontendApp = new amplify.App(
          this,
          Constants.amplify_app_name,
          {
            sourceCodeProvider: new amplify.CodeCommitSourceCodeProvider({
              repository: feedbackAppFrontEndRepo,
            }),
            role: amplifyRole.withoutPolicyUpdates(),
          }
        );

        amplifyRole.addToPolicy(
          new iam.PolicyStatement({
            actions: ["*"],
            resources: ["*"],
          })
        );

        const masterBranch = feedbackFrontendApp.addBranch("master");
      }
    }
    ```

- Deep Dive on the Backend

  - Overview of Architecture
    <p align="center">
        <img src="images/backend_hl.png" alt="Backend High Level Architecture"/>
    </p>
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
