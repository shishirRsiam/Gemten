# Gemten API Documentation

This is a full-stack project with a **Django** backend and a **React** frontend. Follow the steps below to set up and run the project locally.

## API Endpoints
- **Base URL**: `http://localhost:8000/api`

---

### 1. `GET /auth/`
Fetch logget in User Info. Requires authentication token in the `Authorization` header.

#### Request
- **Method**: `GET`
- **URL**: `/auth/`

#### Response
- **Status**: `200 OK`
- **Body**:
  ```json
   {
      "user_profile": {
         "id": 4,
         "user": {
               "username": "shisdhirrohahsiamok",
               "email": "shisdhir.siaohahmok@gmail.com",
               "first_name": "Sishir",
               "last_name": "Siam"
         },
         "phone_no": "+8801234567890",
         "date_of_birth": "2020-12-12",
         "gender": "Male",
         "profile_pic": "/Media/profile_pics/default.png",
         "address": null,
         "bio": null
      }
   }
  ```

#### Error Response
- **Status**: `400 Bad Request`
- **Body**:
  ```json
  {
    "status": "error",
    "message": "Failed to fetch users.",
    "error_code": "FETCH_FAILED"
  }
  ```

---
### 1. `GET /user/`
Fetch a list of all users.

#### Request
- **Method**: `GET`
- **URL**: `/user/`

#### Response
- **Status**: `200 OK`
- **Body**:
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john.doe@example.com"
      },
      {
        "id": 2,
        "name": "Jane Smith",
        "email": "jane.smith@example.com"
      }
    ]
  }
  ```

#### Error Response
- **Status**: `400 Bad Request`
- **Body**:
  ```json
  {
    "status": "error",
    "message": "Failed to fetch users.",
    "error_code": "FETCH_FAILED"
  }
  ```

---

### 2. `GET /user/{id}/`
Fetch the details of a specific user by ID.

#### Request
- **Method**: `GET`
- **URL**: `/user/{id}/`
- **URL Params**: 
  - `id` (required): The ID of the user to retrieve.

#### Response
- **Status**: `200 OK`
- **Body**:
  ```json
  {
    "status": "success",
    "data": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com"
    }
  }
  ```

#### Error Response
- **Status**: `404 Not Found`
- **Body**:
  ```json
  {
    "status": "error",
    "message": "User not found.",
    "error_code": "USER_NOT_FOUND"
  }
  ```

---

### Additional Endpoints
Add more API endpoints as your application grows. For example:
- `POST /user/` to create a new user.
- `PUT /user/{id}/` to update user details.
- `DELETE /user/{id}/` to delete a user.

Each new endpoint should follow the structure provided above, with necessary modifications for HTTP methods, parameters, and response bodies.
