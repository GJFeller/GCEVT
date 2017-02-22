# AngularJS + D3 + ThreeJS + RESTful Integration

This is an base front-end application to have a base application which integrates AngularJS, access to no-sql database with RESTful API, D3 for 2D data visualization and ThreeJS for 3D rendering. 

The back-end application to make the RESTful API is at https://github.com/GJFeller/MongoBackendRESTful


### Prerequisites

You need to install before running the code:

- MongoDB (for the back-end)
- Node.js
- Bower

### Install Dependencies

Execute in the terminal the following command to install all the dependencies needed but bower (bower need to be installed before):

```
npm install
```

### Run the Application

1st - Get the Iris dataset (https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data) and write with MongoDB client. You are going to need to write code to parse the data and transform it in JSON and write it in the database.

2nd - Run the MongoDB server (if it is not running yet).

3rd - Run the back-end application to be able to load the data.

4th - Run the following command in the terminal for the front-end application:

```
npm start
```

5th - Now browse to the app at [`localhost:8000/index.html`][local-app-url].


