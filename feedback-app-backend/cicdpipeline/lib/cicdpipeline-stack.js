"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CicdpipelineStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const s3 = require("aws-cdk-lib/aws-s3");
const codecommit = require("aws-cdk-lib/aws-codecommit");
const codepipeline = require("aws-cdk-lib/aws-codepipeline");
const codepipeline_actions = require("aws-cdk-lib/aws-codepipeline-actions");
const codebuild = require("aws-cdk-lib/aws-codebuild");
const Constants = require('../global/constants.json');
class CicdpipelineStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // The code that defines your stack goes here
        const artifactsBucket = new s3.Bucket(this, "ArtifactsBucket");
        // Creating a code commit repository for the feedback-app-backend
        const feedbackAppBackendRepo = new codecommit.Repository(this, "FeedbackAppBackendRepo", {
            repositoryName: Constants.code_commit_repo_name,
            description: "The repository for the frontend of the feedback app",
        });
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
exports.CicdpipelineStack = CicdpipelineStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ljZHBpcGVsaW5lLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2ljZHBpcGVsaW5lLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZDQUFnRDtBQUVoRCx5Q0FBeUM7QUFDekMseURBQXlEO0FBQ3pELDZEQUE2RDtBQUM3RCw2RUFBNkU7QUFDN0UsdURBQXVEO0FBQ3ZELE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBR3RELE1BQWEsaUJBQWtCLFNBQVEsbUJBQUs7SUFDMUMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4Qiw2Q0FBNkM7UUFDN0MsTUFBTSxlQUFlLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1FBRS9ELGlFQUFpRTtRQUNqRSxNQUFNLHNCQUFzQixHQUFHLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FDdEQsSUFBSSxFQUNKLHdCQUF3QixFQUN4QjtZQUNFLGNBQWMsRUFBRSxTQUFTLENBQUMscUJBQXFCO1lBQy9DLFdBQVcsRUFBRSxxREFBcUQ7U0FDbkUsQ0FDRixDQUFDO1FBRUYsMkJBQTJCO1FBQzNCLE1BQU0sUUFBUSxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUscUJBQXFCLEVBQUU7WUFDdEUsY0FBYyxFQUFFLGVBQWU7U0FDaEMsQ0FBQyxDQUFDO1FBRUgsb0NBQW9DO1FBQ3BDLE1BQU0sWUFBWSxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRWpELCtCQUErQjtRQUMvQixRQUFRLENBQUMsUUFBUSxDQUFDO1lBQ2hCLFNBQVMsRUFBRSxRQUFRO1lBQ25CLE9BQU8sRUFBRTtnQkFDUCxJQUFJLG9CQUFvQixDQUFDLHNCQUFzQixDQUFDO29CQUM5QyxVQUFVLEVBQUUsb0JBQW9CO29CQUNoQyxVQUFVLEVBQUUsc0JBQXNCO29CQUNsQyxNQUFNLEVBQUUsWUFBWTtvQkFDcEIsTUFBTSxFQUFFLFNBQVMsQ0FBQyw0QkFBNEI7aUJBQy9DLENBQUM7YUFDSDtTQUNGLENBQUMsQ0FBQztRQUVILG9DQUFvQztRQUNwQyxNQUFNLFdBQVcsR0FBRyxJQUFJLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUVoRCxrQ0FBa0M7UUFDbEMsTUFBTSxZQUFZLEdBQUcsSUFBSSxTQUFTLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7WUFDaEUsV0FBVyxFQUFFLEVBQUUsVUFBVSxFQUFFLFNBQVMsQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLEVBQUU7WUFDdkUsb0JBQW9CLEVBQUU7Z0JBQ3BCLGdCQUFnQixFQUFFO29CQUNoQixLQUFLLEVBQUUsZUFBZSxDQUFDLFVBQVU7aUJBQ2xDO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxzQ0FBc0M7UUFDdEMsUUFBUSxDQUFDLFFBQVEsQ0FBQztZQUNoQixTQUFTLEVBQUUsT0FBTztZQUNsQixPQUFPLEVBQUU7Z0JBQ1AsSUFBSSxvQkFBb0IsQ0FBQyxlQUFlLENBQUM7b0JBQ3ZDLFVBQVUsRUFBRSxtQkFBbUI7b0JBQy9CLE9BQU8sRUFBRSxZQUFZO29CQUNyQixLQUFLLEVBQUUsWUFBWTtvQkFDbkIsT0FBTyxFQUFFLENBQUMsV0FBVyxDQUFDO2lCQUN2QixDQUFDO2FBQ0g7U0FDRixDQUFDLENBQUM7UUFFSCxlQUFlO1FBQ2YsUUFBUSxDQUFDLFFBQVEsQ0FBQztZQUNoQixTQUFTLEVBQUUsYUFBYTtZQUN4QixPQUFPLEVBQUU7Z0JBQ1AsSUFBSSxvQkFBb0IsQ0FBQywwQ0FBMEMsQ0FBQztvQkFDbEUsVUFBVSxFQUFFLGlCQUFpQjtvQkFDN0IsWUFBWSxFQUFFLFdBQVcsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDO29CQUNqRCxTQUFTLEVBQUUsc0JBQXNCO29CQUNqQyxnQkFBZ0IsRUFBRSxJQUFJO29CQUN0QixhQUFhLEVBQUUsb0NBQW9DO29CQUNuRCxRQUFRLEVBQUUsQ0FBQztpQkFDWixDQUFDO2dCQUNGLElBQUksb0JBQW9CLENBQUMsb0NBQW9DLENBQUM7b0JBQzVELFVBQVUsRUFBRSxRQUFRO29CQUNwQixTQUFTLEVBQUUsc0JBQXNCO29CQUNqQyxhQUFhLEVBQUUsb0NBQW9DO29CQUNuRCxRQUFRLEVBQUUsQ0FBQztpQkFDWixDQUFDO2FBQ0g7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFyRkQsOENBcUZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3RhY2ssIFN0YWNrUHJvcHMgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBjb2RlY29tbWl0IGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlY29tbWl0JztcbmltcG9ydCAqIGFzIGNvZGVwaXBlbGluZSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZXBpcGVsaW5lJztcbmltcG9ydCAqIGFzIGNvZGVwaXBlbGluZV9hY3Rpb25zIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlcGlwZWxpbmUtYWN0aW9ucyc7XG5pbXBvcnQgKiBhcyBjb2RlYnVpbGQgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVidWlsZCc7XG5jb25zdCBDb25zdGFudHMgPSByZXF1aXJlKCcuLi9nbG9iYWwvY29uc3RhbnRzLmpzb24nKTtcblxuXG5leHBvcnQgY2xhc3MgQ2ljZHBpcGVsaW5lU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgLy8gVGhlIGNvZGUgdGhhdCBkZWZpbmVzIHlvdXIgc3RhY2sgZ29lcyBoZXJlXG4gICAgY29uc3QgYXJ0aWZhY3RzQnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCBcIkFydGlmYWN0c0J1Y2tldFwiKTtcbiAgICBcbiAgICAvLyBDcmVhdGluZyBhIGNvZGUgY29tbWl0IHJlcG9zaXRvcnkgZm9yIHRoZSBmZWVkYmFjay1hcHAtYmFja2VuZFxuICAgIGNvbnN0IGZlZWRiYWNrQXBwQmFja2VuZFJlcG8gPSBuZXcgY29kZWNvbW1pdC5SZXBvc2l0b3J5KFxuICAgICAgdGhpcyxcbiAgICAgIFwiRmVlZGJhY2tBcHBCYWNrZW5kUmVwb1wiLFxuICAgICAge1xuICAgICAgICByZXBvc2l0b3J5TmFtZTogQ29uc3RhbnRzLmNvZGVfY29tbWl0X3JlcG9fbmFtZSxcbiAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIHJlcG9zaXRvcnkgZm9yIHRoZSBmcm9udGVuZCBvZiB0aGUgZmVlZGJhY2sgYXBwXCIsXG4gICAgICB9XG4gICAgKTtcbiAgICBcbiAgICAvLyBQaXBlbGluZSBjcmVhdGlvbiBzdGFydHNcbiAgICBjb25zdCBwaXBlbGluZSA9IG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUodGhpcywgJ0ZlZWRiYWNrQXBwUGlwZWxpbmUnLCB7XG4gICAgICBhcnRpZmFjdEJ1Y2tldDogYXJ0aWZhY3RzQnVja2V0XG4gICAgfSk7XG5cbiAgICAvLyBEZWNsYXJlIHNvdXJjZSBjb2RlIGFzIGEgYXJ0aWZhY3RcbiAgICBjb25zdCBzb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG5cbiAgICAvLyBBZGQgc291cmNlIHN0YWdlIHRvIHBpcGVsaW5lXG4gICAgcGlwZWxpbmUuYWRkU3RhZ2Uoe1xuICAgICAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgbmV3IGNvZGVwaXBlbGluZV9hY3Rpb25zLkNvZGVDb21taXRTb3VyY2VBY3Rpb24oe1xuICAgICAgICAgIGFjdGlvbk5hbWU6ICdGZWVkYmFja0FwcF9Tb3VyY2UnLFxuICAgICAgICAgIHJlcG9zaXRvcnk6IGZlZWRiYWNrQXBwQmFja2VuZFJlcG8sXG4gICAgICAgICAgb3V0cHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICAgICAgYnJhbmNoOiBDb25zdGFudHMuY29kZV9jb21taXRfcmVwb19icmFuY2hfbmFtZVxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICAvLyBEZWNsYXJlIGJ1aWxkIG91dHB1dCBhcyBhcnRpZmFjdHNcbiAgICBjb25zdCBidWlsZE91dHB1dCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcblxuICAgIC8vIERlY2xlYXIgYSBuZXcgQ29kZUJ1aWxkIHByb2plY3RcbiAgICBjb25zdCBidWlsZFByb2plY3QgPSBuZXcgY29kZWJ1aWxkLlBpcGVsaW5lUHJvamVjdCh0aGlzLCAnQnVpbGQnLCB7XG4gICAgICBlbnZpcm9ubWVudDogeyBidWlsZEltYWdlOiBjb2RlYnVpbGQuTGludXhCdWlsZEltYWdlLkFNQVpPTl9MSU5VWF8yXzIgfSxcbiAgICAgIGVudmlyb25tZW50VmFyaWFibGVzOiB7XG4gICAgICAgICdQQUNLQUdFX0JVQ0tFVCc6IHtcbiAgICAgICAgICB2YWx1ZTogYXJ0aWZhY3RzQnVja2V0LmJ1Y2tldE5hbWVcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gQWRkIHRoZSBidWlsZCBzdGFnZSB0byB0aGUgcGlwZWxpbmVcbiAgICBwaXBlbGluZS5hZGRTdGFnZSh7XG4gICAgICBzdGFnZU5hbWU6ICdCdWlsZCcsXG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgIG5ldyBjb2RlcGlwZWxpbmVfYWN0aW9ucy5Db2RlQnVpbGRBY3Rpb24oe1xuICAgICAgICAgIGFjdGlvbk5hbWU6ICdGZWVkYmFja0FwcF9CdWlsZCcsXG4gICAgICAgICAgcHJvamVjdDogYnVpbGRQcm9qZWN0LFxuICAgICAgICAgIGlucHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICAgICAgb3V0cHV0czogW2J1aWxkT3V0cHV0XSxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgLy8gRGVwbG95IHN0YWdlXG4gICAgcGlwZWxpbmUuYWRkU3RhZ2Uoe1xuICAgICAgc3RhZ2VOYW1lOiAnRGVwbG95VG9EZXYnLFxuICAgICAgYWN0aW9uczogW1xuICAgICAgICBuZXcgY29kZXBpcGVsaW5lX2FjdGlvbnMuQ2xvdWRGb3JtYXRpb25DcmVhdGVSZXBsYWNlQ2hhbmdlU2V0QWN0aW9uKHtcbiAgICAgICAgICBhY3Rpb25OYW1lOiAnQ3JlYXRlQ2hhbmdlU2V0JyxcbiAgICAgICAgICB0ZW1wbGF0ZVBhdGg6IGJ1aWxkT3V0cHV0LmF0UGF0aChcInBhY2thZ2VkLnlhbWxcIiksXG4gICAgICAgICAgc3RhY2tOYW1lOiAnZmVlZGJhY2stYXBwLWJhY2tlbmQnLFxuICAgICAgICAgIGFkbWluUGVybWlzc2lvbnM6IHRydWUsXG4gICAgICAgICAgY2hhbmdlU2V0TmFtZTogJ2ZlZWRiYWNrLWFwcC1iYWNrZW5kLWRldi1jaGFuZ2VzZXQnLFxuICAgICAgICAgIHJ1bk9yZGVyOiAxXG4gICAgICAgIH0pLFxuICAgICAgICBuZXcgY29kZXBpcGVsaW5lX2FjdGlvbnMuQ2xvdWRGb3JtYXRpb25FeGVjdXRlQ2hhbmdlU2V0QWN0aW9uKHtcbiAgICAgICAgICBhY3Rpb25OYW1lOiAnRGVwbG95JyxcbiAgICAgICAgICBzdGFja05hbWU6ICdmZWVkYmFjay1hcHAtYmFja2VuZCcsXG4gICAgICAgICAgY2hhbmdlU2V0TmFtZTogJ2ZlZWRiYWNrLWFwcC1iYWNrZW5kLWRldi1jaGFuZ2VzZXQnLFxuICAgICAgICAgIHJ1bk9yZGVyOiAyXG4gICAgICAgIH0pLFxuICAgICAgXVxuICAgIH0pO1xuICB9XG59XG4iXX0=