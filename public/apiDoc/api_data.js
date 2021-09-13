define({ "api": [
  {
    "type": "get",
    "url": "/api/v1/auth/by-email/:email/exists",
    "title": "Request to check who has email",
    "name": "CheckUserWhohasEmail",
    "group": "User",
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
          "content": "HTTP/1.1 404 Not Found\n{\n  \"exists\": false\n}",
          "type": "json"
        },
        {
          "title": "Someone uses email:",
          "content": "HTTP/1.1 200 OK\n{\n  \"exists\": true\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api/v1/auth/auth.controller.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/api/v1/auth/by-username/:username/exists",
    "title": "Request to check who has username",
    "name": "CheckUserWhohasUsername",
    "group": "User",
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
          "content": "HTTP/1.1 404 Not Found\n{\n  \"exists\": false\n}",
          "type": "json"
        },
        {
          "title": "Someone uses username:",
          "content": "HTTP/1.1 200 OK\n{\n  \"exists\": true\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api/v1/auth/auth.controller.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/api/v1/auth/by-email/:email",
    "title": "Request to get user by email",
    "name": "GetUserByEmail",
    "group": "User",
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
          "content": "    HTTP/1.1 200 OK\n    {\n      user: {\n    \t\t\"_id\": \"3cda3912...\",\n    \t\t\"email\": \"test@test.com\",\n    \t\t\"username\": \"testUsername\",\n\t\t\t\"exerciseHistory\": [\n\t\t\t\t{\n\t\t\t\t\t\"calorie\":10\n\t\t\t\t\t\"km\":0.045,\n\t\t\t\t\t\"time\": 4312,\n\t\t\t\t\t\"date\":\"20210913\"\n\t\t\t\t},\n\t\t\t\t...\n\t\t\t]\n\n  \t\t}\n    }",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Not Found email:",
          "content": "HTTP/1.1 404 Not Found\n{\n\t user: null\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api/v1/auth/auth.controller.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/api/v1/auth/by-username/:username",
    "title": "Request to get user by username",
    "name": "GetUserByUsername",
    "group": "User",
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
          "content": "    HTTP/1.1 200 OK\n    {\n      user: {\n    \t\t\"_id\": \"3cda3912...\",\n    \t\t\"email\": \"test@test.com\",\n    \t\t\"username\": \"testUsername\",\n\t\t\t\"exerciseHistory\": [\n\t\t\t\t{\n\t\t\t\t\t\"calorie\":10\n\t\t\t\t\t\"km\":0.045,\n\t\t\t\t\t\"time\": 4312,\n\t\t\t\t\t\"date\":\"20210913\"\n\t\t\t\t},\n\t\t\t\t...\n\t\t\t]\n\n  \t\t}\n    }",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Not Found username:",
          "content": "HTTP/1.1 404 Not Found\n{\n\t user: null\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api/v1/auth/auth.controller.js",
    "groupTitle": "User"
  }
] });
