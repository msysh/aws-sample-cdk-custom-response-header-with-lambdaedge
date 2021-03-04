# AWS Sample : test custom response header with Lambda@Edge

Test custom response header with using Lambda@Edge, CloudFront and S3..

## Quick Start

1. `git clone https://github.com/msysh/aws-sample-cdk-custom-response-header-with-lambdaedge.git`
2. `cd aws-sample-cdk-custom-response-header-with-lambdaedge`
3. `npm install` or `yarn install`
4. `cdk bootstrap`, if you've never execute yet.
5. `cdk deploy`

## Customize

### AWS Lambda function

Add files you want for AWS Lambda, into `assets`.

### Amazon CloudFront

Default status of distribution is set `false`.

### Others

* Lambda function name : `functionName` in `cdk.json`. Default is `cf-edge-custom-response-header`.
* IAM role name : `roleName` in `cdk.json`. Default is `cf-edge-custom-response-header`.
* S3 bucket name : `bucketName` in `cdk.json`. Default is `origin-bucket-for-custom-response-header`

---

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
