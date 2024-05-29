# Profile App

## Overview
This project consists of two main components: a backend server and a client application for Android built using React Native. The backend server handles data storage and authentication, while the client app provides the user interface.

## Backend Server

### Technologies Used

- Node.js
- Express.js
- MongoDB (assuming)
- bcrypt for password hashing
- JSON Web Tokens (JWT) for authentication

### APi Endpoints

- **Login (`POST /api/user/login`)**: 
  - Authenticates users by comparing their provided credentials with those stored in the database. 
  - If the credentials are valid, it generates a JWT token for authentication.

- **Create User (`POST /api/user/`)**:
  - Registers new users by hashing their passwords before storing them in the database. 
  - It also generates a JWT token for authentication upon successful registration.

- **Get All Users (`GET /api/user/`)**:
  - Retrieves all users from the database. 
  - Requires a valid JWT token for authentication.

- **Reset Password (`POST /api/user/reset-password`)**:
  - Allows users to reset their passwords by providing their phone number and a new password. 
  - It hashes the new password before updating it in the database.

- **Get User by Phone Number (`GET /api/user/:phoneNumber`)**:
  - Retrieves a specific user from the database based on their phone number. 
  - Requires a valid JWT token for authentication.

- **Update User by Phone Number (`PUT /api/user/:phoneNumber`)**:
  - Updates a user's information in the database based on their phone number. 
  - Requires a valid JWT token for authentication.

- **Delete User by Phone Number (`DELETE /api/user/:phoneNumber`)**:
  - Deletes a user from the database based on their phone number. 
  - Requires a valid JWT token for authentication.

- **Update User's Profile Picture by Phone Number (`PUT /api/user/:phoneNumber/profile-picture`)**:
  - Updates a user's profile picture in the database based on their phone number.



### Environment Variables
To run the backend server, you need to set up the following environment variables:

- `MONGODB_URI`: The URI for connecting to your MongoDB database.
- `JWT_SECRET_KEY`: The secret key for JWT (JSON Web Token) authentication.

### Setup Instructions

1. Clone the repository:
    ```bash
    git clone https://github.com/your-repo/project-name.git
    cd project-name/Server-backend
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the `server` directory and add the following environment variables:
    ```env
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET_KEY=your_jwt_secret_key
    ```

4. Start the server:
    ```bash
    npm start
    ```

### API Endpoints

- **POST /auth/signup**: User registration
- **POST /auth/login**: User login
- **GET /data**: Fetch data (requires authentication)

## Client Application (Android)

### Technologies Used
- React Native

### Setup Instructions

1. Ensure you have the necessary prerequisites:
    - Node.js
    - Watchman
    - React Native CLI
    - Android Studio

2. Clone the repository:
    ```bash
    git clone https://github.com/your-repo/project-name.git
    cd project-name/client
    ```

3. Install the dependencies:
    ```bash
    npm install
    ```

4. Connect an Android device or start an Android emulator.

5. Run the React Native application:
    ```bash
    npx react-native run-android
    ```
