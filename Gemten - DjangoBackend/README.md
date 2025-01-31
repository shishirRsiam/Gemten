# Gemten API Documentation

This is a full-stack project with a **Django** backend and a **React** frontend. Follow the steps below to set up and run the project locally.

### Endpoints
Add more API endpoints as your application grows. For example:
- `GET /user/` to fetch all users.
- `GET /user/{id}/` to fetch a specific user.
- `POST /user/` to create a new user.
- `POST /login/` for user login.
- `GET /logout/` for user logout. 
Each new endpoint should follow the structure provided above, with necessary modifications for HTTP methods, parameters, and response bodies.



## API Endpoints
- **Base URL**: `http://localhost:8000/api`

---


### 1. `GET /user/?all_user=1/`
Fetch a list of all users.

#### Request
- **Method**: `GET`
- **URL**: `/user/`

#### Response
- **Status**: `200 OK`
- **Body**:
  ```json
    {
        "status": true,
        "all_user": [
            {
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
            },
            {
                "id": 5,
                "user": {
                    "username": "shisdhirro4hahsiamok",
                    "email": "shisdhir.siaoh4ahmok@gmail.com",
                    "first_name": "Sishir",
                    "last_name": "Siam"
                },
                "phone_no": "+8801234563890",
                "date_of_birth": "2020-12-12",
                "gender": "Male",
                "profile_pic": "/Media/profile_pics/default.png",
                "address": null,
                "bio": null
            },
            {
                "id": 6,
                "user": {
                    "username": "shisdhirrdo4hahsiamok",
                    "email": "shisdhir.siaodh4ahmok@gmail.com",
                    "first_name": "Sishir",
                    "last_name": "Siam"
                },
                "phone_no": "+8801230563890",
                "date_of_birth": "2020-12-12",
                "gender": "Male",
                "profile_pic": "/Media/profile_pics/default.png",
                "address": null,
                "bio": null
            },
            {
                "id": 7,
                "user": {
                    "username": "shisdhirr6do4hahsiamok",
                    "email": "shisdhir.siao6h4ahmok@gmail.com",
                    "first_name": "Sishir",
                    "last_name": "Siam"
                },
                "phone_no": "+8801230560890",
                "date_of_birth": "2020-12-12",
                "gender": "Male",
                "profile_pic": "/Media/profile_pics/default.png",
                "address": null,
                "bio": null
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


### 2. `GET /auth/`
Fetch logget in User Info. Requires authentication token in the `Authorization` header.

#### Request
- **Method**: `GET`
- **URL**: `/auth/`
- **Headers**:
  - `Authorization: Token <Token>` (required)

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

### 3. `GET /user/{id}/`
Fetch the details of a specific user by ID.


#### Request
- **Method**: `GET`
- **URL**: `/auth/`

#### Response
- **Status**: `200 OK`
- **Body**:
  ```json
    {
      "user_profile": {
          "id": 5,
          "user": {
              "username": "siam",
              "email": "siam@gmail.com",
              "first_name": "Sishir",
              "last_name": "Siam"
          },
          "phone_no": "+8801234563890",
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














### 3. `POST /login/`
Login the user with the provided credentials.

#### Request
- **Method**: `POST`
- **URL**: `/login/`
- **Body**:
  ```json
  {
    "user_info": "+8801234567890", `Email, Username, Phone No`
    "password": "123456"
  }
  ```

#### Response
- **Status**: `200 OK`
- **Body**:
  ```json
  {
    "status": true,
    "title": "Login successful",
    "message": "You are now logged in",
    "token": "Token 7044fad6d34395ef99c0da37957cb44d176557aa",
    "user": {
        "username": "shisdhirrohahsiamok",
        "email": "shisdhir.siaohahmok@gmail.com",
        "first_name": "Sishir",
        "last_name": "Siam"
    }
  }
  ```

#### Error Response
- **Status**: `401 Unauthorized`
- **Body**:
  ```json
  {
    "status": "error",
    "message": "Invalid credentials",
    "error_code": "INVALID_CREDENTIALS"
  }
  ```

---

### 4. `POST /logout/`

#### Request
- **Method**: `GET`
- **URL**: `/logout/`
- **Headers**:
  - `Authorization: Token <Token>` (required)

#### Response
- **Status**: `200 OK`
- **Body**:
  ```json
  {
    "status": "success",
    "message": "Logout successful"
  }
  ```

#### Error Response
- **Status**: `401 Unauthorized`
- **Body**:
  ```json
  {
    "status": "error",
    "message": "Invalid token or already logged out",
    "error_code": "INVALID_TOKEN"
  }
  ```