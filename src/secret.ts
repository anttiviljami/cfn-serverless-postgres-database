import { SecretsManager } from 'aws-sdk';

const secretsManager = new SecretsManager();

export interface RDSSecret {
  username: string;
  password: string;
  engine: string;
  host: string;
  port: number;
  dbClusterIdentifier: string;
}

export const putRDSSecret = async (opts: { secretName: string; secretValue: RDSSecret }) => {
  const secretName = getSanitizedSecretName(opts.secretName);
  const jsonSecret = JSON.stringify(opts.secretValue);

  return secretsManager
    .createSecret({
      Name: secretName,
      SecretString: jsonSecret,
    })
    .promise()
    .then((res) => res.ARN)
    .catch(() =>
      secretsManager
        .updateSecret({
          SecretId: secretName,
          SecretString: jsonSecret,
        })
        .promise()
        .then((res) => res.ARN),
    );
};

const getSanitizedSecretName = (name: string) => name;
