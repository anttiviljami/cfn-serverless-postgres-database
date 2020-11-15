# CloudFormation Custom Resource Aurora Serverless Postgres Database

Custom CloudFormation Resource to create a database and credentials in an Aurora Serverless PostgreSQL cluster

## Usage

Deploy the SAM application in your account:

```
npm install
npm run build
npm run deploy -- --guided
```

Use in your CloudFormation templates as a custom resource

```yaml
Database:
    Type: Custom::ServerlessPostgresDatabase
    Properties:
      ServiceToken: !ImportValue ServerlessDatabaseCustomResourceLambda
```
