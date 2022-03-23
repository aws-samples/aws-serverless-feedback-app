import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
const Constants = require('../global/constants.json');


export class CicdpipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const artifactsBucket = new s3.Bucket(this, "ArtifactsBucket");
    
    // Creating a code commit repository for the feedback-app-backend
    const feedbackAppBackendRepo = new codecommit.Repository(
      this,
      "FeedbackAppBackendRepo",
      {
        repositoryName: Constants.code_commit_repo_name,
        description: "The repository for the frontend of the feedback app",
      }
    );
    
    // Pipeline creation starts
    const pipeline = new codepipeline.Pipeline(this, 'FeedbackAppPipeline', {
      artifactBucket: artifactsBucket
    });

    // Declare source code as a artifact
    const sourceOutput = new codepipeline.Artifact();

    // Add source stage to pipeline
    pipeline.addStage({
      stageName: 'Source',
      actions: [
        new codepipeline_actions.CodeCommitSourceAction({
          actionName: 'FeedbackApp_Source',
          repository: feedbackAppBackendRepo,
          output: sourceOutput,
          branch: Constants.code_commit_repo_branch_name
        }),
      ],
    });

    // Declare build output as artifacts
    const buildOutput = new codepipeline.Artifact();

    // Declear a new CodeBuild project
    const buildProject = new codebuild.PipelineProject(this, 'Build', {
      environment: { buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_2 },
      environmentVariables: {
        'PACKAGE_BUCKET': {
          value: artifactsBucket.bucketName
        }
      }
    });

    // Add the build stage to the pipeline
    pipeline.addStage({
      stageName: 'Build',
      actions: [
        new codepipeline_actions.CodeBuildAction({
          actionName: 'FeedbackApp_Build',
          project: buildProject,
          input: sourceOutput,
          outputs: [buildOutput],
        }),
      ],
    });

    // Deploy stage
    pipeline.addStage({
      stageName: 'DeployToDev',
      actions: [
        new codepipeline_actions.CloudFormationCreateReplaceChangeSetAction({
          actionName: 'CreateChangeSet',
          templatePath: buildOutput.atPath("packaged.yaml"),
          stackName: 'feedback-app-backend',
          adminPermissions: true,
          changeSetName: 'feedback-app-backend-dev-changeset',
          runOrder: 1
        }),
        new codepipeline_actions.CloudFormationExecuteChangeSetAction({
          actionName: 'Deploy',
          stackName: 'feedback-app-backend',
          changeSetName: 'feedback-app-backend-dev-changeset',
          runOrder: 2
        }),
      ]
    });
  }
}
