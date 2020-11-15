import 'source-map-support/register';
import { CloudFormationCustomResourceEvent, Context } from 'aws-lambda';
import cfnresponse from 'cfn-response';

/*
 * CloudFormation properties supported by the custom resource.
 */
export interface ResourceProperties {
  ServiceToken: string;
  /**
   * The ARN of the Aurora Serverless DB cluster to create database in.
   */
  ClusterArn: string;
  /**
   * The name or ARN of the secret that enables access to the DB cluster via the RDS Data API.
   */
  ClusterSecret: string;
  /**
   * The name of the schema to create the database in. Default schema: public
   */
  DatabaseSchema?: string;
  /**
   * The name of the database to create.
   */
  DatabaseName: string;
  /**
   * The name of the user to create for the database. Defaults to value of DatabaseName.
   */
  DatabaseUser?: string;
  /**
   * The name of the secret that will be created to store the credentials. If not provided, a default value will be generated based on other inputs.
   */
  SecretName?: string;
}

/*
 * The return values of the resource accessible via Fn::GetAtt
 */
export interface ResourceAttributes {
  /**
   * ARN of the secrets manager secret resource which contains the RDS access credentials to the database
   */
  SecretArn: string;
}

/**
 * Custom CloudFormation Resource to create a database and credentials in an Aurora Serverless PostgreSQL cluster
 */
export const handler = async (event: CloudFormationCustomResourceEvent, context: Context) => {
  try {
    console.info(JSON.stringify({ event, context }), null, 2);

    const attributes = {
      Arn: 'TODO',
    };

    cfnresponse.send(event, context, cfnresponse.SUCCESS, attributes, getPhysicalResourceId(event));
  } catch (err) {
    const response = {
      Error: err.message,
    };
    cfnresponse.send(event, context, cfnresponse.FAILED, response, getPhysicalResourceId(event));
  }
};

/**
 * Get resource properties from event
 */
const getProperties = (event: CloudFormationCustomResourceEvent) => event.ResourceProperties as ResourceProperties;

/**
 * Get physical resource id from event. Uses existing id if passed via event
 */
const getPhysicalResourceId = (event: CloudFormationCustomResourceEvent) => {
  if ('PhysicalResourceId' in event) {
    return event.PhysicalResourceId;
  }
  const { ClusterArn, DatabaseName } = getProperties(event);
  return `${ClusterArn}/${DatabaseName}`;
};
