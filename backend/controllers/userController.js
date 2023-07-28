import User from "../models/userModel.js"
import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/jwtToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

const registerUser = async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = User.create(
        {
            name, email, password,
            avatar: {
                public_id: "Public Id",
                url: "My Url"
            }
        }
    ).then((user) => {
        sendToken(user, 201, res);
    })
        .catch((err) => res.status(400).json({ success: false, error: err }));

}

const loginUser = (async (req, res, next) => {
    const { email, password } = req.body;

    // checking if user has given password and email both

    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email & Password", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user, 201, res);

}
);

// Logout User
const logoutUser = async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
};

// Forgot Password
const forgotPassword = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email }).then(async (user) => {
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }
        // Get ResetPassword Token
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        console.log(user);

        const resetPasswordUrl = `${req.protocol}://${req.get(
            "host"
        )}/api/v1/password/reset/${resetToken}`;

        const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

        try {
            await sendEmail({
                email: user.email,
                subject: `Ecommerce Password Recovery`,
                message,
            });

            res.status(200).json({
                success: true,
                url: message,
                message: `Email sent to ${user.email} successfully`,
            });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({ validateBeforeSave: false });

            return next(new ErrorHandler(error.message, 500));
        }
    })
};

// Reset Password
const resetPassword = async (req, res, next) => {

    // creating token hash
    try {
        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        console.log(resetPasswordToken);

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });
        console.log(user);

        if (!user) {
            return next(
                new ErrorHandler(
                    "Reset Password Token is invalid or has been expired",
                    400
                )
            );
        }

        if (req.body.password !== req.body.confirmPassword) {
            return next(new ErrorHandler("Password does not Match", 400));
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        sendToken(user, 200, res);
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};
// Get User Detail
const getUserDetails = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));

    }
};

// update User password
const updatePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("+password");

        const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

        if (!isPasswordMatched) {
            return next(new ErrorHandler("Old password is incorrect", 400));
        }

        if (req.body.newPassword !== req.body.confirmPassword) {
            return next(new ErrorHandler("password does not match", 400));
        }

        user.password = req.body.newPassword;

        await user.save();

        sendToken(user, 200, res);
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));

    }
}

// update User Profile
const updateProfile = async (req, res, next) => {
    try {
        const newUserData = {
            name: req.body.name,
            email: req.body.email,
        };

        if (req.body.avatar !== "") {
            const user = await User.findById(req.user.id);

            const imageId = user.avatar.public_id;

            await cloudinary.v2.uploader.destroy(imageId);

            const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
                folder: "avatars",
                width: 150,
                crop: "scale",
            });

            newUserData.avatar = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }

        const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        res.status(200).json({
            success: true,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));

    }
}

// Get all users(admin)
const getAllUser = async (req, res, next) => {
    try {
        const users = await User.find();

        res.status(200).json({
            success: true,
            users,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));

    }
}

// Get single user (admin)
const getSingleUser = async (req, res, next) => {
    const user = await User.findById(req.params.id).then((user) => {

        if (!user) {
            return next(
                new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
            );
        }

        res.status(200).json({
            success: true,
            user,
        });
    }).catch(error)
    {
        return next(error);
    }
};

// update User Role -- Admin
const updateUserRole = async (req, res, next) => {
    try {
        const newUserData = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
        };

        const user=await User.findByIdAndUpdate(req.params.id, newUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        res.status(200).json({
            success: true,
            user
        });
    }
    catch (error) {
        return next(error);
    }
};

// Delete User --Admin
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(
                new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
            );
        }

        // const imageId = user.avatar.public_id;

        // await cloudinary.v2.uploader.destroy(imageId);

        const deleted=await User.deleteOne({ _id: req.params.id });

        res.status(200).json({
            success: true,
            message: "User Deleted Successfully",
            deleted
        });
    }
    catch (error) {
        return next(error);
    }
};



export {
    registerUser, loginUser, logoutUser, forgotPassword,
    resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getSingleUser, updateUserRole, deleteUser
};