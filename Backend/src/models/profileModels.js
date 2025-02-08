// models/profile.js

class Profile {
    constructor(driver) {
      this.driver = driver;
    }
  
    // Fetch profile by email
    async fetchProfileByEmail(email) {
      const session = this.driver.session();
      try {
        const result = await session.run(
          "MATCH (n) WHERE n.email = $email RETURN n",
          { email }
        );
        if (result.records.length === 0) {
          throw new Error("Profile not found");
        }
        return result.records[0].get("n").properties;
      } catch (error) {
        throw error;
      } finally {
        session.close();
      }
    }
  
    // Update profile
    async updateProfile(email, profileData) {
      const session = this.driver.session();
      try {
        const { fullName, age, department, preferredTopic, role, profilePicture } = profileData;
        const result = await session.run(
          `MATCH (n) WHERE n.email = $email
           SET n.fullName = $fullName, n.age = $age, n.department = $department, 
               n.preferredTopic = $preferredTopic, n.role = $role, n.profilePicture = $profilePicture
           RETURN n`,
          { email, fullName, age, department, preferredTopic, role, profilePicture }
        );
        if (result.records.length === 0) {
          throw new Error("Profile update failed");
        }
        return result.records[0].get("n").properties;
      } catch (error) {
        throw error;
      } finally {
        session.close();
      }
    }
  }
  
  module.exports = Profile;
  