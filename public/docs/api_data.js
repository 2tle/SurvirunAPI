define({ "api": [
  {
    "type": "post",
    "url": "/api/v1/auth/new",
    "title": "Request to create new user",
    "name": "CreateNewUser",
    "group": "Auth",
    "version": "1.0.0",
    "body": [
      {
        "group": "Body",
        "type": "String",
        "optional": false,
        "field": "username",
        "description": ""
      },
      {
        "group": "Body",
        "type": "String",
        "optional": false,
        "field": "email",
        "description": ""
      },
      {
        "group": "Body",
        "type": "String",
        "optional": false,
        "field": "password",
        "description": ""
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>user's jwt token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success:",
          "content": "HTTP/1.1 200 OK\n{\n\t\"token\":\"eyJwe...\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Not Found email:",
          "content": "HTTP/1.1 400 Bad Request\n{ \n\terror: \"Data must not be null\" \n}",
          "type": "json"
        },
        {
          "title": "Token Expired:",
          "content": "HTTP/1.1 419\n{\n\t\"error\": \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/auth/auth.controller.js",
    "groupTitle": "Auth"
  },
  {
    "type": "get",
    "url": "/api/v1/auth/jwt-decode",
    "title": "Request to decode jwt token",
    "name": "DecodeJwtToken",
    "group": "Auth",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>user's jwt token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>user's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>user's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>user's username</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "iat",
            "description": "<p>time that created token</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "exp",
            "description": "<p>time that will expire token</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "iss",
            "description": "<p>token issur</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "sub",
            "description": "<p>token info</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success:",
          "content": "HTTP/1.1 200 OK\n{\n\t\"_id\": \"613d65b91ef2af056a355438\",\n\t\"email\": \"taljosun\",\n\t\"username\": \"commonLicense\",\n\t\"iat\": 1631533262,\n\t\"exp\": 1631576462,\n\t\"iss\": \"studyRestAPI.2tle.repl.co\",\n\t\"sub\": \"userinfo\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Token Expired:",
          "content": "HTTP/1.1 419\n{\n\t\"error\": \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/auth/auth.controller.js",
    "groupTitle": "Auth"
  },
  {
    "type": "delete",
    "url": "/api/v1/auth/local",
    "title": "Request to delete user",
    "name": "DeletePassword",
    "group": "Auth",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>user's jwt token</p>"
          }
        ]
      }
    },
    "body": [
      {
        "group": "Body",
        "type": "String",
        "optional": false,
        "field": "password",
        "description": "<p>password</p>"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "result",
            "description": "<p>true or false</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success:",
          "content": "HTTP/1.1 200 OK\n{\n\t\"result\": true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Token Expired:",
          "content": "HTTP/1.1 419\n{\n\t\"error\": \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/auth/auth.controller.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/api/v1/auth/local",
    "title": "Request to login",
    "name": "Login",
    "group": "Auth",
    "version": "1.0.0",
    "body": [
      {
        "group": "Body",
        "type": "String",
        "optional": false,
        "field": "email",
        "description": ""
      },
      {
        "group": "Body",
        "type": "String",
        "optional": false,
        "field": "password",
        "description": ""
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>user's jwt token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success:",
          "content": "HTTP/1.1 200 OK\n{\n\t\"token\":\"eyJwe...\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Not Found email:",
          "content": "HTTP/1.1 400 Bad Request\n{ \n\terror: \"Data must not be null\" \n}",
          "type": "json"
        },
        {
          "title": "Token Expired:",
          "content": "HTTP/1.1 419\n{\n\t\"error\": \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/auth/auth.controller.js",
    "groupTitle": "Auth"
  },
  {
    "type": "patch",
    "url": "/api/v1/auth/password",
    "title": "Request to update password",
    "name": "UpdatePassword",
    "group": "Auth",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>user's jwt token</p>"
          }
        ]
      }
    },
    "body": [
      {
        "group": "Body",
        "type": "String",
        "optional": false,
        "field": "changePassword",
        "description": "<p>changePassword</p>"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "result",
            "description": "<p>true or false</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success:",
          "content": "HTTP/1.1 200 OK\n{\n\t\"result\": true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Token Expired:",
          "content": "HTTP/1.1 419\n{\n\t\"error\": \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/auth/auth.controller.js",
    "groupTitle": "Auth"
  },
  {
    "type": "patch",
    "url": "/api/v1/auth/by-username/:username",
    "title": "Request to update username",
    "name": "UpdateUsername",
    "group": "Auth",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>user's jwt token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>username that will update</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "result",
            "description": "<p>true or false</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success:",
          "content": "HTTP/1.1 200 OK\n{\n\t\"result\": true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Token Expired:",
          "content": "HTTP/1.1 419\n{\n\t\"error\": \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/auth/auth.controller.js",
    "groupTitle": "Auth"
  },
  {
    "type": "get",
    "url": "/api/v1/exercise/img",
    "title": "Request to get exercise images",
    "name": "GetExerciseImages",
    "group": "Exercise",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>user's jwt token</p>"
          }
        ]
      }
    },
    "query": [
      {
        "group": "Query",
        "type": "String",
        "optional": false,
        "field": "date",
        "description": "<p>YYYY-MM-DD or &quot;&quot;</p>"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "List",
            "optional": false,
            "field": "exerciseImages",
            "description": "<p>List Image</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success:",
          "content": "HTTP/1.1 200 OK\n{\n\t\"exerciseImages\" : [\n\t\t{\n\t\t\t\"date\" : \"2021-09-16\",\n\t\t\t\"time\" : \"22:01:13\",\n\t\t\t\"img\" : {\n\t\t\t\ttype : \"Buffer\",\n\t\t\t\tdata : Buffer(ex: [123,0,1,0,0,...])\n\t\t\t}\n\t\t},\n\t\t...\n\t]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Something Error:",
          "content": "HTTP/1.1 500 Internal Server Error\n{ \n\terror: \"something error msg\" \n}",
          "type": "json"
        },
        {
          "title": "Token Expired:",
          "content": "HTTP/1.1 419\n{\n\t\"error\": \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/exercise/exercise.controller.js",
    "groupTitle": "Exercise"
  },
  {
    "type": "get",
    "url": "/api/v1/exercise/list",
    "title": "Request to get exercise data before 7days",
    "name": "GetExerciseList",
    "group": "Exercise",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>user's jwt token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "List",
            "optional": false,
            "field": "exerciseHistory",
            "description": "<p>user's today exercise</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success:",
          "content": "HTTP/1.1 200 OK\n{\n\t\"exerciseHistory\": [\n\t\t{\n\t\t\t\"calorie\":10\n\t\t\t\"km\":0.045,\n\t\t\t\"time\": 4312,\n\t\t\t\"date\":\"2021-09-13\"\t\n\t\t},\n\t\t{\n\t\t\t\"calorie\":10\n\t\t\t\"km\":0.045,\n\t\t\t\"time\": 4312,\n\t\t\t\"date\":\"2021-09-12\"\t\n\t\t},\n\t\t...\n\t]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Not Found email:",
          "content": "HTTP/1.1 500 Internal Server Error\n{ \n\terror: \"something error msg\" \n}",
          "type": "json"
        },
        {
          "title": "Token Expired:",
          "content": "HTTP/1.1 419\n{\n\t\"error\": \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/exercise/exercise.controller.js",
    "groupTitle": "Exercise"
  },
  {
    "type": "get",
    "url": "/api/v1/exercise",
    "title": "Request to get today exercise data",
    "name": "GetTodayExercise",
    "group": "Exercise",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>user's jwt token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "date",
            "description": "<p>user's today exercise</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "calorie",
            "description": "<p>user's today exercise: calorie</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "km",
            "description": "<p>user's today exercise: running km</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "time",
            "description": "<p>user's today exercise: time (second)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success:",
          "content": "HTTP/1.1 200 OK\n{\n\t\"calorie\":10\n\t\"km\":0.045,\n\t\"time\": 4312,\n\t\"date\":\"2021-09-13\"\t\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Not Found email:",
          "content": "HTTP/1.1 500 Internal Server Error\n{ \n\terror: \"something error msg\" \n}",
          "type": "json"
        },
        {
          "title": "Token Expired:",
          "content": "HTTP/1.1 419\n{\n\t\"error\": \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/exercise/exercise.controller.js",
    "groupTitle": "Exercise"
  },
  {
    "type": "patch",
    "url": "/api/v1/exercise",
    "title": "Request to update User's Exercise data",
    "name": "UpdateTodayExercise",
    "group": "Exercise",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>user's jwt token</p>"
          }
        ]
      }
    },
    "body": [
      {
        "group": "Body",
        "type": "Number",
        "optional": false,
        "field": "calorie",
        "description": "<p>user's today exercise: calorie</p>"
      },
      {
        "group": "Body",
        "type": "Number",
        "optional": false,
        "field": "km",
        "description": "<p>user's today exercise: running km</p>"
      },
      {
        "group": "Body",
        "type": "Number",
        "optional": false,
        "field": "time",
        "description": "<p>user's today exercise: time (second)</p>"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "date",
            "description": "<p>user's today exercise</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "calorie",
            "description": "<p>user's today exercise: calorie</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "km",
            "description": "<p>user's today exercise: running km</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "time",
            "description": "<p>user's today exercise: time (second)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success:",
          "content": "HTTP/1.1 200 OK\n{\n\t\"calorie\":10\n\t\"km\":0.045,\n\t\"time\": 4312,\n\t\"date\":\"2021-09-13\"\t\n}",
          "type": "json"
        }
      ]
    },
    "version": "1.0.0",
    "error": {
      "examples": [
        {
          "title": "Not Found email:",
          "content": "HTTP/1.1 500 Internal Server Error\n{ \n\terror: \"something error msg\" \n}",
          "type": "json"
        },
        {
          "title": "Token Expired:",
          "content": "HTTP/1.1 419\n{\n\t\"error\": \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/exercise/exercise.controller.js",
    "groupTitle": "Exercise"
  },
  {
    "type": "post",
    "url": "/api/v1/exercise/img",
    "title": "Request to upload exercise image",
    "name": "UploadExerciseImage",
    "description": "<p>Must USE Header :: Content-Type :  multipart/form-data</p>",
    "group": "Exercise",
    "version": "1.0.0",
    "body": [
      {
        "group": "Body",
        "type": "Image",
        "optional": false,
        "field": "img",
        "description": "<p>Image File</p>"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>user's jwt token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "result",
            "description": "<p>true</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success:",
          "content": "HTTP/1.1 200 OK\n{\n\t\"result\" : true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Something Error:",
          "content": "HTTP/1.1 500 Internal Server Error\n{ \n\terror: \"something error msg\" \n}",
          "type": "json"
        },
        {
          "title": "Token Expired:",
          "content": "HTTP/1.1 419\n{\n\t\"error\": \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/exercise/exercise.controller.js",
    "groupTitle": "Exercise"
  },
  {
    "type": "post",
    "url": "/api/v1/friend",
    "title": "Request to add user's friend",
    "name": "AddFriendList",
    "group": "Friend",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>user's jwt token</p>"
          }
        ]
      }
    },
    "body": [
      {
        "group": "Body",
        "type": "String",
        "optional": false,
        "field": "username",
        "description": "<p>friend's username</p>"
      }
    ],
    "version": "1.0.0",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "result",
            "description": "<p>true or false</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success:",
          "content": "HTTP/1.1 200 OK\n{\n\t\"result\": true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Token Expired:",
          "content": "HTTP/1.1 419\n{\n\t\"error\": \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/friend/friend.controller.js",
    "groupTitle": "Friend"
  },
  {
    "type": "get",
    "url": "/api/v1/friend/list",
    "title": "Request to get user's friend list",
    "name": "GetFriendList",
    "group": "Friend",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>user's jwt token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "List",
            "optional": false,
            "field": "friends",
            "description": "<p>friends list</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success:",
          "content": "HTTP/1.1 200 OK\n{\n\t\"friends\": [\n\t\t{username: \"Lux\"},\n\t\t{username: \"Ashe\"},\n\t\t...\n\t]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Token Expired:",
          "content": "HTTP/1.1 419\n{\n\t\"error\": \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/friend/friend.controller.js",
    "groupTitle": "Friend"
  },
  {
    "type": "patch",
    "url": "/api/v1/friend",
    "title": "Request to remove user's friend",
    "name": "RemoveFriendList",
    "group": "Friend",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>user's jwt token</p>"
          }
        ]
      }
    },
    "body": [
      {
        "group": "Body",
        "type": "String",
        "optional": false,
        "field": "username",
        "description": "<p>friend's username</p>"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "result",
            "description": "<p>true or false</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success:",
          "content": "HTTP/1.1 200 OK\n{\n\t\"result\": true\n}",
          "type": "json"
        }
      ]
    },
    "version": "1.0.0",
    "error": {
      "examples": [
        {
          "title": "Token Expired:",
          "content": "HTTP/1.1 419\n{\n\t\"error\": \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/friend/friend.controller.js",
    "groupTitle": "Friend"
  },
  {
    "type": "get",
    "url": "/api/v1/auth/by-email/:email/exists",
    "title": "Request to check who has email",
    "name": "CheckUserWhohasEmail",
    "group": "User",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>email</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "exists",
            "description": "<p>If someone already had email, return true. If nobody had email, return false.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Nobody uses email:",
          "content": "HTTP/1.1 200 OK\n{\n\t\"exists\": false\n}",
          "type": "json"
        },
        {
          "title": "Someone uses email:",
          "content": "HTTP/1.1 200 OK\n{\n\t\"exists\": true\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/auth/auth.controller.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/api/v1/auth/by-username/:username/exists",
    "title": "Request to check who has username",
    "name": "CheckUserWhohasUsername",
    "group": "User",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>username</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "exists",
            "description": "<p>If someone already had username, return true. If nobody had username, return false.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Nobody uses username:",
          "content": "HTTP/1.1 200 OK\n{\n\t\"exists\": false\n}",
          "type": "json"
        },
        {
          "title": "Someone uses username:",
          "content": "HTTP/1.1 200 OK\n{\n\t\"exists\": true\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/auth/auth.controller.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/api/v1/auth/profile",
    "title": "Request to get user's profile image",
    "name": "GetProfileImage",
    "group": "User",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>user's jwt token</p>"
          }
        ]
      }
    },
    "query": [
      {
        "group": "Query",
        "type": "String",
        "optional": false,
        "field": "username",
        "description": "<p>(Optional) if you want to other user's image, input it.</p>"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "img",
            "description": "<p>ImageBuffer..</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success:",
          "content": "HTTP/1.1 200 OK\n{\n\t\"img\" : {\n\t\t\t\ttype : \"Buffer\",\n\t\t\t\tdata : Buffer(ex: [123,0,1,0,0,...])\n\t\t}\n\t\t\n\t]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Something Error:",
          "content": "HTTP/1.1 500 Internal Server Error\n{ \n\terror: \"something error msg\" \n}",
          "type": "json"
        },
        {
          "title": "Token Expired:",
          "content": "HTTP/1.1 419\n{\n\t\"error\": \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/auth/auth.controller.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/api/v1/auth/by-email/:email",
    "title": "Request to get user by email",
    "name": "GetUserByEmail",
    "group": "User",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>user's jwt token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>email</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "User",
            "optional": false,
            "field": "user",
            "description": "<p>UserData</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success:",
          "content": "\tHTTP/1.1 200 OK\n\t{\n\t\tuser: {\n    \t\t\"_id\": \"3cda3912...\",\n    \t\t\"email\": \"test@test.com\",\n    \t\t\"username\": \"testUsername\",\n\t\t\t\"exerciseHistory\": [\n\t\t\t\t{\n\t\t\t\t\t\"calorie\":10\n\t\t\t\t\t\"km\":0.045,\n\t\t\t\t\t\"time\": 4312,\n\t\t\t\t\t\"date\":\"2021-09-13\"\n\t\t\t\t},\n\t\t\t\t...\n\t\t\t]\n\n  \t\t}\n\t}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Not Found email:",
          "content": "HTTP/1.1 404 Not Found\n{\n\tuser: null\n}",
          "type": "json"
        },
        {
          "title": "Token Expired:",
          "content": "HTTP/1.1 419\n{\n\t\"error\": \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/auth/auth.controller.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/api/v1/auth/by-username/:username",
    "title": "Request to get user by username",
    "name": "GetUserByUsername",
    "group": "User",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>user's jwt token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>username</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "User",
            "optional": false,
            "field": "user",
            "description": "<p>UserData</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success:",
          "content": "\tHTTP/1.1 200 OK\n\t{\n     user: {\n    \t\t\"_id\": \"3cda3912...\",\n    \t\t\"email\": \"test@test.com\",\n    \t\t\"username\": \"testUsername\",\n\t\t\t\"exerciseHistory\": [\n\t\t\t\t{\n\t\t\t\t\t\"calorie\":10\n\t\t\t\t\t\"km\":0.045,\n\t\t\t\t\t\"time\": 4312,\n\t\t\t\t\t\"date\":\"2021-09-13\"\n\t\t\t\t},\n\t\t\t\t...\n\t\t\t]\n\n  \t\t}\n\t}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Not Found username:",
          "content": "HTTP/1.1 404 Not Found\n{\n\tuser: null\n}",
          "type": "json"
        },
        {
          "title": "Token Expired:",
          "content": "HTTP/1.1 419\n{\n\t\"error\": \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/auth/auth.controller.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/api/v1/auth/profile",
    "title": "Request to update user's profile",
    "name": "UploadProfileImage",
    "description": "<p>Must USE Header :: Content-Type :  multipart/form-data</p>",
    "group": "User",
    "version": "1.0.0",
    "body": [
      {
        "group": "Body",
        "type": "Image",
        "optional": false,
        "field": "img",
        "description": "<p>Image File</p>"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>user's jwt token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "result",
            "description": "<p>true</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success:",
          "content": "HTTP/1.1 200 OK\n{\n\t\"result\" : true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Something Error:",
          "content": "HTTP/1.1 500 Internal Server Error\n{ \n\terror: \"something error msg\" \n}",
          "type": "json"
        },
        {
          "title": "Token Expired:",
          "content": "HTTP/1.1 419\n{\n\t\"error\": \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/auth/auth.controller.js",
    "groupTitle": "User"
  }
] });