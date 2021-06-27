import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Name is required",
    },
    email: {
      type: String,
      trim: true,
      required: "Email is required",
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      min: 6,
      max: 10,
    },
    stripe_account_id: "",
    stripe_seller: {},
    stripeSession: {},
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  let user = this;

  if (user.isModified("password")) {
    return bcrypt.hash(user.password, 12, function (err, hash) {
      if (err) {
        console.log("BCRYPT ERROR =>", err);
        return next(err);
      } else {
        user.password = hash;
        return next();
      }
    });
  }
  return next();
});

userSchema.methods.comparePassword = function (password, next) {
  bcrypt.compare(password, this.password, function (err, match) {
    if (err) {
      console.log("Password Match Err ==>", err);
      return next(err, false);
    } else {
      console.log("Password Matches ==>");
      return next(null, match);
    }
  });
};

export default mongoose.model("User", userSchema);
