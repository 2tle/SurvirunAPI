define({ "api": [
  {
    "type": "get",
    "url": "/api/v1/auth/by-username/:username/exists",
    "title": "Request to check who has username",
    "name": "GetUser",
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
      }
    },
    "version": "0.0.0",
    "filename": "routes/api/v1/auth/auth.controller.js",
    "groupTitle": "User"
  }
] });
