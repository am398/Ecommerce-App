import mongoose, { Mongoose } from "mongoose";
import validator from "validator";
const { Schema } = mongoose;
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Enter Your Name"],
            maxLength: [30, "Can not Exceed 30 Characters"],
            minLength: [4, "Should be atleast 4 characters long"]
        },
        email:
        {
            type: String,
            required: [true, "Enter Your Email"],
            unique: [true, "Email already Exists"],
            validate: [validator.isEmail, "Enter Your Correct Email"]
        },
        password: {
            type: String,
            required: [true, "Enter Your Password"],
            minLength: [4, "Should be atleast 4 characters long"],
            select: false
        },
        avatar:
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        },
        role:
        {
            type: String,
            default: "User"
        },

        resetPasswordToken: String,
        resetPasswordExpire: Date
    });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});
// JWT TOKEN
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Compare Password

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
    // Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};

export default mongoose.model("User", userSchema);