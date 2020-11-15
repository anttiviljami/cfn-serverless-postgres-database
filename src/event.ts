import { CloudFormationCustomResourceEvent } from 'aws-lambda';
import * as resource from './resource';

/**
 * Validate event and return a list of errors
 */
export const validateEvent = (event: CloudFormationCustomResourceEvent) => {
  const errors: string[] = [];
  const resourceProperties = resource.getProperties(event);

  if (!resourceProperties) {
    errors.push('Invalid lambda payload. Missing ResourceProperties from event');
  }

  for (const required of resource.RequiredProperties) {
    if (false === required in resourceProperties) {
      errors.push(`${required} is a required property`);
    }
  }

  return {
    valid: errors.length > 0,
    errors,
  };
};

/**
 * Get physical resource id from event. Uses existing id if passed via event
 */
export const getPhysicalResourceId = (event: CloudFormationCustomResourceEvent) => {
  if ('PhysicalResourceId' in event) {
    return event.PhysicalResourceId;
  }
  const { ClusterArn, DatabaseName } = resource.getProperties(event);
  return `${ClusterArn}/${DatabaseName}`;
};
