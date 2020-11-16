# CloudFormation Serverless Postgres Database

[![License](http://img.shields.io/:license-mit-blue.svg)](https://github.com/anttiviljami/cfn-serverless-postgres-database/blob/master/LICENSE)

Custom CloudFormation Resource to create a database and credentials in an Aurora Serverless PostgreSQL cluster.

Creates the following resources:
- PostgreSQL database
- PostgreSQL user with full privileges to the database
- [Secrets Manager Secret resource]() with access credentials to the database

## Quick Start

Deploy the SAM application in your account:

```
npm install
npm run build
npm run deploy -- --guided
```

Use in your CloudFormation templates as a custom resource:

```yaml
AWSTemplateFormatVersion: 2010-09-09
Resources:
  Database:
    Type: Custom::ServerlessPostgresDatabase
    Properties:
      ServiceToken: !ImportValue ServerlessDatabaseCustomResourceLambda
      ClusterARN: arn:aws:rds:eu-central-1:123:cluster:mycluster
      ClusterSecret: arn:aws:secretsmanager:eu-central-1:123:secret:mysecret-ABC123
      DatabaseName: my_database
Outputs:
  DatabaseSecret:
    Value: !GetAtt Database.SecretArn
```

## Syntax

To declare this entity in your AWS CloudFormation template, use the following syntax:

```yaml
Type: Custom::ServerlessPostgresDatabase
Properties: 
  ServiceToken: String
  ClusterARN: String
  ClusterSecret: String
  DatabaseName: String
  DatabaseUser: String
  SecretName: String
```

## Properties

#### `ServiceToken`

The ARN of the deployed custom resource Lambda.

If you used this SAM project to deploy, you can use the exported value `!ImportValue ServerlessDatabaseCustomResourceLambda`

*Required*: Yes

*Type*: String

#### `ClusterARN`

The ARN of the Aurora Serverless cluster to create database in.

*Required*: Yes

*Type*: String

#### `ClusterSecret`

The name or ARN of the secret that enables access to the DB cluster via the RDS Data API.

*Required*: Yes

*Type*: String

#### `DatabaseName`

The name of the database to create.

*Required*: Yes

*Type*: String

#### `DatabaseUser`

The name of the user to create for the database. Defaults to value of DatabaseName.

*Required*: No

*Type*: String

#### `SecretName`

The name of the secret that will be created to store the credentials. If not provided, a default value will be generated based on other inputs.

*Required*: No

*Type*: String

## Return values

### Ref

When you pass the logical ID of this resource to the intrinsic `Ref` function, `Ref` returns the resource name.

For more information about using the `Ref` function, see [`Ref`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-ref.html).

### Fn::GetAtt

The `Fn::GetAtt` intrinsic function returns a value for a specified attribute of this type. The following are the available attributes and sample return values.

For more information about using the `Fn::GetAtt` intrinsic function, see [`Fn::GetAtt`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-getatt.html).

#### `SecretArn`

ARN of the secrets manager secret resource which contains the RDS access credentials to the database.

## Examples

See [`examples/`](./examples).

## Secret Value

The JSON value of the Secrets Manager secret created by this custom resource looks like this:

```json
{
  "username": "user",
  "password": "pass",
  "database": "db",
  "engine": "postgres",
  "host": "mycluster.cluster-abc123.eu-central-1.rds.amazonaws.com",
  "port": 5432,
  "dbClusterIdentifier": "mycluster"
}
```
