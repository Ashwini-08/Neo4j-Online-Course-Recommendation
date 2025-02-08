# Online Course Recommendation System

## Overview

A web-based application for recommending online courses, featuring a **Frontend** built with **React** and a **Backend** built with **Node.js**.

## Prerequisites

- Visual Studio Code (VS Code)
- Node.js and npm
- Git

---

## Frontend Setup

1. Navigate to the **frontend** directory.
2. Install the required dependencies:
    ```bash
    npm install
    ```
3. Start the frontend server on port 3000:
    ```bash
    npm start -- --port 3000
    ```

---

## Backend Setup

1. Navigate to the **backend/src** directory.
2. Install the required dependencies:
    ```bash
    npm install
    npm install @aws-sdk/client-s3
    ```
3. Start the backend server on port 3001:
    ```bash
    node app.js -- --port 3001
    ```

---

## Running Both Servers

To run the application:

- Start the **frontend** server (port 3000).
- Start the **backend** server (port 3001).

The frontend will communicate with the backend at `http://localhost:3001`.

---

## Accessing the Application

If you want to access the application externally, you can use the following URL:

- **Frontend**: [http://35.227.148.200:3000](http://35.227.148.200:3000)

To log in, you can use the following credentials:
- **Email**: vansh@gmail.com
- **Password**: password123

---

## Presentation

The link to our presentation is: [Google Presentation](https://docs.google.com/presentation/d/1HM6BY-cnxOazQVj3SOJXJhCtNkjpL6b0/edit?usp=sharing&ouid=106884068794371370686&rtpof=true&sd=true)


---

## Conclusion

Thank you for exploring the Online Course Recommendation System! This project demonstrates the power of using the **Neo4j graph database** for building intelligent recommendations. We hope this system showcases the potential of graph databases in organizing and querying complex relationships. If you have any questions or suggestions, feel free to reach out. Happy coding!
