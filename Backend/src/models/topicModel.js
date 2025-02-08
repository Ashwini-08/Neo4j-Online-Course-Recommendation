const driver = require('../config/neo4j');

exports.createTopic = async (topicData) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `CREATE (t:Topic {id: randomUUID(), name: $name, description: $description, courseId: $courseId})
            RETURN t`,
            topicData
        );
        return result.records[0].get('t').properties;
    } finally {
        session.close();
    }
};

exports.getAllTopics = async () => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (t:Topic) RETURN t`
        );
        return result.records.map(record => record.get('t').properties);
    } finally {
        session.close();
    }
};

exports.getTopicById = async (id) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (t:Topic {id: $id}) RETURN t`,
            { id }
        );
        return result.records[0]?.get('t').properties || null;
    } finally {
        session.close();
    }
};

exports.updateTopic = async (id, updates) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (t:Topic {id: $id})
            SET t += $updates
            RETURN t`,
            { id, updates }
        );
        return result.records[0]?.get('t').properties || null;
    } finally {
        session.close();
    }
};

exports.deleteTopic = async (id) => {
    const session = driver.session();
    try {
        await session.run(
            `MATCH (t:Topic {id: $id}) DETACH DELETE t`,
            { id }
        );
        return true;
    } finally {
        session.close();
    }
};
