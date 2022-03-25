import User from '../models/userModel.js'
import AsyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'

// @desc Auth user & get Token
// @route POST /api/users/login
// @access Public
const authUser = AsyncHandler(async (req, res) => {
    try {
        const { username, password } = req.body

        const user = await User.findOne({ username })

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                fullname: user.fullname,
                username: user.username,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            })
        } else {
            res.status(401)
            throw new Error('Invalid email or password')
        }
    } catch (error) {
        res.status(401).send(error.message)
    }
})

const userForMongo = (user) => {
    const userObject = {
        fullname: user.fullname,
        username: user.username,
        password: user.password,
        isAdmin: user.isAdmin ? true : false,

    }
    return userObject
}

// Get All Users
const getUsers = () => {
    return new Promise((resolve, reject) => {
        User.find({}, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

// Get User
const getUser = (user_id) => {
    return new Promise((resolve, reject) => {
        User.findById(user_id, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

// Creating User
const createUser = (user) => {
    return new Promise((resolve, reject) => {
        const userCreate = userForMongo(user)
        User.create(userCreate, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

// Updating User
const editUser = (user, user_id) => {
    return new Promise(async (resolve, reject) => {
        const userCreate = userForMongo(user)
        User.findByIdAndUpdate(user_id, userCreate, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

// Delete User
const deleteUser = (user_id) => {
    return new Promise((resolve, reject) => {
        User.findByIdAndDelete(user_id, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

export { authUser, getUsers, getUser, createUser, editUser, deleteUser }