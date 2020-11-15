import 'source-map-support/register';
import { CloudFormationCustomResourceEvent, Context } from 'aws-lambda';
import cfnresponse from 'cfn-response-promise';
import { getPhysicalResourceId, validateEvent } from './event';
import { ResourceAttributes } from './resource';
/**
 * Custom CloudFormation Resource to create a database and credentials in an Aurora Serverless PostgreSQL cluster
 */
export const handler = async (event: CloudFormationCustomResourceEvent, context: Context) => {
  try {
    console.debug(JSON.stringify({ event, context }), null, 2);

    const { valid, errors } = validateEvent(event);
    if (!valid) {
      throw new Error(JSON.stringify(errors, null, 2));
    }

    const attributes: ResourceAttributes = {
      SecretArn: 'TODO',
    };

    await cfnresponse.send(event, context, cfnresponse.SUCCESS, attributes, getPhysicalResourceId(event));
  } catch (err) {
    const response = {
      Error: err.message,
    };
    await cfnresponse.send(event, context, cfnresponse.FAILED, response, getPhysicalResourceId(event));
  }
};
