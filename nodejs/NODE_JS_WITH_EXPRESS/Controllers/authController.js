const jwt= require('jsonwebtoken')
const CustomError = require('./../Utils/CustomError');
const User = require('./../Model/userModel');
const asyncErrorHandler = require('./../Utils/AsyncErrorHandler');
const util = require('util');
const sendEmail = require('./../Utils/email');
const crypto = require('crypto');

const signToken = id => {
    console.log("arrived1", id)

    return jwt.sign({id}, process.env.SECRET_STR, {
        expiresIn: process.env.LOGIN_EXPIRES
    })
}

const createSendResponse = (user, statusCode, res) => {
    const token = signToken(user._id);

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}

exports.signup = asyncErrorHandler(async (req, res, next) => {
    const user = await User.create(req.body);

    createSendResponse(user, 201, res);
})

exports.login = asyncErrorHandler(async (req, res, next) => {
    const {email, password} = req.body;

    if (!email || !password){
        const error = new CustomError('Please provide an email ID & password login in!', 400);
        return next(error);
    }

    // check if the user exist with a given email
    const user = await User.findOne({email}).select('+password');

    // Check if the user exist and the password matches 
    console.log("arrived");
    if (!user && !(await user.comparePasswordInDB(password, user.password))){
        const error = new CustomError('Incorrect email or password', 400);
        next(error);
    }
    
    createSendResponse(user, 200, res);
})

exports.protected = asyncErrorHandler(async (req, res, next) => {
    // 1. Read the token & check if it exist
    // console.log('Testing');
    const testToken = req.headers.authorization;
    let token;
    if (testToken && testToken.startsWith('Bearer')){
        token = testToken.split(' ')[1];
    }
    // console.log(token);
    if (!token){
        next(new CustomError('You are not logged in!'), 401);
    }
    // 2.validate the token
    const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR);
    // 3. if the user exists.
    const user = await User.findById(decodedToken.id);

    if (!user){
        const error = new CustomError('The user with the given token does not exist', 401);
        next(error);
    }

    // 4. if the user changed password after the token was issued
    const isPasswordChanged = await user.isPasswordChanged(decodedToken.iat)
    if (isPasswordChanged){
        const error = new CustomError('The password has been changed. Please  login again', 401)
    }
    
    // 5. Allow user to access route
    req.user = user
    next();
})

// Only one role
exports.restrict = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role)
        {
            const error = new CustomError('you do not have permission to perform this action', 403);
            next(error);
        }
        next();
    }
}

// Multiple roles
// exports.restrict = (...roles) => {
//     return (req, res, next) => {
//         if (!roles.includes(req.user.role))
//         {
//             const error = new CustomError('You do not access to this route', 403 );
//             next(error);
//         }
//         next();
//     }
// }


exports.forgotPassword = asyncErrorHandler( async (req, res, next) => {
    // 1. GET USER BASED ON POSTED EMAIL
    const user = await User.findOne({email: req.body.email});

    console.log("Arrived Here!!!");
    if (!user){
        const error = new CustomError('We could not found the user with given email', 404);
        next(error);
    }

    // GENERATE A RANDOM RESET TOKEN
    const resetToken = user.createResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // 3.SEND THE TOKEN BACK TO THE USER EMAIL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `We have received a password reset request. Please use the below link to reset the password\n\n${resetUrl}\n\nThis reset password link will be valid only for 10 minutes`;
    
    try {
        await sendEmail({
            email: user.email,
            subject: 'Password change request received',
            message: message
        });

        res.status(200).json({
            status: 'success',
            message: message
        })
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;
        user.save({validateBeforeSave: false});
        return next(new CustomError('There was an error sending password reset email. Please try again later', 500))
    }
    next();
})

exports.resetPassword = asyncErrorHandler( async (req, res, next) => {
    // IF THE USER EXISTS WITH THE GIVEN TOKEN & TOKEN HAS NOT EXPIRED
    const token = crypto.createHash('sha256').update(req.parameter.token).digest('hex');
    const user = await User.findOne({passwordResetToken: token, passwordResetTokenExpires: {$gt: Date.now()}});

    if (!user){
        const error = new CustomError('Token is invalid or has expired', 400);
        next(error);
    }

    // RESETTING THE USER PASSWORD 
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.passwordChangedAt = Date.now();

    user.save();

    // LOGIN THE USER
    createSendResponse(user, 200, res);
})

exports.updatePassword = asyncErrorHandler(async (req, res, next) => {
    // GET CURRENT USER DATA FROM THE DATABASE
    const user = await User.findById(req.user._id).select('+password');

    // CHECK IF SUPPLIED CURRENT PASSWORD IS CURRECT
    if (!(await user.comparePasswordInDB(req.body.currentPassword, user.password))){
        return next(new CustomError('The current password you provided is wrong', 401))
    }
    
    // IF SUPPLIED PASSWORD IS CORRECT, UPDATE USER PASSWORD WITH NEW VALUE
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();

    // LOGIN USER & SEND JWT
    createSendResponse(user, 200, res);
})
