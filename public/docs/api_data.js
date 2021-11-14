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
        "description": "<p>user's username</p>"
      },
      {
        "group": "Body",
        "type": "String",
        "optional": false,
        "field": "email",
        "description": "<p>user's email</p>"
      },
      {
        "group": "Body",
        "type": "String",
        "optional": false,
        "field": "password",
        "description": "<p>user's password</p>"
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
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "username",
            "description": "<p>if user set its username T/F</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "profile",
            "description": "<p>if user set its profile img T/F</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success:",
          "content": "HTTP/1.1 200 OK\n{\n\t\"token\":\"eyJwe...\",\n\t\"username\" : true,\n\t\"profile\" : false\n}",
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
        "field": "reqType",
        "description": "<p>email or username or self</p>"
      },
      {
        "group": "Query",
        "type": "String",
        "optional": false,
        "field": "resType",
        "description": "<p>url or buffer</p>"
      },
      {
        "group": "Query",
        "type": "String",
        "optional": false,
        "field": "username",
        "description": "<p>(Optional) if you want to other user's image, input it.</p>"
      },
      {
        "group": "Query",
        "type": "String",
        "optional": false,
        "field": "email",
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
          "title": "Success - buffer:",
          "content": "\tHTTP/1.1 200 OK\n\t{\n\t\t\"img\" : {\n\t\t\t\t\ttype : \"Buffer\",\n\t\t\t\t\tdata : Buffer(ex: [123,0,1,0,0,...])\n\t\t\t}\n\t\t\t\n \t\t}\n\t}",
          "type": "json"
        },
        {
          "title": "Success - url:",
          "content": "HTTP/1.1 200 OK\n{\n\t\"img\" : \"uuid\"\n}",
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
          "content": "\tHTTP/1.1 200 OK\n\t{\n\t\t\"_id\": \"3cda3912...\",\n    \t\"email\": \"test@test.com\",\n   \t\t\"username\": \"testUsername\",\n\t\t\"intro\": \"this is my just 소개글.\",\n\t\t\"score\": 100,\n\t\t\"exerciseHistory\": [\n\t\t\t{\n\t\t\t\t\"calorie\":10\n\t\t\t\t\"km\":0.045,\n\t\t\t\t\"time\": 4312,\n\t\t\t\t\"date\":\"2021-09-13\"\n\t\t\t},\n\t\t\t...\n\t\t]\n\t}",
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
          "content": "\tHTTP/1.1 200 OK\n\t{\n  \n    \t\"_id\": \"3cda3912...\",\n    \t\"email\": \"test@test.com\",\n    \t\"username\": \"testUsername\",\n\t\t\"intro\": \"this is my just 소개글.\",\n\t\t\"score\": 100,\n\t\t\"exerciseHistory\": [\n\t\t\t{\n\t\t\t\t\"calorie\":10\n\t\t\t\t\"km\":0.045,\n\t\t\t\t\"time\": 4312,\n\t\t\t\t\"date\":\"2021-09-13\"\n\t\t\t},\n\t\t\t...\n\t\t]\n\t}",
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
    "type": "patch",
    "url": "/api/v1/auth/intro",
    "title": "Request to patch my intro",
    "name": "PatchUserIntro",
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
    "body": [
      {
        "group": "Body",
        "type": "String",
        "optional": false,
        "field": "intro",
        "description": "<p>user's intro</p>"
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
          "content": "HTTP/1.1 419\n{\n \t\"code\": 5\n\t\"message\": \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/auth/auth.controller.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/api/v1/auth/defaultProfile",
    "title": "Request to update user's profile as DEFAULT IMAGE",
    "name": "SETProfileImageAsDefault",
    "description": "<p>..</p>",
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
        "type": "File",
        "optional": false,
        "field": "image",
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
  },
  {
    "type": "get",
    "url": "/api/v1/goal/compare",
    "title": "운동 목표 달성 여부 가져오기",
    "name": "GetGoalRatio",
    "group": "운동/목표",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>사용자의 토큰</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "calorie",
            "description": "<p>소모한 칼로리 비율</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "km",
            "description": "<p>달린 거리 비율</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "time",
            "description": "<p>운동한 시간 비율</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "성공:",
          "content": "HTTP/1.1 200 OK\n{\n\tcalorie: 0.32313\n\tkm: 1.311,\n\ttime: 0.91111\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "토큰 만료:",
          "content": "HTTP/1.1 419\n{\n \tcode: 5\n\terror: \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/goal/goal.controller.js",
    "groupTitle": "운동/목표"
  },
  {
    "type": "get",
    "url": "/api/v1/goal",
    "title": "운동 목표 가져오기",
    "name": "GetMyGoal",
    "group": "운동/목표",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>사용자의 토큰</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "calorie",
            "description": "<p>목표 칼로리</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "km",
            "description": "<p>목표 거리</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "time",
            "description": "<p>목표 시간</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "성공:",
          "content": "HTTP/1.1 200 OK\n{\n\tcalorie: 3241,\n\tkm: 5.311,\n\ttime: 1231,\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "토큰 만료:",
          "content": "HTTP/1.1 419\n{\n \tcode: 5\n\terror: \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/goal/goal.controller.js",
    "groupTitle": "운동/목표"
  },
  {
    "type": "patch",
    "url": "/api/v1/goal",
    "title": "운동 목표 업데이트",
    "name": "PatchMyGoal",
    "group": "운동/목표",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>사용자의 토큰</p>"
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
        "description": "<p>사용자의 목표 칼로리</p>"
      },
      {
        "group": "Body",
        "type": "Number",
        "optional": false,
        "field": "km",
        "description": "<p>사용자의 목표 거리</p>"
      },
      {
        "group": "Body",
        "type": "Number",
        "optional": false,
        "field": "time",
        "description": "<p>사용자의 목표 시간(초)</p>"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "calorie",
            "description": "<p>업데이트 된 사용자의 목표 칼로리</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "km",
            "description": "<p>업데이트 된 사용자의 목표 거리</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "time",
            "description": "<p>업데이트 된 사용자의 목표 시간(초)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "성공:",
          "content": "HTTP/1.1 200 OK\n{\n\tcalorie: 3241,\n\tkm: 5.311,\n\ttime: 1231,\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "토큰 만료:",
          "content": "HTTP/1.1 419\n{\n \tcode: 5\n\terror: \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/goal/goal.controller.js",
    "groupTitle": "운동/목표"
  },
  {
    "type": "get",
    "url": "/api/v1/exercise/img",
    "title": "운동 이미지 가져오기",
    "name": "GetExerciseImages",
    "group": "운동",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>사용자의 토큰</p>"
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
        "description": "<p>가져올 날짜 YYYY-MM-DD 또는 빈값(전체)</p>"
      },
      {
        "group": "Query",
        "type": "String",
        "optional": false,
        "field": "resType",
        "description": "<p>반환타입 url 또는 buffer</p>"
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
            "description": "<p>이미지 리스트</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "성공 - 반환타입 buffer:",
          "content": "HTTP/1.1 200 OK\n{\n\texerciseImages : [\n\t\t{\n\t\t\tdate: \"2021-09-16\",\n\t\t\ttime: \"22:01:13\",\n\t\t\timg: {\n\t\t\t\ttype : \"Buffer\",\n\t\t\t\tdata : Buffer(ex: [123,0,1,0,0,...])\n\t\t\t}\n\t\t},\n\t\t...\n\t]\n}",
          "type": "json"
        },
        {
          "title": "성공 - 반환타입 url:",
          "content": "HTTP/1.1 200 OK\n{\n\texerciseImages : [\n\t\t{\n\t\t\tdate : \"2021-09-16\",\n\t\t\ttime : \"22:01:13\",\n\t\t\t_id : \"uuid\" \n\t\t},\n\t\t...\n\t]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "토큰 만료:",
          "content": "HTTP/1.1 419\n{\n \tcode: 5\n\terror: \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/exercise/exercise.controller.js",
    "groupTitle": "운동"
  },
  {
    "type": "get",
    "url": "/api/v1/exercise/list",
    "title": "최대 1주일 까지의 운동 기록 가져오기",
    "name": "GetExerciseList",
    "group": "운동",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>사용자의 토큰</p>"
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
            "description": "<p>운동기록 리스트</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "성공:",
          "content": "HTTP/1.1 200 OK\n{\n\texerciseHistory: [\n\t\t{\n\t\t\tcalorie:10\n\t\t\tkm:0.045,\n\t\t\ttime: 4312,\n\t\t\tdate:\"2021-09-13\"\t\n\t\t},\n\t\t{\n\t\t\tcalorie:10\n\t\t\tkm:0.045,\n\t\t\ttime: 4312,\n\t\t\tdate:\"2021-09-12\"\t\n\t\t},\n\t\t...\n\t]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "토큰 만료:",
          "content": "HTTP/1.1 419\n{\n \tcode: 5\n\terror: \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/exercise/exercise.controller.js",
    "groupTitle": "운동"
  },
  {
    "type": "get",
    "url": "/api/v1/exercise",
    "title": "오늘의 운동 데이터 가져오기",
    "name": "GetTodayExercise",
    "group": "운동",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>사용자의 토큰</p>"
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
            "description": "<p>오늘 날짜</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "calorie",
            "description": "<p>사용자의 소모한 칼로리</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "km",
            "description": "<p>사용자의 달린 거리</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "time",
            "description": "<p>사용자의 달린 시간(초)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "성공:",
          "content": "HTTP/1.1 200 OK\n{\n\tcalorie:10\n\tkm:0.045,\n\ttime: 4312,\n\tdate:\"2021-09-13\"\t\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "토큰 만료:",
          "content": "HTTP/1.1 419\n{\n \tcode: 5\n\terror: \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/exercise/exercise.controller.js",
    "groupTitle": "운동"
  },
  {
    "type": "patch",
    "url": "/api/v1/exercise/score",
    "title": "사용자의 점수 업데이트",
    "name": "PatchScore",
    "group": "운동",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>사용자의 토큰</p>"
          }
        ]
      }
    },
    "query": [
      {
        "group": "Query",
        "type": "Number",
        "optional": false,
        "field": "score",
        "description": "<p>사용자의 점수</p>"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "score",
            "description": "<p>사용자의 가장 높은 점수</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "성공:",
          "content": "HTTP/1.1 200 OK\n{\n\tscore: 150\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "토큰 만료:",
          "content": "HTTP/1.1 419\n{\n \tcode: 5\n\terror: \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/exercise/exercise.controller.js",
    "groupTitle": "운동"
  },
  {
    "type": "patch",
    "url": "/api/v1/exercise",
    "title": "운동 데이터 업데이트",
    "name": "UpdateTodayExercise",
    "group": "운동",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>사용자의 토큰</p>"
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
        "description": "<p>사용자의 소모한 칼로리</p>"
      },
      {
        "group": "Body",
        "type": "Number",
        "optional": false,
        "field": "km",
        "description": "<p>사용자의 달린 거리</p>"
      },
      {
        "group": "Body",
        "type": "Number",
        "optional": false,
        "field": "time",
        "description": "<p>사용자의 달린 시간(초)</p>"
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
            "description": "<p>오늘 날짜</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "calorie",
            "description": "<p>사용자의 오늘 소모한 칼로리</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "km",
            "description": "<p>사용자의 오늘 달린 거리</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "time",
            "description": "<p>사용자의 오늘 달린 시간(초)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "성공:",
          "content": "HTTP/1.1 200 OK\n{\n\tcalorie:10\n\tkm:0.045,\n\ttime: 4312,\n\tdate:\"2021-09-13\"\t\n}",
          "type": "json"
        }
      ]
    },
    "version": "1.0.0",
    "error": {
      "examples": [
        {
          "title": "토큰 만료:",
          "content": "HTTP/1.1 419\n{\n \tcode: 5\n\terror: \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/exercise/exercise.controller.js",
    "groupTitle": "운동"
  },
  {
    "type": "post",
    "url": "/api/v1/exercise/img",
    "title": "운동 이미지 업로드",
    "name": "UploadExerciseImage",
    "group": "운동",
    "version": "1.0.0",
    "body": [
      {
        "group": "Body",
        "type": "File",
        "optional": false,
        "field": "image",
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
            "field": "Content-Type",
            "description": "<p>multipart/form-data</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>사용자의 토큰</p>"
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
            "description": "<p>결과 true 또는 false</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "성공:",
          "content": "HTTP/1.1 200 OK\n{\n\t\"result\" : true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "토큰 만료:",
          "content": "HTTP/1.1 419\n{\n \tcode: 5\n\terror: \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/exercise/exercise.controller.js",
    "groupTitle": "운동"
  },
  {
    "type": "post",
    "url": "/api/v1/friend",
    "title": "친구추가",
    "name": "AddFriendList",
    "group": "친구",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>사용자의 토큰</p>"
          }
        ]
      }
    },
    "query": [
      {
        "group": "Query",
        "type": "String",
        "optional": false,
        "field": "reqType",
        "description": "<p>요청타입 email 또는 username</p>"
      },
      {
        "group": "Query",
        "type": "String",
        "optional": false,
        "field": "username",
        "description": "<p>(옵션) 요청타입이 username인 경우 추가할 상대의 닉네임</p>"
      },
      {
        "group": "Query",
        "type": "String",
        "optional": false,
        "field": "email",
        "description": "<p>(옵션) 요청타입이 email인 경우 추가할 상대의 이메일</p>"
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
            "description": "<p>결과 true 또는 false</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "성공:",
          "content": "HTTP/1.1 200 OK\n{\n\t\"result\": true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "토큰 만료:",
          "content": "HTTP/1.1 419\n{\n \tcode: 5\n\terror: \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/friend/friend.controller.js",
    "groupTitle": "친구"
  },
  {
    "type": "get",
    "url": "/api/v1/friend/list",
    "title": "사용자의 친구 목록 가져오기",
    "name": "GetFriendList",
    "group": "친구",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>사용자의 토큰</p>"
          }
        ]
      }
    },
    "query": [
      {
        "group": "Query",
        "type": "String",
        "optional": false,
        "field": "resType",
        "description": "<p>반환타입 지정: email 또는 username</p>"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "List",
            "optional": false,
            "field": "friends",
            "description": "<p>친구리스트</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "성공, username 반환타입:",
          "content": "HTTP/1.1 200 OK\n{\n\tfriends: [\n\t\t{username: \"Lux\"},\n\t\t{username: \"Ashe\"},\n\t\t...\n\t]\n}",
          "type": "json"
        },
        {
          "title": "성공, email 반환타입:",
          "content": "HTTP/1.1 200 OK\n{\n\tfriends: [\n\t\t{email: \"java@isnotgood.com\"},\n\t\t{email: \"kotlin@isbest.io\"},\n\t\t...\n\t]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "토큰 만료:",
          "content": "HTTP/1.1 419\n{\n \tcode: 5\n\terror: \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/friend/friend.controller.js",
    "groupTitle": "친구"
  },
  {
    "type": "get",
    "url": "/api/v1/friend/roomList",
    "title": "사용자의 룸 전용 친구 목록 가져오기",
    "name": "GetFriendListRoom",
    "group": "친구",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>사용자의 토큰</p>"
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
            "field": "users",
            "description": "<p>친구들의 이메일 및 이름 리스트</p>"
          },
          {
            "group": "Success 200",
            "type": "List",
            "optional": false,
            "field": "profiles",
            "description": "<p>친구들의 프로필 사진의 고유값 리슽트</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "성공:",
          "content": "\tHTTP/1.1 200 OK\n\t{\n\t\tusers: [\n\t \t\t{email: \"someone@example.com\", username: \"Ashe\"},\n \t],\n\t\tprofiles: [\n\t\t\t{_id: \"profileUid1\"},\n\t\t]\n\t}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "토큰 만료:",
          "content": "HTTP/1.1 419\n{\n \tcode: 5\n\terror: \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/friend/friend.controller.js",
    "groupTitle": "친구"
  },
  {
    "type": "get",
    "url": "/api/v1/friend/check",
    "title": "친구여부 확인",
    "name": "GetIsFriend",
    "group": "친구",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>사용자의 토큰</p>"
          }
        ]
      }
    },
    "query": [
      {
        "group": "Query",
        "type": "String",
        "optional": false,
        "field": "reqType",
        "description": "<p>요청타입 email 또는 username</p>"
      },
      {
        "group": "Query",
        "type": "String",
        "optional": false,
        "field": "username",
        "description": "<p>(옵션) 요청타입이 username인 경우 추가할 상대의 닉네임</p>"
      },
      {
        "group": "Query",
        "type": "String",
        "optional": false,
        "field": "email",
        "description": "<p>(옵션) 요청타입이 email인 경우 추가할 상대의 이메일</p>"
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
            "description": "<p>결과 true 또는 false</p>"
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
          "title": "토큰 만료:",
          "content": "HTTP/1.1 419\n{\n \tcode: 5\n\terror: \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/friend/friend.controller.js",
    "groupTitle": "친구"
  },
  {
    "type": "patch",
    "url": "/api/v1/friend",
    "title": "친구삭제",
    "name": "RemoveFriendList",
    "group": "친구",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>사용자의 토큰</p>"
          }
        ]
      }
    },
    "query": [
      {
        "group": "Query",
        "type": "String",
        "optional": false,
        "field": "reqType",
        "description": "<p>요청타입 email 또는 username</p>"
      },
      {
        "group": "Query",
        "type": "String",
        "optional": false,
        "field": "username",
        "description": "<p>(옵션) 요청타입이 username인 경우 추가할 상대의 닉네임</p>"
      },
      {
        "group": "Query",
        "type": "String",
        "optional": false,
        "field": "email",
        "description": "<p>(옵션) 요청타입이 email인 경우 추가할 상대의 이메일</p>"
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
            "description": "<p>결과 true 또는 false</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "성공:",
          "content": "HTTP/1.1 200 OK\n{\n\t\"result\": true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "토큰 만료:",
          "content": "HTTP/1.1 419\n{\n \tcode: 5\n\terror: \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/friend/friend.controller.js",
    "groupTitle": "친구"
  }
] });
