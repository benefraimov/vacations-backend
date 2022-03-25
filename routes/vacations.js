import express from 'express'
import {
    getVacations,
    getVacation,
    createVacation,
    editVacation,
    deleteVacation,
    addFollowerToVacation,
    deleteUserFromOneVacation
} from '../BLL/vacationsBLL.js'
const router = express.Router()

// Get all vacations
router.get(('/'), async (req, res) => {
    try {
        const vacations = await getVacations()
        return res.send(vacations)
    } catch (error) {
        return res.send(`Error: ${error}`)
    }
})

// Get vacation by ID
router.get(('/:id'), async (req, res) => {
    try {
        const vacation = await getVacation(req.params.id)
        return res.send(vacation)
    } catch (error) {
        return res.send(`Error: ${error}`)
    }
})

// Create new vacation
router.post('/', async (req, res) => {
    try {
        const data = await createVacation(req.body)
        res.send(data)
    } catch (error) {
        res.send(error)
    }
})

// edit an existing vacation by ID
router.put('/:id', async (req, res) => {
    try {
        const data = await editVacation(req.body, req.params.id)
        res.send({ data, status: 201 })
    } catch (error) {
        res.send(error)
    }
})

// add new follower
router.put('/explore/:id', async (req, res) => {
    try {
        const data = await addFollowerToVacation(req.body._id, req.params.id)
        res.send(data)
    } catch (error) {
        res.send(error)
    }
})

// delete follower from vacation
router.put('/unfollow/:id', async (req, res) => {
    try {
        const resp = await deleteUserFromOneVacation(req.body._id, req.params.id)
        res.send(resp)
    } catch (error) {
        res.send(error)
    }
})

// delete vacation by ID
router.delete('/:id', async (req, res) => {
    try {
        const data = await deleteVacation(req.params.id)
        res.send(data)
    } catch (error) {
        res.send(error)
    }
})

export default router