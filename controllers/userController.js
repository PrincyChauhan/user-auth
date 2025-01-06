import userModel from "../models/userModels.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

// const createToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
// };

const createToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const userSignup = async (req, res) => {
  const { name, password, email, role } = req.body;
  try {
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid Email" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password should be atleast 8 characters" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // const newUser = new userModel({
    //   name,
    //   email,
    //   password: hashedPassword,
    // });

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });
    const user = await newUser.save();
    const token = createToken(user._id, role);
    console.log(token, "----------------token---------------");
    return res
      .status(201)
      .json({ success: true, message: "Register Sucessfully", token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User Doesn't exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    const token = createToken(user._id);
    return res
      .status(200)
      .json({ success: true, message: "Login Successfully", token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { userSignup, userLogin };
