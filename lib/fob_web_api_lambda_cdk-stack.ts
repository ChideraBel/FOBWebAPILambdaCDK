import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class FobWebApiLambdaCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'FobWebApiLambdaCdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    // Create an IAM role
    const iamRole = new iam.Role(this, 'MyLambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    // Define an inline policy statement for DynamoDB access with specific actions and resource ARNs
    const dynamoDBPolicyStatement1 = new iam.PolicyStatement({
      actions: ['dynamodb:Scan', 'dynamodb:Query'],
      resources: ['arn:aws:dynamodb:*:730335448770:table/*/index/*'],
    });

    const dynamoDBPolicyStatement2 = new iam.PolicyStatement({
      actions: [
        'dynamodb:BatchGetItem',
        'dynamodb:BatchWriteItem',
        'dynamodb:PutItem',
        'dynamodb:DeleteItem',
        'dynamodb:GetItem',
        'dynamodb:Scan',
        'dynamodb:Query',
        'dynamodb:UpdateItem',
      ],
      resources: ['arn:aws:dynamodb:*:730335448770:table/*'],
    });

    // Attach the inline policy to the IAM role
    iamRole.addToPolicy(dynamoDBPolicyStatement1);
    iamRole.addToPolicy(dynamoDBPolicyStatement2);

    const mainLambda = new lambda.Function(this, 'FOBWebAPILambda-Function', {
      runtime: lambda.Runtime.JAVA_11,
      handler: 'org.tranqwave.fobwebapilambda.MainLambda::handleRequest', // Replace with your handler class and method
      code: lambda.Code.fromAsset('../FOBWebAPILambda/target/FOBWebAPILambda-1.0-SNAPSHOT.jar'), // Use relative path to Java code directory
      role: iamRole,
      memorySize: 500,
      timeout: cdk.Duration.seconds(10)
    });
    
  }
}
