import React, { useEffect, useState } from 'react';
import './Recommendations.css';
import { getRecommendations } from '../services/api';

const Recommendations = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getRecommendations()
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load recommendations.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="recommendations">
      <h1>Recommended Courses</h1>

      {loading && <div className="spinner">Loading...</div>}

      {error && <p className="error">{error}</p>}

      {!loading && !error && courses.length > 0 ? (
        <div className="course-list">
          {courses.map((course) => (
            <div className="course-card" key={course.id}>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <button
                onClick={() => alert(`View more about: ${course.title}`)}
              >
                Learn More
              </button>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p>No recommendations available at the moment.</p>
      )}
    </div>
  );
};

export default Recommendations;
