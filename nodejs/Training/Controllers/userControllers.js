const User = require('./../Model/userModel');

exports.createUser = async (req, res) =>
{
    try {
        const user = await User.create(req.body);
        
        res.status(201).json({
            status: 'success',
            data: {
                user
            }
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        })
    }
}

exports.getUsers = async (req, res) =>
{
    try {
        const users = await User.find();

        res.status(200).json(
        {
            status: "success",
            count: users.length,
            data:
            {
                users
            }
        })
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error.message
        })
    }
}

exports.getUser = async (req, res) =>
{
    try {
        const id = req.params.id;
        const user = await User.findById(id);

        res.status(200).json(
        {
            status: "success",
            data:
            {
                user
            }
        })
    } catch (error) {
        res.status(404).json(
        {
            status: "fail",
            message: error.message
        })
    }    
}

exports.updateUser = async (req, res) =>
{
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

        res.status(201).json(
        {
            status: "success",
            data: {
                user
            }
        })
    } catch (error) {
        res.status(401).json({
            status: 'fail',
            message: error.message
        })
    }
}

exports.deleteUser = async (req, res) =>
{
    try {
        await User.findByIdAndDelete(req.params.id);

        res.status(204).json(
        {
            status: "success",
            data: null
        })
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error.message
        })
    }
}