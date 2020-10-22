#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { AmplifyInfraCodeStack } from "../lib/amplify-infra-code-stack";

const app = new cdk.App();
new AmplifyInfraCodeStack(app, "amplify-infra-stack");
