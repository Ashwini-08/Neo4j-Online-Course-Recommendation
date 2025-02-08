import React, { useState, useEffect } from "react";
import "./Profile.css";

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    department: "",
    preferredTopic: [],
    enrolledCourses: [],
    completedCourses: [],
    role: "Student",
    profilePicture: "", // Profile picture URL will be stored here
  });

  const [editable, setEditable] = useState(false);
  const [profilePicPreview, setProfilePicPreview] = useState(""); // State for profile picture preview

  useEffect(() => {
    handleFetchProfileDetails(); // Fetch basic profile details
    fetchProfilePicture(); // Fetch the profile picture from S3 or backend
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddMultiValue = (e, field) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newValue = e.target.value.trim();
      if (newValue && !formData[field].includes(newValue)) {
        setFormData({
          ...formData,
          [field]: [...formData[field], newValue],
        });
        e.target.value = "";
      }
    }
  };

  const handleRemoveValue = (field, value) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((item) => item !== value),
    });
  };

  const handleFetchProfileDetails = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("http://35.227.148.200:3001/api/users/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch profile details: ${res.status}`);
      }

      const response = await res.json();
      const data = response.data || {};

      setFormData({
        name: data.name || "",
        email: data.email || "",
        age: data.age || "",
        department: data.department || "",
        preferredTopic: Array.isArray(data.preferredTopic) ? data.preferredTopic : [],
        enrolledCourses: Array.isArray(data.enrolledCourses) ? data.enrolledCourses : [],
        completedCourses: Array.isArray(data.completedCourses) ? data.completedCourses : [],
        role: data.role || "Student",
        profilePicture: data.profilePicture || "", // This will be set if available from API
      });
    } catch (error) {
      console.error(error.message);
      alert("Error fetching profile details. Please try again.");
    }
  };

  const fetchProfilePicture = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("http://35.227.148.200:3001/api/users/profile-picture", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) {
        throw new Error(`Failed to fetch profile picture: ${res.status}`);
      }
  
      const response = await res.json();
      const imageUrl = response.profilePicture;
      console.log(imageUrl) // Use the correct key from the response
  
      setFormData((prevData) => ({
        ...prevData,
        profilePicture: imageUrl,
      }));
    } catch (error) {
      console.error("Error fetching profile picture:", error.message);
      alert("Error fetching profile picture. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Preview image
      setProfilePicPreview(imageUrl); // Set preview
      uploadProfilePicture(file); // Upload image
    }
  };

  const uploadProfilePicture = async (file) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.error("Token is not available or expired.");
        alert("You need to log in again.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://35.227.148.200:3001/api/users/upload-profile-picture", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        console.error(`Failed to upload profile picture: ${res.status}`);
        throw new Error(`Failed to upload profile picture: ${res.status}`);
      }

      const response = await res.json();
      const updatedProfilePic = response.imageUrl; // Assuming backend returns image URL
      setFormData((prevData) => ({
        ...prevData,
        profilePicture: updatedProfilePic,
      }));
    } catch (error) {
      console.error("Error uploading profile picture:", error.message);
      alert("Error uploading profile picture. Please try again.");
    }
  };

  const handleSavePreferences = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.error("Token is not available or expired.");
        alert("You need to log in again.");
        return;
      }

      const filteredPreferredTopic = Array.isArray(formData.preferredTopic)
        ? formData.preferredTopic.filter((item) => item.trim() !== "")
        : [];
      const filteredEnrolledCourses = Array.isArray(formData.enrolledCourses)
        ? formData.enrolledCourses.filter((item) => item.trim() !== "")
        : [];
      const filteredCompletedCourses = Array.isArray(formData.completedCourses)
        ? formData.completedCourses.filter((item) => item.trim() !== "")
        : [];

      const dataToSend = {
        name: formData.name,
        email: formData.email,
        age: formData.age,
        department: formData.department,
        preferredTopic: filteredPreferredTopic,
        enrolledCourses: filteredEnrolledCourses,
        completedCourses: filteredCompletedCourses,
        role: formData.role,
        profilePicture: formData.profilePicture, // Profile picture URL is saved as part of the preferences
      };

      const res = await fetch("http://35.227.148.200:3001/api/users/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        console.error(`Failed to update profile: ${res.status}`);
        throw new Error(`Failed to update profile: ${res.status}`);
      }

      const updatedData = await res.json();
      setFormData(updatedData);
      alert("Profile updated successfully!");
      setEditable(false);
    } catch (error) {
      console.error("Error saving profile:", error.message);
      alert("Error saving profile. Please try again.");
    }
  };

  const handleEditPreferences = () => {
    setEditable(true);
  };

  return (
    <div className="profile-container">
      <h2>Profile Details</h2>
      <div className="profile-picture" onClick={() => document.getElementById("fileInput").click()}>
        {profilePicPreview || formData.profilePicture ? (
          <img src={profilePicPreview || formData.profilePicture} alt="Profile" />
        ) : (
          <div>No profile picture</div>
        )}
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
      <div className="profile-details">
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          disabled={!editable}
        />
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={!editable}
        />
        <label>Age:</label>
        <input
          type="text"
          name="age"
          value={formData.age}
          onChange={handleChange}
          disabled={!editable}
        />
        <label>Department:</label>
        <input
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          disabled={!editable}
        />
        <label>Role:</label>
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          disabled={!editable}
        />
      </div>
      <div className="profile-actions">
        {editable ? (
          <button onClick={handleSavePreferences}>Save</button>
        ) : (
          <button onClick={handleEditPreferences}>Edit</button>
        )}
      </div>
    </div>
  );
};

export default Profile;
