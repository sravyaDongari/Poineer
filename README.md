Node.js Authentication and API with SQLite and JWT
This is a Node.js application demonstrating user registration, login, authentication using JWT (JSON Web Token), and API endpoints for fetching and filtering public data.

Features:

User registration with password hashing.
User login with JWT token generation.
Protected API route accessible only with a valid token.
Public API endpoint to fetch data from an external API with filtering options.
Prerequisites:

Node.js and npm (or yarn) installed on your system.
A basic understanding of Node.js, Express.js, and JavaScript.
Installation:

Clone this repository or download the code.
Open a terminal in the project directory.
Run npm install to install the required dependencies.
Database Setup:

The application uses an in-memory SQLite database for simplicity. No additional configuration is needed.

Running the Application:

Run node app.js to start the server.
The server will run by default on port 3000 (http://localhost:3000).
API Endpoints:

1. User Registration (POST /register):

JSON

Explain
{
  "username": "your_username",
  "email": "your_email@example.com",
  "password": "your_password"
}
Use code with caution.
Response:

JSON
{
  "message": "User registered successfully"
}
Use code with caution.
2. User Login (POST /login):

JSON

Explain
{
  "email": "your_email@example.com",
  "password": "your_password"
}
Use code with caution.
Response:

JSON
{
  "token": "your_jwt_token"
}
Use code with caution.
3. Protected Route (GET /protected):

This route requires a valid token in the Authorization header (Bearer token).

Headers:

Authorization: Bearer your_jwt_token
Response:

JSON
{
  "message": "This is a protected route",
  "user": {
    "id": 1,
    "username": "your_username",
    "email": "your_email@example.com"
  }
}
Use code with caution.
4. Public Data API (GET /api/data):

This endpoint fetches data from an external public API. You can optionally provide query parameters for filtering:

category: Filter by category (case-insensitive).
limit: Limit the number of results returned.
Example Usage:

http://localhost:3000/api/data?category=Entertainment&limit=10
Response:

JSON
[
  // Filtered data based on category and limit
]
Use code with caution.
Security:

User passwords are hashed for secure storage.
JWT tokens are used for authentication but have an expiration time to prevent misuse.
Important: This is a basic example and might not be suitable for production environments. Consider additional security measures for sensitive data and user authentication in real-world applications.
Additional Notes:

This example uses the swagger-ui-express package to provide a basic API documentation interface. You can access it at http://localhost:3000/api-docs. The swagger.yaml file defines the API endpoints and their expected behavior.
