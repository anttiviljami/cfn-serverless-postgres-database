import 'source-map-support/register';
import { CloudFormationCustomResourceEvent, Context } from 'aws-lambda';
import cfnresponse from 'cfn-response-promise';
import { getPhysicalResourceId, validateEvent } from './event';
import { getProperties, ResourceAttributes } from './resource';
import { createDatabaseAndUser } from './aurora';
import { describeServerlessCluster } from './rds';
import { putRDSSecret } from './secret';

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
    const props = getProperties(event);

    if (event.RequestType === 'Create') {
      console.info('Creating database and user...');
      const { username, password, database } = await createDatabaseAndUser(props);
      console.debug({ username });

      const { Endpoint: host, Port: port, DBClusterIdentifier: dbClusterIdentifier } = await describeServerlessCluster(
        props.ClusterArn,
      );

      console.info('Creating secret in Secrets Manager...');
      const secretArn = await putRDSSecret({
        secretName: props.SecretName || `rds-credentials/${database}/${username}`,
        secretValue: {
          username,
          password,
          engine: 'postgres',
          host,
          port,
          dbClusterIdentifier,
        },
      });

      const attributes: ResourceAttributes = {
        SecretArn: secretArn,
      };
      await cfnresponse.send(event, context, cfnresponse.SUCCESS, attributes, getPhysicalResourceId(event));
    }

    if (event.RequestType === 'Update') {
      await cfnresponse.send(
        event,
        context,
        cfnresponse.SUCCESS,
        { message: 'Not implemented' },
        getPhysicalResourceId(event),
      );
    }

    if (event.RequestType === 'Delete') {
      await cfnresponse.send(
        event,
        context,
        cfnresponse.SUCCESS,
        { message: 'Not implemented' },
        getPhysicalResourceId(event),
      );
    }
  } catch (err) {
    console.error(err);
    const response = {
      Error: err.message,
    };
    await cfnresponse.send(event, context, cfnresponse.FAILED, response, getPhysicalResourceId(event));
  }
};
