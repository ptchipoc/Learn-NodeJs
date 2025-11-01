const mongoose = require('mongoose')
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.
Schema({
    name: {
        type: String,
        required: [true, 'Please enter a name.']
    },
    email: {
        type: String,
        required: [true, 'Please enter an email.'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email.']
    },
    photo: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minLength: 8,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm password'],
        validate: {
            validator: function(val){
                return val == this.password;
            },
            message: 'The password is not the same.'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date
})

userSchema.pre('save', async function(next) {

    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.confirmPassword = undefined;
    next();
})

userSchema.methods.comparePasswordInDB = async function(pswd, pswdDB){
    return await bcrypt.compare(pswd, pswdDB);
}

userSchema.methods.isPasswordChanged = async function(JWTTimestamp){
    if (this.passwordChangedAt){
        const pswdChangedTimesTamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        console.log(this.passwordChangedAt, JWTTimestamp);
    }
    return (false);
}

userSchema.methods.createResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

    console.log(resetToken, this.passwordResetToken);
    return (resetToken);
}

const User = new mongoose.model('User', userSchema);

module.exports = User;