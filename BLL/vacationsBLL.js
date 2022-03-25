import Vacation from '../models/vacationModel.js'

const vacationForMongo = (vacation) => {
    const vacationObject = {
        name: vacation.name,
        description: vacation.description,
        price: vacation.price,
        picture: vacation.picture,
        startdate: vacation.startdate,
        enddate: vacation.enddate,
        followers: !vacation.followers && []
    }
    return vacationObject
}

// Get All vacations
const getVacations = () => {
    return new Promise((resolve, reject) => {
        Vacation.find({}, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

// Get vacation
const getVacation = (vacation_id) => {
    return new Promise((resolve, reject) => {
        Vacation.findById(vacation_id, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

// Creating vacation
const createVacation = (vacation) => {
    return new Promise((resolve, reject) => {
        const vacationCreate = vacationForMongo(vacation)
        Vacation.create(vacationCreate, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

// Updating vacation
const editVacation = (vacation, vacation_id) => {
    return new Promise(async (resolve, reject) => {
        // const vacationCreate = vacationForMongo(vacation)
        Vacation.findByIdAndUpdate(vacation_id, vacation, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

// Add follower to a vacation
const addFollowerToVacation = (newFollowerId, vacation_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const vacation = await getVacation(vacation_id)
            vacation.followers.push({ user: newFollowerId })
            Vacation.findByIdAndUpdate(vacation_id, vacation, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}

// User Delted, Delete user from all aubscriptions
const deleteUserFromVacations = (userID) => {
    return new Promise((resolve, reject) => {
        Vacation.updateMany({},
            { $pull: { followers: { user: userID } } }, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            }
        )
    })
}

// Delete user from one subscription
const deleteUserFromOneVacation = (userID, vacationID) => {
    return new Promise((resolve, reject) => {
        Vacation.findByIdAndUpdate(vacationID,
            { $pull: { followers: { user: userID } } }, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            }
        )
    })
}

// Delete vacation
const deleteVacation = (vacation_id) => {
    return new Promise((resolve, reject) => {
        Vacation.findByIdAndDelete(vacation_id, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

export {
    getVacations,
    getVacation,
    createVacation,
    editVacation,
    deleteVacation,
    addFollowerToVacation,
    deleteUserFromVacations,
    deleteUserFromOneVacation
}