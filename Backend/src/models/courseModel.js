const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    'neo4j+s://d07f6073.databases.neo4j.io', // Use the appropriate URI
    neo4j.auth.basic('neo4j', 'SDNucqzMzFHsvhWCbQaAI06jeEIwTTzXkVaauIEqxy4'), // Your Neo4j connection credentials
  );

exports.createCourse = async (courseData) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `CREATE (c:Course {id: randomUUID(), name: $name, description: $description, instructor: $instructor})
            RETURN c`,
            courseData
        );
        return result.records[0].get('c').properties;
    } finally {
        session.close();
    }
};

exports.getAllCourses = async () => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (c:Course) RETURN c`
        );
        return result.records.map(record => record.get('c').properties);
    } finally {
        session.close();
    }
};

exports.getCourseById = async (id) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (c:Course {id: $id}) RETURN c`,
            { id }
        );
        return result.records[0]?.get('c').properties || null;
    } finally {
        session.close();
    }
};

exports.updateCourse = async (id, updates) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (c:Course {id: $id})
            SET c += $updates
            RETURN c`,
            { id, updates }
        );
        return result.records[0]?.get('c').properties || null;
    } finally {
        session.close();
    }
};

exports.deleteCourse = async (id) => {
    const session = driver.session();
    try {
        await session.run(
            `MATCH (c:Course {id: $id}) DETACH DELETE c`,
            { id }
        );
        return true;
    } finally {
        session.close();
    }
};

exports.createEnrollmentRelationship = async (email, courseNames) => {
    const session = driver.session();
    try {
        // First, check if the student exists
        const studentCheck = await session.run(
            `MATCH (s:Student {email: $email}) RETURN s`, 
            { email }
        );
        if (studentCheck.records.length === 0) {
            console.log('Student not found');
            return { error: 'Student not found' };
        }

        // Check if all courses exist by name
        const courseCheck = await session.run(
            `MATCH (c:Course) WHERE c.name IN $courseNames RETURN c`, 
            { courseNames }
        );

        if (courseCheck.records.length !== courseNames.length) {
            console.log('Some courses not found');
            return { error: 'Some courses not found' };
        }

        // Create relationships between the student and the courses based on course name
        const result = await session.run(
            `
            MATCH (n:Student {email: $email})
            UNWIND $courseNames AS courseName
            MATCH (c:Course {name: courseName})
            MERGE (n)-[:enrolledIn]->(c)
            RETURN n, c
            `,
            { email, courseNames }
        );

        return result.records.map((record) => ({
            student: record.get('n').properties,
            course: record.get('c').properties,
        }));
    } finally {
        session.close();
    }
};


exports.getCoursesForStudent = async (email) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (s:Student {email: $email})-[:ENROLLEDIN]->(c:Course)
            RETURN c`, 
            { email }
        );
        return result.records.map(record => record.get('c').properties);
    } finally {
        session.close();
    }
};

exports.getCoursesWithCompletedInRelation = async (email) => {
    const session = driver.session(); // Create a new Neo4j session
    try {
        const result = await session.run(
            `MATCH (s:Student {email: $email})-[:COMPLETED_IN]->(c:Course)
             RETURN c`, 
            { email } // Pass email securely as a parameter
        );

        // Map and return the course properties
        return result.records.map(record => record.get('c').properties);
    } finally {
        session.close(); // Ensure the session is closed
    }
};

exports.getRecommendation = async (email) => {
    const session = driver.session(); // Create a new Neo4j session
    try {
        const result = await session.run(
            `MATCH (Student:Student {email: $email})-[:ENROLLEDIN|COMPLETED_IN]->(c:Course)
             MATCH (other:Student)-[:ENROLLEDIN|COMPLETED_IN]->(recommended:Course)
             WHERE other <> Student  // Ensure we are not recommending courses already taken by the student
             AND NOT (Student)-[:ENROLLEDIN|COMPLETED_IN]->(recommended)  // Filter out courses already enrolled or completed by the student
             RETURN DISTINCT recommended
             LIMIT 5`, 
            { email } // Pass email securely as a parameter
        );

        // Map and return the course names directly
        return result.records.map(record => record.get('recommended').properties);
    } finally {
        session.close(); // Ensure the session is closed
    }
};




