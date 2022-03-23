"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmplifyInfraStackStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const codecommit = require("aws-cdk-lib/aws-codecommit");
const iam = require("aws-cdk-lib/aws-iam");
const amplify = require("@aws-cdk/aws-amplify-alpha");
const Constants = require('../global/constants.json');
class AmplifyInfraStackStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // The code that defines your stack goes here
        const feedbackAppFrontEndRepo = new codecommit.Repository(this, "FeedbackAppFrontEndRepo", {
            repositoryName: Constants.code_commit_repo_name,
            description: "The repository for the frontend of the feedback app",
        });
        const amplifyRole = new iam.Role(this, "Feedback-App-Frontend-AmplifyRole", {
            assumedBy: new iam.ServicePrincipal("amplify.amazonaws.com"),
            description: "The to be used by amplify to deploy the application",
            roleName: Constants.amplify_role_name,
        });
        const feedbackFrontendApp = new amplify.App(this, Constants.amplify_app_name, {
            sourceCodeProvider: new amplify.CodeCommitSourceCodeProvider({
                repository: feedbackAppFrontEndRepo,
            }),
            role: amplifyRole.withoutPolicyUpdates(),
        });
        amplifyRole.addToPolicy(new iam.PolicyStatement({
            actions: ["*"],
            resources: ["*"],
        }));
        const main = feedbackFrontendApp.addBranch("main");
    }
}
exports.AmplifyInfraStackStack = AmplifyInfraStackStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1wbGlmeS1pbmZyYS1zdGFjay1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFtcGxpZnktaW5mcmEtc3RhY2stc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkNBQWdEO0FBRWhELHlEQUF5RDtBQUN6RCwyQ0FBMkM7QUFDM0Msc0RBQXNEO0FBQ3RELE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBRXRELE1BQWEsc0JBQXVCLFNBQVEsbUJBQUs7SUFDL0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4Qiw2Q0FBNkM7UUFDN0MsTUFBTSx1QkFBdUIsR0FBRyxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQ3ZELElBQUksRUFDSix5QkFBeUIsRUFDekI7WUFDRSxjQUFjLEVBQUUsU0FBUyxDQUFDLHFCQUFxQjtZQUMvQyxXQUFXLEVBQUUscURBQXFEO1NBQ25FLENBQ0YsQ0FBQztRQUVGLE1BQU0sV0FBVyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FDOUIsSUFBSSxFQUNKLG1DQUFtQyxFQUNuQztZQUNFLFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyx1QkFBdUIsQ0FBQztZQUM1RCxXQUFXLEVBQUUscURBQXFEO1lBQ2xFLFFBQVEsRUFBRSxTQUFTLENBQUMsaUJBQWlCO1NBQ3RDLENBQ0YsQ0FBQztRQUVGLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUN6QyxJQUFJLEVBQ0osU0FBUyxDQUFDLGdCQUFnQixFQUMxQjtZQUNFLGtCQUFrQixFQUFFLElBQUksT0FBTyxDQUFDLDRCQUE0QixDQUFDO2dCQUMzRCxVQUFVLEVBQUUsdUJBQXVCO2FBQ3BDLENBQUM7WUFDRixJQUFJLEVBQUUsV0FBVyxDQUFDLG9CQUFvQixFQUFFO1NBQ3pDLENBQ0YsQ0FBQztRQUVGLFdBQVcsQ0FBQyxXQUFXLENBQ3JCLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztZQUN0QixPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUM7WUFDZCxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUM7U0FDakIsQ0FBQyxDQUNILENBQUM7UUFFRixNQUFNLElBQUksR0FBRyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDckQsQ0FBQztDQUNGO0FBNUNELHdEQTRDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBjb2RlY29tbWl0IGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlY29tbWl0JztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGFtcGxpZnkgZnJvbSAnQGF3cy1jZGsvYXdzLWFtcGxpZnktYWxwaGEnO1xuY29uc3QgQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vZ2xvYmFsL2NvbnN0YW50cy5qc29uJyk7XG5cbmV4cG9ydCBjbGFzcyBBbXBsaWZ5SW5mcmFTdGFja1N0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIC8vIFRoZSBjb2RlIHRoYXQgZGVmaW5lcyB5b3VyIHN0YWNrIGdvZXMgaGVyZVxuICAgIGNvbnN0IGZlZWRiYWNrQXBwRnJvbnRFbmRSZXBvID0gbmV3IGNvZGVjb21taXQuUmVwb3NpdG9yeShcbiAgICAgIHRoaXMsXG4gICAgICBcIkZlZWRiYWNrQXBwRnJvbnRFbmRSZXBvXCIsXG4gICAgICB7XG4gICAgICAgIHJlcG9zaXRvcnlOYW1lOiBDb25zdGFudHMuY29kZV9jb21taXRfcmVwb19uYW1lLFxuICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgcmVwb3NpdG9yeSBmb3IgdGhlIGZyb250ZW5kIG9mIHRoZSBmZWVkYmFjayBhcHBcIixcbiAgICAgIH1cbiAgICApO1xuXG4gICAgY29uc3QgYW1wbGlmeVJvbGUgPSBuZXcgaWFtLlJvbGUoXG4gICAgICB0aGlzLFxuICAgICAgXCJGZWVkYmFjay1BcHAtRnJvbnRlbmQtQW1wbGlmeVJvbGVcIixcbiAgICAgIHtcbiAgICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoXCJhbXBsaWZ5LmFtYXpvbmF3cy5jb21cIiksXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSB0byBiZSB1c2VkIGJ5IGFtcGxpZnkgdG8gZGVwbG95IHRoZSBhcHBsaWNhdGlvblwiLFxuICAgICAgICByb2xlTmFtZTogQ29uc3RhbnRzLmFtcGxpZnlfcm9sZV9uYW1lLFxuICAgICAgfVxuICAgICk7XG5cbiAgICBjb25zdCBmZWVkYmFja0Zyb250ZW5kQXBwID0gbmV3IGFtcGxpZnkuQXBwKFxuICAgICAgdGhpcyxcbiAgICAgIENvbnN0YW50cy5hbXBsaWZ5X2FwcF9uYW1lLFxuICAgICAge1xuICAgICAgICBzb3VyY2VDb2RlUHJvdmlkZXI6IG5ldyBhbXBsaWZ5LkNvZGVDb21taXRTb3VyY2VDb2RlUHJvdmlkZXIoe1xuICAgICAgICAgIHJlcG9zaXRvcnk6IGZlZWRiYWNrQXBwRnJvbnRFbmRSZXBvLFxuICAgICAgICB9KSxcbiAgICAgICAgcm9sZTogYW1wbGlmeVJvbGUud2l0aG91dFBvbGljeVVwZGF0ZXMoKSxcbiAgICAgIH1cbiAgICApO1xuXG4gICAgYW1wbGlmeVJvbGUuYWRkVG9Qb2xpY3koXG4gICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIGFjdGlvbnM6IFtcIipcIl0sXG4gICAgICAgIHJlc291cmNlczogW1wiKlwiXSxcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIGNvbnN0IG1haW4gPSBmZWVkYmFja0Zyb250ZW5kQXBwLmFkZEJyYW5jaChcIm1haW5cIik7XG4gIH1cbn1cbiJdfQ==