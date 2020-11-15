import { RDSDataService } from 'aws-sdk';
import { String } from 'aws-sdk/clients/cloudsearch';
import { randomBytes } from 'crypto';
import { ResourceProperties } from './resource';

const dataApi = new RDSDataService();

const connectionOpts = (props: ResourceProperties) => ({
  resourceArn: props.ClusterArn,
  secretArn: props.ClusterSecret,
});

const queryWithOpts = (opts: Partial<RDSDataService.ExecuteStatementRequest>) => (sql: String) =>
  dataApi
    .executeStatement({
      sql,
      resourceArn: opts.resourceArn,
      secretArn: opts.resourceArn,
      ...opts,
    })
    .promise();

/**
 * Creates a database and user with full privileges using the RDS data api
 */
export const createDatabaseAndUser = async (props: ResourceProperties) => {
  const database = getSanitizedDatabaseName(props);
  const username = getSanitizedUser(props);
  const password = generateDbPassword();

  const query = queryWithOpts(connectionOpts(props));

  console.debug(`creating database ${database}...`);
  await query(`create database ${database};`);

  console.debug(`creating user ${username}...`);
  await query(`create user ${username} with encrypted password '${password}';`);

  console.debug(`granting privileges...`);
  await query(`grant all privileges on database ${database} to ${username};`);

  return { database, username, password };
};

const getSanitizedDatabaseName = ({ DatabaseName }: ResourceProperties) => {
  return DatabaseName.replace(/[^0-9a-zA-Z_]+/g, '').substr(0, 63);
};

const getSanitizedUser = ({ DatabaseUser, DatabaseName }: ResourceProperties) => {
  const user = DatabaseUser || DatabaseName;
  return user.replace(/[^0-9a-zA-Z]+/g, '').substr(0, 31);
};

const generateDbPassword = () => randomBytes(24).toString('hex');
