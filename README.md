# Poll app.
Example application: Poll app is a Survey/Voting/Polling application which contains a JS web widget and an Admin Panel for managing Polls. 
For every created poll, it will generate widget JS snipped that you can add to the website.

## Features
 - Admin panel for polls management and reports
 - Javascript web widget snippet generator
 - Jexia:
   - Project integration
   - Dataset CRUD operations
   - Authentication service

## Built With
### Dependencies
| Name| Description | |
|--|--|:--:| 
|[body-parser]|Node.js body parsing middleware|📚
|[cors]|Node.js CORS middleware|📚
|[express]|Fast, unopinionated, minimalist web framework|🎨
|[jexia-sdk-js]|Awesome Jexia Javascript SDK|🐝
|[node-fetch]|A light-weight module that brings window.fetch to node.js|🛠️
|[ws]|Simple to use, blazing fast and thoroughly tested websocket client and server for Node.js|🛠️


## Installation & Setup
### Clone repository
```
git clone git@github.com:jexia/pollapp.git
cd pollapp
```

### Install dependencies
```
npm install
```
### Setup Jexia project
```
1. Create project
2. Create dataset named [questions] with these fields: 
[
  {
    "field_name": "question",
    "field_type": "string",
    "is_required": "true"
  },
  {
    "field_name": "order",
    "field_type": "integer",
    "is_required": "true"
  },
  {
    "field_name": "poll_uuid",
    "field_type": "string",
    "is_required": "true"
  },
  {
    "field_name": "skipped",
    "field_type": "boolean",
    "is_required": "false"
  }
]
3. Create dataset named [answers] with these fields:
[
  {
    "field_name": "question_uuid",
    "field_type": "string",
    "is_required": "true"
  },
  {
    "field_name": "answer",
    "field_type": "string",
    "is_required": "true"
  },
  {
    "field_name": "result",
    "field_type": "integer",
    "is_required": "true"
  },
  {
    "field_name": "poll_uuid",
    "field_type": "string",
    "is_required": "true"
  }
]
4. Create dataset named [polls] with these fields:
[
  {
    "field_name": "message",
    "field_type": "string",
    "is_required": "true"
  },
  {
    "field_name": "name",
    "field_type": "string",
    "is_required": "true"
  }
]
5. Create API-key
6. Create CRUD policy for all users and all datasets
7. Update the code with your host-id, project-id, API-key and API-secret

```

### Compiles and hot-reloads for development
```
npm start
```

### Compiles and minifies for production (branch frontend)
```
npm run build
```

### Lints and fixes files
```
npm run lint
```
## License
[MIT](./LICENSE) &copy; jexia

