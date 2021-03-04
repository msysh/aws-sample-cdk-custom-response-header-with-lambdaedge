#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { SampleStack } from '../lib/sample-stack';

const app = new cdk.App();
new SampleStack(app, 'CdkStackTestResponseHeader', {
	description: 'Test custom response header with using Lambda@Edge, CloudFront and S3.'
});
