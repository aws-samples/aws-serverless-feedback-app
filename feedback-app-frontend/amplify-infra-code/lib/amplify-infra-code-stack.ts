import * as cdk from "@aws-cdk/core";
import * as codecommit from "@aws-cdk/aws-codecommit";
import * as amplify from "@aws-cdk/aws-amplify";
import * as iam from "@aws-cdk/aws-iam";

export class AmplifyInfraCodeStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const feedbackAppFrontEndRepo = new codecommit.Repository(
      this,
      "FeedbackAppFrontEndRepo",
      {
        repositoryName: "feedback-app-repo-frontend",
        description: "The repository for the frontend of the feedback app",
      }
    );

    const amplifyRole = new iam.Role(
      this,
      "Feedback-App-Frontend-AmplifyRole",
      {
        assumedBy: new iam.ServicePrincipal("amplify.amazonaws.com"),
        description: "The to be used by amplify to deploy the application",
        roleName: "Feedback-App-Frontend-AmplifyRole",
      }
    );

    const feedbackFrontendApp = new amplify.App(this, "feedback-app-frontend", {
      sourceCodeProvider: new amplify.CodeCommitSourceCodeProvider({
        repository: feedbackAppFrontEndRepo,
      }),
      role: amplifyRole.withoutPolicyUpdates(),
    });

    amplifyRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["*"],
        resources: ["*"],
      })
    );

    const masterBranch = feedbackFrontendApp.addBranch("master");
  }
}
