//server creation

//1.import express (for server creation we are using the framework express)

const express = require("express");

//import jsonwebtoken
const jwt=require('jsonwebtoken')

//import cors
const cors=require('cors')


//import dataService
const dataService=require('./services/data.service')

//server app create using express (server name we set  as app)
const app = express(); //express method  of express library is used to create server 

// cors use in server app
app.use(cors({
  origin:'http://localhost:4200'
}))



//parse JSON data using json() method of express and use it in our app server

app.use(express.json())

//Application Specific middelware
const appMiddleware=(req,res,next)=>{
  console.log("applicartion specific middleware");
next()
}

//use middelware in app
app.use(appMiddleware)


//router  Specific middelware
const jwtMiddleware = (req,res,next) =>{
  //fetch token
  try{token=req.headers['x-access-token']
  //verify token
  const data = jwt.verify(token, 'supersecretkey12345' )
console.log(data);
req.currentAcno = data.currentAcno
next()}
catch{
  res.status(401).json({
    status:false,
    statusCode:401,
    message:'please Log In'

  })
}
}


//bank server

//register API -Asynchronous
app.post('/register',(req,res)=>{
    //register solving
    // console.log(req.body);
   
    dataService.register(req.body.username,req.body.acno,req.body.password)
    .then(result=>{
      res.status(result.statusCode).json(result)
    })
// res.send("success")

    //     if(result){
//         res.send("Registered successfully")
//     }
//     else{
//     res.send("already registered ....please log in")
// }
})


//login API - Asynchronous
app.post('/login',(req,res)=>{
 dataService.login(req.body.acno,req.body.pswd)
 .then(result=>{
  res.status(result.statusCode).json(result)
})

})


//deposit API
app.post('/deposit',jwtMiddleware,(req,res)=>{

  dataService.deposit(req,req.body.acno,req.body.password,req.body.amt)
 .then(result=>{
  res.status(result.statusCode).json(result)
})

})


//withdraw API
app.post('/withdraw',jwtMiddleware,(req,res)=>{
dataService.withdraw(req,req.body.acno,req.body.password,req.body.amt)
.then(result=>{
  res.status(result.statusCode).json(result)
})
})

//Transaction API
app.post('/Transaction',jwtMiddleware,(req,res)=>{
  dataService.getTransaction(req.body.acno)
  .then(result=>{
res.status(result.statusCode).json(result)

  })
})

//deleteAcc API
app.delete('/deleteAcc/:acno',jwtMiddleware,(req,res)=>{
  //delete solving
  dataService.deleteAcc(req.params.acno)
  .then(result=>{
res.status(result.statusCode).json(result)

  })
})




//user request resolving

//get request -to fetch data
app.get("/", (req, res) => {
  res.send("Get Request");
});

// //post request -to create data in server
app.post("/", (req, res) => {
  res.send("post Request");
});

//put request - to modify entire data
app.put('/',(req,res)=>{
    res.send("put Request")
})

//patch request - to modify partially
app.patch('/',(req,res)=>{
    res.send("patch Request")
})


//delete request - to modify partially
app.delete('/',(req,res)=>{
    res.send("delete Request")
})

//set up port number to the  server app
app.listen(3000, () => {
  console.log("server stareted at 3000");
});
