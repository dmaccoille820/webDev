import * as userModel from "../models/registerLoginModel.js";

const loginUser = async (req, res) => {
  console.log('Login Controller called');
  if (req.user){
    if (req.user.user_id){
      res.status(200).json({ message: "User logged in", userId: req.user.user_id }); // <-- Correct response
    } else {
      res.status(401).json({ message: "Incorrect login details" });
    }
  } else {
    res.status(401).json({ message: "Username or email not found" });
  }

};

export { loginUser };
