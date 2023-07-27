const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const SECRET_KEY = "DwSlkDca2lrLxJv9hFHOFPKCEDBU5b5s";

const app = express();

app.use(express.json());

app.use("/customer",session({secret: SECRET_KEY, resave: true, saveUninitialized: true}));

app.use("/customer/auth/*", function auth(req,res,next){
  if(!req.session || !req.session.user){
    res.status(403).send('Authentication failed');
  }else{
    next();
  }
});

const PORT =3000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
