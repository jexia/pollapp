# Polling/voting system.
This Poll example appliction allows you to ask your site visitors an unlimited number of questions, from an 
unlimited number of respondents. You add the web widget snippet in your website and your site is ready to go.

To create your polls you get an admin panel to mannage all your Polls. Every created Poll will generate automaticly 
a widget snippet code which you can put in a website. 

[Live Demo](https://88fccaba-a957-4aa4-a455-dbd9325a42c4.jexia.app/admin)

## How to achieve using Jexia
Create a project in your Jexia account. 
Create a dataset with or without fields with name Polling, then create API key and create a policy.

## Implementation
This app is built using Vue.js, Vuex and Vuetify technologies as well as Jexia JavaScript SDK.
Made with Jexia features:

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

