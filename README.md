# Recipe API

A simple backend application built with Node.js and Express to manage recipes. This API supports CRUD operations, image uploads, and basic validation. The recipes are stored in-memory and persist in a JSON file. Image files are stored locally.

It is worthy of note that this project adapts MVC design pattern. There is an extra layer called service used to cater for business logic hereby returning response to controller.

## Features

- Fetch a paginated list of recipes
- Fetch details of a single recipe
- Create a new recipe
- Update an existing recipe
- Delete a recipe
- Upload and associate images with recipes
- Basic data validation and error handling
- Tests

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher)

### Clone the Repository

```bash
git clone https://github.com/olamide-soyoye/recipe-app-backend.git

cd recipe-app-backend
```
### Install Dependencies

```bash
npm install
```

### Run Locally

```bash
node server.js #to serve
nodemon server.js #Applicable for development mode
```
### Run Tests
```bash
npm test
```
### Deployment URL
```bash
 https://recipe-app-backend-78nx.onrender.com/ 
```