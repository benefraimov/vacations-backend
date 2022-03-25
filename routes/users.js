import express from 'express'
import {
    getUsers,
    getUser,
    createUser,
    editUser,
    deleteUser
}
    from '../BLL/usersBLL.js'
import { authUser } from '../BLL/usersBLL.js'
import { deleteUserFromVacations } from '../BLL/vacationsBLL.js'
import { protect, admin } from '../middleware/authMiddleware.js'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'
const router = express.Router()

// Login user with authentication
router.post('/login', authUser)

// @desc Get all users
// @route Get /api/users
// @access Private/Admin
router.get(('/'), async (req, res) => {
    try {
        const users = await getUsers()
        return res.send(users)
    } catch (error) {
        return res.send(`Error: ${error}`)
    }
})

// @desc Get user by ID
// @route GET /api/users/:id
// @access Private/Admin
router.get(('/:id'), protect, admin, async (req, res) => {
    try {
        const user = await getUser(req.params.id)
        return res.send(user)
    } catch (error) {
        return res.send(`Error: ${error.message}`)
    }
})

// @desc Register a new user
// @route POST /api/users
// @access Public
router.post('/', async (req, res) => {
    try {
        const { username } = req.body

        const userExists = await User.findOne({ username })

        if (userExists) {
            res.status(400)
            throw new Error('User already exists')
        }
        const data = await createUser(req.body)
        data.token = generateToken(data._id)
        res.status(201).send(data)
    } catch (error) {
        res.send(error)
    }
})

// @desc Update user 
// @route PUT /api/users/:id
// @access Private/Admin
router.put('/:id', async (req, res) => {
    try {
        const data = await editUser(req.body, req.params.id)
        res.send(data)
    } catch (error) {
        res.send(error)
    }
})

// @desc Delete user
// @route DELETE /api/users/:id
// @access Private/Admin
router.delete('/:id', async (req, res) => {
    try {
        // const user = await deleteUser(req.params.id)
        const response = await deleteUserFromVacations(req.params.id)
        res.send({ response })
    } catch (error) {
        res.send(error)
    }
})

export default router