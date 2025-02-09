const neo4j = require('neo4j-driver'); 

// Neo4j Aura database credentials
const uri = 'neo4j+s://d07f6073.databases.neo4j.io';  // AuraDB URI
const user = 'neo4j';  // Your database username
const password = 'KMNBLaQUxja-ogjaIcGkZR82gVzmdxvniJN9DIUCUFk';  // Your database password

// Check if the credentials are available
if (!uri || !user || !password) {
  throw new Error('Neo4j credentials are missing!');
}

// Create Neo4j driver instance
const driver = neo4j.driver(
    'neo4j+s://d07f6073.databases.neo4j.io', // Correct URI for Aura
    neo4j.auth.basic('neo4j', 'KMNBLaQUxja-ogjaIcGkZR82gVzmdxvniJN9DIUCUFk') // Correct credentials
  );
  

// Export driver for use in other parts of the application
module.exports = driver;
