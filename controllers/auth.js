import jwt from "jsonwebtoken";
import User from "../models/user";

export const register = async (req, res) => {
  console.log(req.body);

  const { name, email, password } = req.body;
  if (!name || name.length < 4)
    return res
      .status(400)
      .send("Name is required and must be 4 charecter long");
  if (!password || password.length < 6)
    return res
      .status(400)
      .send("password is required and must be 6 charecter long");
  let userExist = await User.findOne({ email }).exec();
  if (userExist) {
    res.status(400).send("Email is taken");
  }
  // Register user
  const user = new User(req.body);

  try {
    await user.save();
    console.log("User Created", user);
    res.json({ ok: true });
  } catch (error) {
    console.log("User Creation Faild", error);
    res.status(400).send("Error, try again");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email }).exec();
    console.log("USER EXIST =>", user);

    if (!user) {
      res.status(400).send("User with that Email not found!");
    }
    user.comparePassword(password, function (err, match) {
      console.log("Compare PASSWORD =>");

      if (!match || err) return res.status(400).send("Wrong Password");

      // "Genarate Token
      let token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "2d",
      });

      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    });
  } catch (err) {
    console.log("LOGIN ERR =>", err);
    res.status(400).send("Faild to login");
  }
};
