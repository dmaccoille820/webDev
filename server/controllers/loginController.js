const loginUser = async (req, res) => {
  console.log('Login Controller called with req.userId:', req.userId);
  console.log('req.userId:', req.userId);
  console.log('req.userId.user_id:', req.userId?.user_id);


  
  if (req.userId){
    if (req.userId.user_id){
      res.status(200).json({ message: "User logged in", userId: req.userId.user_id }); // <-- Correct response
    } else {
      res.status(401).json({ message: "Incorrect login details" });
   }
  
  } else {
    res.status(401).json({ message: "Username or email not found" });
  }

};

const getUserData = async (req, res) => {
  if(req.userId){
    res.json({
      user_id: req.userId?.user_id,
      // name: req.user.name,
      // username: req.user.username,
      // email: req.user.email
    });
  } else {
    res.status(401).json({message: "User not found"});
  }
};

export { loginUser, getUserData };