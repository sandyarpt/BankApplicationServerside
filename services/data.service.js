//import jsonwebtoken
const jwt = require("jsonwebtoken");

// import db.js
const db = require("./db"); //User is inside the db, So import db to use User in data.service.js

// db = {
//   1000: {
//     acno: 1000,
//     username: "Anu",
//     password: 1000,
//     balance: 5000,
//     transaction: [],
//   },
//   1001: {
//     acno: 1001,
//     username: "ammu",
//     password: 1001,
//     balance: 6000,
//     transaction: [],
//   },
//   1002: {
//     acno: 1002,
//     username: "hari",
//     password: 1002,
//     balance: 7000,
//     transaction: [],
//   },
// }

//login - Asynchronous

const login = (acno, pswd) => {
  return db.User.findOne({
    acno,
    password: pswd,
  }).then((user) => {
    console.log(user);
    if (user) {
      currentUser = user.username;

      currentAcno = acno;

      //token generation//signature generation ,signature-just a unique number

      token = jwt.sign(
        {
          //store account number inside token
          currentAcno: acno,
        },
        "supersecretkey12345"
      );

      return {
        status: true,
        message: "login successfully",
        statusCode: 200,
        currentUser,
        currentAcno,
        token,
      };
    } else {
      return {
        status: false,
        message: "Invalid Account number or Password (invalid credentials) !!!",
        statusCode: 401,
      };
    }
  });
};

//   if (acno in db) {
//     if (pswd == db[acno]["password"]) {
//       currentUser = db[acno]["username"];
//       currentAcno = acno;

//       //token generation//signature generation ,signature-just a unique number

//       token=jwt.sign({
//         //store account number inside token
//         currentAcno:acno
//       },'supersecretkey12345')

//       return {
//         status: true,
//         message: "login successfully",
//         statusCode: 200,
//         currentUser,
//         currentAcno,
//         token
//       }
//     } else {
//       return {
//         status: false,
//         message: "incorrect password",
//         statusCode: 401,
//       }
//     }
//   } else {
//     return {
//       status: false,
//       message: "inavalid accno",
//       statusCode: 401,
//     }
//   }
// }

//register -Asynchronous

const register = (username, acno, password) => {
  //Asynchronous -

  return db.User.findOne({
    acno,
  }).then((user) => {
    console.log(user);
    if (user) {
      return {
        status: false,
        message: "already registered ....please log in",
        statusCode: 401,
      };
    } else {
      const newUser = new db.User({
        acno,
        username,
        password,
        balance: 0,
        transaction: [],
      });
      //save to mongoDB
      newUser.save();
      return {
        status: true,
        message: "Registered successfully",
        statusCode: 200,
      };
    }
  });
};

//deposit
const deposit = (req,acno,password,amt) => {
  var amount = parseInt(amt);
  var  currentAcno =req.currentAcno

  return db.User.findOne({
    acno,
    password,
  }).then((user) => {
    if (user) {
      if(acno != currentAcno){
        return {
          status: false,
            message: "Permission Denied",
            statusCode: 401,
          };
      }


      user.balance += amount;
      user.transaction.push({
        type: "CREDIT",
        amount: amount,
      });
      console.log(user.balance);
      user.save();
      return {
        status: true,
        message:
          amount + "deposited successfully ... New balance is " + user.balance,
        statusCode: 200,
      };
    } else {
      return {
        status: false,
        message: "Invalid Account number or Password (invalid credentials) !!!",
        statusCode: 401,
      };
    }
  });
};

//   if (acno in db) {
//     if (password == db[acno]["password"]) {
//       db[acno]["balance"] = db[acno]["balance"] + amount;
//       db[acno].transaction.push({
//         type: "CREDIT",
//         amount: amount,
//       });
//       return {
//         status: true,
//         message:
//           amount +
//           "deposited successfully ... New balance is " +
//           db[acno]["balance"],
//         statusCode: 200,
//       };
//     } else {
//       return {
//         status: false,
//         message: "incorrect password",
//         statusCode: 401,
//       };
//     }
//   } else {
//     return {
//       status: false,
//       message: "user does not exist",
//       statusCode: 401,
//     };
//   }
// ;

//withdraw
const withdraw = (req,acno, password, amt) => {
  var amount = parseInt(amt);
 var  currentAcno =req.currentAcno
  return db.User.findOne({
    acno,
    password
  }).then((user) => {
   
    if (user) {
      if(acno != currentAcno){
        return {
          status: false,
            message: "Permission Denied",
            statusCode: 401,
          };
      }
      
      console.log(user);
      if (user.balance > amount) {
        user.balance -= amount
        user.transaction.push({
          type: "DEBIT",
          amount: amount,
        });
        
        user.save();
        return {
          status: true,
          message:
            amount + " debited successfully ... New balance is " + user.balance,
          statusCode: 200,
        };
      }else{
        return {
               status: false,
                 message: "insufficient balance",
                 statusCode: 401,
               };

      }
    } else {
      return {
        status: false,
        message: "Invalid Account number or Password (invalid credentials) !!!",
        statusCode: 401,
      };
    }
  });
};

// {
//   var amount = parseInt(amt); //html input willbe of string, so need to convert to integer.
//   return db.User.findOne({
//     acno, password
//   }).then(user=>{
//     if(user){
//       if(user.balance>amount){

//       }
//       user.balance -= amount
//       user.transaction.push({
//           type: "CREDIT",
//           amount: amount,
//         })
//   if (acno in db) {
//     if (password == db[acno]["password"]) {
//       if (db[acno]["balance"] > amount) {
//         db[acno]["balance"] = db[acno]["balance"] - amount;
//         db[acno].transaction.push({
//           type: "DEBIT",
//           amount: amount,
//         });

//         return {
//           status: true,
//           message:
//             amount +
//             "debited  successfully ... New balance is " +
//             db[acno]["balance"],
//           statusCode: 200,
//         };
//       } else {
//         return {
//           status: false,
//           message: "insufficient balance",
//           statusCode: 422,
//         };
//       }
//     } else {
//       return {
//         status: false,
//         message: "incorrect password",
//         statusCode: 401,
//       };
//     }
//   } else {
//     return {
//       status: false,
//       message: "user does not exist",
//       statusCode: 401,
//     };
//   }
// };
//Transaction
const getTransaction = (acno) => {


  return db.User.findOne({
    acno
   
  }).then((user) => {
    if (user) {
  
        return {
          status: true,
          statusCode: 200,
          transaction: user.transaction,
        }
      }
      else{
        return {
          status: false,
          message: "user does not exist",
          statusCode: 401,
        };
      }
    })
  }
  
  //delete
  const deleteAcc=(acno)=>{

    return db.User.deleteOne({
      acno
     
    }).then((user) => {
      if (!user) {
    
        return {
          status: false,
          message: "Operation Failed",
          statusCode: 401,
        }
      }
      
          return {
            status: true,
            message: "successfully Deleted",
            statusCode: 200,
          };
       
      })

  }
      



//   if (acno in db) {
//     return {
//       status: true,
//       statusCode: 200,
//       transaction: db[acno].transaction,
//     };
//   } else {
//     return {
//       status: false,
//       message: "user does not exist",
//       statusCode: 401,
//     };
//   }
// }; //class

//exports
module.exports = {
  register,
  login,
  deposit,
  withdraw,
  getTransaction,
  deleteAcc
};
