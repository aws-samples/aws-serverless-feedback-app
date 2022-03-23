import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as amplify from '@aws-cdk/aws-amplify-alpha';
const Constants = require('../global/constants.json');

export class AmplifyInfraStackStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
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

    const main = feedbackFrontendApp.addBranch("main");
  }
}
