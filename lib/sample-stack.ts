import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import { Function, AssetCode, Runtime, Version } from '@aws-cdk/aws-lambda';

export class SampleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const FUNCTION_NAME :string = this.node.tryGetContext('functionName');
    const ROLE_NAME :string = this.node.tryGetContext('roleName');
    const BUCKET_NAME :string = this.node.tryGetContext('bucketName');

    //
    // IAM Policy & Role
    //
    const policyStatement1 = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
    });
    policyStatement1.addActions(
      'logs:CreateLogGroup'
    );
    policyStatement1.addResources(
      `arn:aws:logs:${this.region}:${this.account}:*`
    );

    const policyStatement2 = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
    });
    policyStatement2.addActions(
      'logs:CreateLogStream',
      'logs:PutLogEvents'
    );
    policyStatement2.addResources(
      `arn:aws:logs:${this.region}:${this.account}:log-group:/aws/lambda/${FUNCTION_NAME}:*`
    );

    const policyDocument = new iam.PolicyDocument({statements:[policyStatement1, policyStatement2]})

    const role = new iam.Role(this, 'role', {
      roleName: `${ROLE_NAME}`,
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('lambda.amazonaws.com'),
        new iam.ServicePrincipal('edgelambda.amazonaws.com')
      ),
      description: 'Role for Lambda by CDK',
      //managedPolicies: [
      //  iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
      //],
      inlinePolicies: {
        'policy': policyDocument
      }
    });

    //
    // Lambda
    //
    const lambdaFunction = new Function(this, 'function', {
      functionName: `${FUNCTION_NAME}`,
      runtime: Runtime.NODEJS_12_X,
      code: AssetCode.fromAsset('assets'),
      handler: 'index.handler',
      timeout: cdk.Duration.seconds(5),
      role: role,
      environment: {
        //KEY: "VALUE"
      }
    });
    const lambdaVersion = new Version(this, 'version', {
      lambda: lambdaFunction
    });

    //
    // CloudWatch Logs
    //
    new logs.LogGroup(this, 'logs', {
      logGroupName: `/aws/lambda/${FUNCTION_NAME}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      retention: logs.RetentionDays.SIX_MONTHS
    });

    //
    // S3
    //
    const bucket = new s3.Bucket(this, 'bucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      bucketName: BUCKET_NAME,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    //
    // CloudFront
    //
    const distribution = new cloudfront.Distribution(this, 'distribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(bucket),
        edgeLambdas: [{
          eventType: cloudfront.LambdaEdgeEventType.ORIGIN_RESPONSE,
          functionVersion: lambdaVersion,
          includeBody: false
        }]
      },
      defaultRootObject: 'index.html',
      enabled: false,
    })
  }
}
