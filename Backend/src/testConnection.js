const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
  'neo4j+s://a2764099.databases.neo4j.io',
  neo4j.auth.basic('neo4j', 'password')
);

console.log('Connected successfully to Neo4j');
