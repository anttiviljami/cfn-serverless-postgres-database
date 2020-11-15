import { RDS } from 'aws-sdk';

const rds = new RDS();

export const describeServerlessCluster = async (clusterArn: string) => {
  const res = await rds
    .describeDBClusters({
      DBClusterIdentifier: clusterArn,
    })
    .promise();
  return res.DBClusters[0];
};
