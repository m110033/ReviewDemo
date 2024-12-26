# Performance Review System API Documentation

## Authentication

### Login
```
POST /api/auth/login

Request Body:
{
  "email": "string",
  "password": "string"
}

Response:
{
  "access_token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "role": "string"
  }
}
```

### Register
```
POST /api/auth/register

Request Body:
{
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string",
  "department": "string"
}
```

## Admin Routes

### Users Management
```
GET    /api/admin/users         # Get all users
POST   /api/admin/users         # Create new user
PUT    /api/admin/users/:id     # Update user
DELETE /api/admin/users/:id     # Delete user
```

### Reviews Management
```
GET    /api/admin/reviews           # Get all reviews
POST   /api/admin/reviews           # Create new review
PUT    /api/admin/reviews/:id       # Update review
DELETE /api/admin/reviews/:id       # Delete review
POST   /api/admin/reviews/:id/assign # Assign reviewers
```

## Employee Routes

### Profile Management
```
GET    /api/employee/profile    # Get own profile
PUT    /api/employee/profile    # Update own profile
```

### Reviews
```
GET    /api/employee/reviews/pending    # Get pending reviews
GET    /api/employee/reviews/my         # Get own reviews
POST   /api/employee/reviews/:id/submit # Submit review feedback
```

## Public Routes
```
GET    /api/health              # API health check
GET    /api/departments         # Get all departments
```

## Request Headers
```
Authorization: Bearer {token}
Content-Type: application/json
```

## Response Codes
```
200 - Success
201 - Created
400 - Bad Request
401 - Unauthorized
403 - Forbidden
404 - Not Found
500 - Server Error
```

## Sample Requests

### Create Review
```
POST /api/admin/reviews

Request Body:
{
  "employeeId": "string",
  "reviewers": ["string"],
  "period": "2024-Q1",
  "dueDate": "2024-03-31"
}
```

### Submit Feedback
```
POST /api/employee/reviews/:id/submit

Request Body:
{
  "rating": 5,
  "comments": "string",
  "strengths": ["string"],
  "improvements": ["string"]
}
```

## Error Response Format
```
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Error type"
}
```
