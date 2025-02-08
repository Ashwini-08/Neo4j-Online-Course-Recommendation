const neo4j = require('neo4j-driver');

// Neo4j driver setup
const driver = neo4j.driver(
  'neo4j+s://d07f6073.databases.neo4j.io', // Use the appropriate URI
  neo4j.auth.basic('neo4j', 'SDNucqzMzFHsvhWCbQaAI06jeEIwTTzXkVaauIEqxy4'),
);

// Find user by email (node label-agnostic)
const findUserByEmail = async (email) => {
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (n:Student) WHERE n.email = $email
       RETURN n {
         email: n.email,
         name: n.name,
         password: n.password,
         age: n.age,
         department: n.department,
         preferredTopic: n.preferredTopic,
         enrolledCourses: n.enrolledCourses,
         completedCourses: n.completedCourses,
         role: n.role,
         profilePicture: n.profilePicture
       } AS user`,
      { email }
    );

    if (result.records.length === 0) {
      return null; // No user found
    }

    // Return the user properties as an object
    return result.records[0].get('user');
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw new Error('Error fetching user');
  } finally {
    await session.close();
  }
};

// Save or update user profile (node label-agnostic)
const saveOrUpdateUserProfile = async (userData) => {
  const { 
    email, 
    name, 
    age, 
    department, 
    preferredTopic = [], 
    enrolledCourses = [], 
    completedCourses = [], 
    role, 
    profilePicture 
  } = userData;

  const session = driver.session();

  try {
    const result = await session.run(
      `MERGE (n {email: $email})
       SET n.name = $name, 
           n.age = $age, 
           n.department = $department, 
           n.preferredTopic = coalesce(n.preferredTopic, []) + $preferredTopic,
           n.enrolledCourses = coalesce(n.enrolledCourses, []) + $enrolledCourses,
           n.completedCourses = coalesce(n.completedCourses, []) + $completedCourses,
           n.role = $role, 
           n.profilePicture = $profilePicture
       RETURN n {
         email: n.email,
         name: n.name,
         age: n.age,
         department: n.department,
         preferredTopic: n.preferredTopic,
         enrolledCourses: n.enrolledCourses,
         completedCourses: n.completedCourses,
         role: n.role,
         profilePicture: n.profilePicture
       } AS user`,
      {
        email,
        name,
        age: parseInt(age, 10), // Ensure proper data type
        department,
        preferredTopic: Array.isArray(preferredTopic) ? preferredTopic : [preferredTopic],
        enrolledCourses: Array.isArray(enrolledCourses) ? enrolledCourses : [enrolledCourses],
        completedCourses: Array.isArray(completedCourses) ? completedCourses : [completedCourses],
        role,
        profilePicture,
      }
    );

    // Return the updated or created user
    return result.records[0].get('user');
  } catch (error) {
    console.error('Error saving/updating user profile:', error);
    throw new Error('Error saving or updating user profile');
  } finally {
    await session.close();
  }
};

const runQuery = async (query, params) => {
  const session = driver.session();
  try {
    const result = await session.run(query, params);
    return result;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  } finally {
    await session.close();
  }
};

// Save user and overwrite (if necessary) the entire profile
const saveUser = async (email, updatedData) => {
  const { 
    name, 
    age, 
    department, 
    preferredTopic = [], 
    enrolledCourses = [], 
    completedCourses = [], 
    role, 
    profilePicture 
  } = updatedData;

  const query = `
    MATCH (n) WHERE n.email = $email
    SET n.name = $name,
        n.age = $age,
        n.department = $department,
        n.preferredTopic = coalesce(n.preferredTopic, []) + $preferredTopic,
        n.enrolledCourses = coalesce(n.enrolledCourses, []) + $enrolledCourses,
        n.completedCourses = coalesce(n.completedCourses, []) + $completedCourses,
        n.profilePicture = $profilePicture,
        n.role = $role
    RETURN n
  `;

  const params = {
    email,
    name,
    age: parseInt(age, 10), // Ensure proper data types
    department,
    preferredTopic: Array.isArray(preferredTopic) ? preferredTopic : [preferredTopic],
    enrolledCourses: Array.isArray(enrolledCourses) ? enrolledCourses : [enrolledCourses],
    completedCourses: Array.isArray(completedCourses) ? completedCourses : [completedCourses],
    profilePicture,
    role,
  };

  const result = await runQuery(query, params);
  return result.records[0]?.get("n").properties || {}; // Return updated user properties
};


module.exports = {
  findUserByEmail,
  saveOrUpdateUserProfile,
  saveUser,
};
