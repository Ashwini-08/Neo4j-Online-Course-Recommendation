import React, { useState, useEffect } from 'react';
import './Home.css';

const Home = () => {
  const [enrolledCourses,setEnrolledCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [recommendedCourses,  setRecommendedCourses] = useState([]);


  useEffect(() => {
    const userId = localStorage.getItem('userId'); // Retrieve the user ID
    console.log(userId)
    // if (userId) {
      fetchEnrolledCourses();
      fetchCompletedCourses();
      fetchRecommendedCourses();
       // Fetch courses for the user when the component loads
    // }
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const token = localStorage.getItem('authToken'); // Get the auth token
      const res = await fetch(`http://34.145.27.91:3001/api/courses/enrolledCourses`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data = await res.json();
      console.log(data);
      // Directly set the userCourses state with the fetched data
      setEnrolledCourses(data);
      console.log(data);
    } catch (error) {
      console.error(error.message);
      alert('Error fetching courses. Please try again.');
    }
  };

  const fetchCompletedCourses = async () => {
    try {
      const token = localStorage.getItem('authToken'); // Get the auth token
      const res = await fetch(`http://34.145.27.91:3001/api/courses/completedCourses`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data = await res.json();
      console.log(data);
      // Directly set the userCourses state with the fetched data
      setCompletedCourses(data);
      console.log(data);
    } catch (error) {
      console.error(error.message);
      alert('Error fetching courses. Please try again.');
    }
  };

  const fetchRecommendedCourses = async () => {
    try {
      const token = localStorage.getItem('authToken'); // Get the auth token
      const res = await fetch(`http://34.145.27.91:3001/api/courses/recommendCourses`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data = await res.json();
      console.log(data);
      // Directly set the userCourses state with the fetched data
      setRecommendedCourses(data);
      console.log(data);
    } catch (error) {
      console.error(error.message);
      alert('Error fetching courses. Please try again.');
    }
  };

  return (
    <div className="home-container">
      {/* Welcome Section */}
      <div className="welcome-section">
        <h1>Welcome to the Course Recommendation Platform</h1>
        <p>
          Discover courses tailored to your interests through our graph-based
          recommendation system.
        </p>
      </div>

      {/* Enrolled Courses Section */}
      <div className="enrolled-courses-section">
        <h2>Currently Enrolled Courses</h2>
        <div className="courses-container">
          {enrolledCourses && enrolledCourses.length > 0 ? (
            enrolledCourses.map((course, index) => (
              <div key={index} className="course-card">
                <h3>{course.name}</h3>
                <p>{course.description}</p>
                <button>View Details</button>
              </div>
            ))
          ) : (
            <p>No enrolled courses available.</p>
          )}
        </div>
      </div>

      {/* Recommended Courses Section */}
      <div className="recommendations-section">
        <h2>Recommended Courses for You</h2>
        <div className="recommendations-container">
          {recommendedCourses && recommendedCourses.length > 0 ? (
            recommendedCourses.map((course, index) => (
              <div key={index} className="recommendation-card">
                <h3>{course.name}</h3>
                <p>{course.description}</p> {/* Update based on course object structure */}
                <button>Enroll</button>
              </div>
            ))
          ) : (
            <p>No recommended courses available.</p>
          )}
        </div>
      </div>

      {/* Previously Done Courses Section */}
      <div className="previous-courses-section">
        <h2>Previously Completed Courses</h2>
        <div className="courses-container">
          {completedCourses && completedCourses.length > 0 ? (
            completedCourses.map((course, index) => (
              <div key={index} className="course-card">
                <h3>{course.name}</h3>
                <p>{course.description}</p> {/* Update based on course object structure */}
                <button>View Details</button>
              </div>
            ))
          ) : (
            <p>No completed courses available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
