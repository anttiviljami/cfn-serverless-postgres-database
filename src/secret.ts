export interface RDSSecret {
  username: string;
  password: string;
  engine: string;
  host: string;
  port: number;
  dbClusterIdentifier: string;
}
