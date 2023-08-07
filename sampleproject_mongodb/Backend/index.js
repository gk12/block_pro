const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const taskmodel = require("./model/model");
const User = require("./model/user");

const Role = require("./model/roles");

const fs = require("fs");
const app = express();
const cors = require("cors");
const { error } = require("console");
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
const bcrypt = require("bcrypt");
const user = require("./model/user");
const jwt = require("jsonwebtoken");

const verifytoken = require("./middleware/verifyy");

const secretKey = "secretKey";
const PORT = 4010
const mongoUrl = "mongodb://127.0.0.1:27017/todo-list";
// app.use(middleware);
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log(err);
  });

// login user
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email }).populate("role");

  if (user) {

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      jwt.sign({ email }, secretKey, { expiresIn: "500000s" }, (err, token) => {
        res
          .json({
            message: "login successfully",
            token,
            user: {
              _id: user._id,
              email: user.email,
              roleId: user.role,
            },
          })
          .status(200);
      });
    } else {
      res.json({ message: "user name or password incorrect" }).status(404);
    }
  } else {
    res.json({ message: "User not registerd" }).status(404);
  }
});

app.use(verifytoken);
// if we write like this then it will use in whole program
// app.use(verifytoken);

// it will bcrypt the password

// app.get("/new", async (req, res) => {
//   const task1 = await taskmodel.find();
//   try {
//     if (!task1.length) {
//       return res.json({ message: "No task is present" });
//     }
//     res.send(task1);
//   } catch {
//     res.status(500).send(error);
//   }
// });

// // create task
// app.post("/new", async (req, res) => {
//   const taskadd = await taskmodel.create(req.body);

//   try {
//     res.send(taskadd);
//   } catch {
//     res.status(500).send(error);
//   }
// });

// // delete task
// app.delete("/new/:id", async (req, res) => {
//   let taskId = await taskmodel.findById(req.params.id);
//   try {
//     if (!taskId) {
//       return res.status(404).json({
//         success: false,
//         message: "not found",
//       });
//     }

//     await taskId.deleteOne({ _id: req.params.id });

//     res.status(200).json({
//       success: true,
//       message: "removed",
//     });
//   } catch (error) {
//     res.json({ message: "error" }).status(404);
//   }
// });

// // update task
// app.put("/new/:id", async (req, res) => {
//   let taksss = await taskmodel.findById(req.params.id);
//   try {
//     if (!taksss) {
//       res.status(500).json({
//         success: false,
//         message: "not found",
//       });
//     }

//     taksss = await taskmodel.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       useFindAndModify: true,
//       runValidators: true,
//     });
//   } catch (error) {
//     console.log(error);
//   }
//   res.status(200).json({
//     success: true,
//     message: "update",
//     taksss,
//   });
// });

// filter role = user only
// function filteradmin(users) {
//   return users.filter((user) => user.role !== "admin");
// }

function filteradmin(users) {
  return users.filter((role1) => role1.role.role !== "admin");
}

// 08/02/23
async function verifyAdmin(req, res, next) {
  jwt.verify(req.token, secretKey, async (err, Data) => {
    if (err) {
      res
        .json({
          message: "Invalid token",
        })
        .status(400);
    } else {
      // data me email hai usse hum check ker rhe hai role ka
      const user = await User.findOne({ email: Data.email }).populate("role");

      // i have added this to check the user is associatde with which type of role
      // const userRole = await Role.findOne(user.roleId);
      console.log(user.role);

      // console.log(userRole)
      if (!user)
        return res.json({
          message: `No User found with the email ${Data.email}`,
        });

      //* user ke ander role and uske ander role
      console.log(user.role);

      // i will send req to check role associated with the email is admin or not
      req.isAdmin = user.role.role === "admin" ? true : false;
      // console.log(req.isAdmin);
      next();
    }
  });
}

// login admin and see the users data
app.get("/users", verifyAdmin, async (req, res) => {
  // console.log(req.isAdmin);
  if (!req.isAdmin) {
    return res.json({
      message: "not authorised",
    });
  }
 
  const users = await User.find().populate("role");
  console.log(users);
  const filterdata = filteradmin(users);
  return res.json({ filterdata });
});

//change the role of user by admin

app.patch("/user/role/:userid", verifyAdmin, async (req, res) => {
  // const { userid } = req.params;
  const { role } = req.body;

  // console.log(req.isAdmin);

  // console.log("hello");

  if (!req.isAdmin) {
    return res.json({
      message: "not authorised",
    });
  }


  try {
    // const user = await User.findOne({ _id: req.params.userid });

    //User is now role
    const user = await User.findOne({ _id: req.params.userid }).populate(
      "role"
    );

    
    if (user.role.role === role) {
      return res.json({ message: "no need to update" });
    }

    console.log(user);

    const role1 = await Role.findOne({ role });
  

    // const  role1 = await Role.findOne({role});
    console.log(role1)
    if (!user) {
      return res.json({ message: "user not found" }).status(404);
    }

   

    //  console.log(user.role._id)
    // console.log(user.role.role);

 

    // console.log(user.role._id);
    // user.role._id = role._id;
    // console.log(user.role.role);

    // const updateduser = await User.updateOne({ _id: user._id }, { role });

    // update

    // 2.05 min
    const updateduser = await User.updateOne({ _id: user._id }, { role:role1._id });
    // console.log(user.role._id);
    // console.log(role1._id);
    // await user.role.save();
    res.json({ message: "user details updated", updateduser }).status(200);
  } catch (error) {
    console.error("error", error);
    res.json({ message: "something went wrong" });
  }
});

// write like this or write like req.body.password
// const { email, password } = req.body;
// const user = await User.findOne({ email: email });
// const users = await User.find();
// if (user) {
//   const isPasswordValid = await bcrypt.compare(password, user.password);
//   if (isPasswordValid) {
//     if (user.role === "admin") {
//       const filterdata = filteradmin(users);
//       res.json({ users: filterdata });
//     } else {
//       res.json({ message: "login successfully", user: user }).status(200);
//     }
//   } else {
//     res.json({ message: "user name or password incorrect" }).status(404);
//   }
// } else {
//   res.json({ message: "User not registerd" }).status(404);
// }
// });

// eska maine middleware bna dala hai
// function verifytoken(req, res, next) {
//   bearer_header = req.headers["authorization"];
//   if (typeof bearer_header !== "undefined") {
//     // i have bearer in header so we have 2 things in an array and we want 2nd thing that is token.
//     // so in token we adding index 1st element of an array
//     const bearer = bearer_header.split(" ");
//     const token = bearer[1];

//     // yaha se token ko bhej denge ab
//     req.token = token;
//     next();
//   } else {
//     res
//       .json({
//         message: "not a authorised admin",
//       })
//       .status(404);
//   }
// }

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
