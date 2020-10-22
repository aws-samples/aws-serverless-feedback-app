#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CicdPipelineStack } from '../lib/cicd-pipeline-stack';

const app = new cdk.App();
new CicdPipelineStack(app, 'feedback-app-cicd');
