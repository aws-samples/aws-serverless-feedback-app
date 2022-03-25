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
        const artifactsBucket = new s3.Bucket(this, "ArtifactsBucket", {
            encryption: s3.BucketEncryption.S3_MANAGED
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ljZHBpcGVsaW5lLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2ljZHBpcGVsaW5lLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZDQUFnRDtBQUVoRCx5Q0FBeUM7QUFDekMseURBQXlEO0FBQ3pELDZEQUE2RDtBQUM3RCw2RUFBNkU7QUFDN0UsdURBQXVEO0FBQ3ZELE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBR3RELE1BQWEsaUJBQWtCLFNBQVEsbUJBQUs7SUFDMUMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4Qiw2Q0FBNkM7UUFDN0MsTUFBTSxlQUFlLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBQztZQUM1RCxVQUFVLEVBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFVBQVU7U0FDM0MsQ0FBQyxDQUFDO1FBRUgsaUVBQWlFO1FBQ2pFLE1BQU0sc0JBQXNCLEdBQUcsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUN0RCxJQUFJLEVBQ0osd0JBQXdCLEVBQ3hCO1lBQ0UsY0FBYyxFQUFFLFNBQVMsQ0FBQyxxQkFBcUI7WUFDL0MsV0FBVyxFQUFFLHFEQUFxRDtTQUNuRSxDQUNGLENBQUM7UUFFRiwyQkFBMkI7UUFDM0IsTUFBTSxRQUFRLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxxQkFBcUIsRUFBRTtZQUN0RSxjQUFjLEVBQUUsZUFBZTtTQUNoQyxDQUFDLENBQUM7UUFFSCxvQ0FBb0M7UUFDcEMsTUFBTSxZQUFZLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFakQsK0JBQStCO1FBQy9CLFFBQVEsQ0FBQyxRQUFRLENBQUM7WUFDaEIsU0FBUyxFQUFFLFFBQVE7WUFDbkIsT0FBTyxFQUFFO2dCQUNQLElBQUksb0JBQW9CLENBQUMsc0JBQXNCLENBQUM7b0JBQzlDLFVBQVUsRUFBRSxvQkFBb0I7b0JBQ2hDLFVBQVUsRUFBRSxzQkFBc0I7b0JBQ2xDLE1BQU0sRUFBRSxZQUFZO29CQUNwQixNQUFNLEVBQUUsU0FBUyxDQUFDLDRCQUE0QjtpQkFDL0MsQ0FBQzthQUNIO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsb0NBQW9DO1FBQ3BDLE1BQU0sV0FBVyxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRWhELGtDQUFrQztRQUNsQyxNQUFNLFlBQVksR0FBRyxJQUFJLFNBQVMsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRTtZQUNoRSxXQUFXLEVBQUUsRUFBRSxVQUFVLEVBQUUsU0FBUyxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsRUFBRTtZQUN2RSxvQkFBb0IsRUFBRTtnQkFDcEIsZ0JBQWdCLEVBQUU7b0JBQ2hCLEtBQUssRUFBRSxlQUFlLENBQUMsVUFBVTtpQkFDbEM7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILHNDQUFzQztRQUN0QyxRQUFRLENBQUMsUUFBUSxDQUFDO1lBQ2hCLFNBQVMsRUFBRSxPQUFPO1lBQ2xCLE9BQU8sRUFBRTtnQkFDUCxJQUFJLG9CQUFvQixDQUFDLGVBQWUsQ0FBQztvQkFDdkMsVUFBVSxFQUFFLG1CQUFtQjtvQkFDL0IsT0FBTyxFQUFFLFlBQVk7b0JBQ3JCLEtBQUssRUFBRSxZQUFZO29CQUNuQixPQUFPLEVBQUUsQ0FBQyxXQUFXLENBQUM7aUJBQ3ZCLENBQUM7YUFDSDtTQUNGLENBQUMsQ0FBQztRQUVILGVBQWU7UUFDZixRQUFRLENBQUMsUUFBUSxDQUFDO1lBQ2hCLFNBQVMsRUFBRSxhQUFhO1lBQ3hCLE9BQU8sRUFBRTtnQkFDUCxJQUFJLG9CQUFvQixDQUFDLDBDQUEwQyxDQUFDO29CQUNsRSxVQUFVLEVBQUUsaUJBQWlCO29CQUM3QixZQUFZLEVBQUUsV0FBVyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUM7b0JBQ2pELFNBQVMsRUFBRSxzQkFBc0I7b0JBQ2pDLGdCQUFnQixFQUFFLElBQUk7b0JBQ3RCLGFBQWEsRUFBRSxvQ0FBb0M7b0JBQ25ELFFBQVEsRUFBRSxDQUFDO2lCQUNaLENBQUM7Z0JBQ0YsSUFBSSxvQkFBb0IsQ0FBQyxvQ0FBb0MsQ0FBQztvQkFDNUQsVUFBVSxFQUFFLFFBQVE7b0JBQ3BCLFNBQVMsRUFBRSxzQkFBc0I7b0JBQ2pDLGFBQWEsRUFBRSxvQ0FBb0M7b0JBQ25ELFFBQVEsRUFBRSxDQUFDO2lCQUNaLENBQUM7YUFDSDtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQXZGRCw4Q0F1RkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcbmltcG9ydCAqIGFzIGNvZGVjb21taXQgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVjb21taXQnO1xuaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlcGlwZWxpbmUnO1xuaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lX2FjdGlvbnMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVwaXBlbGluZS1hY3Rpb25zJztcbmltcG9ydCAqIGFzIGNvZGVidWlsZCBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZWJ1aWxkJztcbmNvbnN0IENvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2dsb2JhbC9jb25zdGFudHMuanNvbicpO1xuXG5cbmV4cG9ydCBjbGFzcyBDaWNkcGlwZWxpbmVTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAvLyBUaGUgY29kZSB0aGF0IGRlZmluZXMgeW91ciBzdGFjayBnb2VzIGhlcmVcbiAgICBjb25zdCBhcnRpZmFjdHNCdWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsIFwiQXJ0aWZhY3RzQnVja2V0XCIse1xuICAgICAgZW5jcnlwdGlvbjogczMuQnVja2V0RW5jcnlwdGlvbi5TM19NQU5BR0VEXG4gICAgfSk7XG4gICAgXG4gICAgLy8gQ3JlYXRpbmcgYSBjb2RlIGNvbW1pdCByZXBvc2l0b3J5IGZvciB0aGUgZmVlZGJhY2stYXBwLWJhY2tlbmRcbiAgICBjb25zdCBmZWVkYmFja0FwcEJhY2tlbmRSZXBvID0gbmV3IGNvZGVjb21taXQuUmVwb3NpdG9yeShcbiAgICAgIHRoaXMsXG4gICAgICBcIkZlZWRiYWNrQXBwQmFja2VuZFJlcG9cIixcbiAgICAgIHtcbiAgICAgICAgcmVwb3NpdG9yeU5hbWU6IENvbnN0YW50cy5jb2RlX2NvbW1pdF9yZXBvX25hbWUsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSByZXBvc2l0b3J5IGZvciB0aGUgZnJvbnRlbmQgb2YgdGhlIGZlZWRiYWNrIGFwcFwiLFxuICAgICAgfVxuICAgICk7XG4gICAgXG4gICAgLy8gUGlwZWxpbmUgY3JlYXRpb24gc3RhcnRzXG4gICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHRoaXMsICdGZWVkYmFja0FwcFBpcGVsaW5lJywge1xuICAgICAgYXJ0aWZhY3RCdWNrZXQ6IGFydGlmYWN0c0J1Y2tldFxuICAgIH0pO1xuXG4gICAgLy8gRGVjbGFyZSBzb3VyY2UgY29kZSBhcyBhIGFydGlmYWN0XG4gICAgY29uc3Qgc291cmNlT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xuXG4gICAgLy8gQWRkIHNvdXJjZSBzdGFnZSB0byBwaXBlbGluZVxuICAgIHBpcGVsaW5lLmFkZFN0YWdlKHtcbiAgICAgIHN0YWdlTmFtZTogJ1NvdXJjZScsXG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgIG5ldyBjb2RlcGlwZWxpbmVfYWN0aW9ucy5Db2RlQ29tbWl0U291cmNlQWN0aW9uKHtcbiAgICAgICAgICBhY3Rpb25OYW1lOiAnRmVlZGJhY2tBcHBfU291cmNlJyxcbiAgICAgICAgICByZXBvc2l0b3J5OiBmZWVkYmFja0FwcEJhY2tlbmRSZXBvLFxuICAgICAgICAgIG91dHB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICAgIGJyYW5jaDogQ29uc3RhbnRzLmNvZGVfY29tbWl0X3JlcG9fYnJhbmNoX25hbWVcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgLy8gRGVjbGFyZSBidWlsZCBvdXRwdXQgYXMgYXJ0aWZhY3RzXG4gICAgY29uc3QgYnVpbGRPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG5cbiAgICAvLyBEZWNsZWFyIGEgbmV3IENvZGVCdWlsZCBwcm9qZWN0XG4gICAgY29uc3QgYnVpbGRQcm9qZWN0ID0gbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3QodGhpcywgJ0J1aWxkJywge1xuICAgICAgZW52aXJvbm1lbnQ6IHsgYnVpbGRJbWFnZTogY29kZWJ1aWxkLkxpbnV4QnVpbGRJbWFnZS5BTUFaT05fTElOVVhfMl8yIH0sXG4gICAgICBlbnZpcm9ubWVudFZhcmlhYmxlczoge1xuICAgICAgICAnUEFDS0FHRV9CVUNLRVQnOiB7XG4gICAgICAgICAgdmFsdWU6IGFydGlmYWN0c0J1Y2tldC5idWNrZXROYW1lXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIEFkZCB0aGUgYnVpbGQgc3RhZ2UgdG8gdGhlIHBpcGVsaW5lXG4gICAgcGlwZWxpbmUuYWRkU3RhZ2Uoe1xuICAgICAgc3RhZ2VOYW1lOiAnQnVpbGQnLFxuICAgICAgYWN0aW9uczogW1xuICAgICAgICBuZXcgY29kZXBpcGVsaW5lX2FjdGlvbnMuQ29kZUJ1aWxkQWN0aW9uKHtcbiAgICAgICAgICBhY3Rpb25OYW1lOiAnRmVlZGJhY2tBcHBfQnVpbGQnLFxuICAgICAgICAgIHByb2plY3Q6IGJ1aWxkUHJvamVjdCxcbiAgICAgICAgICBpbnB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICAgIG91dHB1dHM6IFtidWlsZE91dHB1dF0sXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIC8vIERlcGxveSBzdGFnZVxuICAgIHBpcGVsaW5lLmFkZFN0YWdlKHtcbiAgICAgIHN0YWdlTmFtZTogJ0RlcGxveVRvRGV2JyxcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgbmV3IGNvZGVwaXBlbGluZV9hY3Rpb25zLkNsb3VkRm9ybWF0aW9uQ3JlYXRlUmVwbGFjZUNoYW5nZVNldEFjdGlvbih7XG4gICAgICAgICAgYWN0aW9uTmFtZTogJ0NyZWF0ZUNoYW5nZVNldCcsXG4gICAgICAgICAgdGVtcGxhdGVQYXRoOiBidWlsZE91dHB1dC5hdFBhdGgoXCJwYWNrYWdlZC55YW1sXCIpLFxuICAgICAgICAgIHN0YWNrTmFtZTogJ2ZlZWRiYWNrLWFwcC1iYWNrZW5kJyxcbiAgICAgICAgICBhZG1pblBlcm1pc3Npb25zOiB0cnVlLFxuICAgICAgICAgIGNoYW5nZVNldE5hbWU6ICdmZWVkYmFjay1hcHAtYmFja2VuZC1kZXYtY2hhbmdlc2V0JyxcbiAgICAgICAgICBydW5PcmRlcjogMVxuICAgICAgICB9KSxcbiAgICAgICAgbmV3IGNvZGVwaXBlbGluZV9hY3Rpb25zLkNsb3VkRm9ybWF0aW9uRXhlY3V0ZUNoYW5nZVNldEFjdGlvbih7XG4gICAgICAgICAgYWN0aW9uTmFtZTogJ0RlcGxveScsXG4gICAgICAgICAgc3RhY2tOYW1lOiAnZmVlZGJhY2stYXBwLWJhY2tlbmQnLFxuICAgICAgICAgIGNoYW5nZVNldE5hbWU6ICdmZWVkYmFjay1hcHAtYmFja2VuZC1kZXYtY2hhbmdlc2V0JyxcbiAgICAgICAgICBydW5PcmRlcjogMlxuICAgICAgICB9KSxcbiAgICAgIF1cbiAgICB9KTtcbiAgfVxufVxuIl19