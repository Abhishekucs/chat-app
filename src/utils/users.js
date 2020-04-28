const users = []

const addUser = ({ id, username, room }) => {
    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate
    if(!username || !room) {
        return {
            error: 'username and room is not provided'
        }
    }

    //check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    if(existingUser) {
        return {
            error: 'username already taken'
        }
    }

    //add user to users array
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if(index !== -1){
        const removedUser = users.splice(index, 1)[0]
        return removedUser
    }
}

const getUser = (id) => {
    // const index = users.findIndex((user) => {
    //     return user.id === id
    // })

    // if(index === -1) {
    //     return {
    //         error: 'No user found!'
    //     }
    // }

    // const user = users[index]
    // return user

    return users.find((user) => {
        return user.id === id
    })
}

const getUsersInRoom = (room) =>{
    // const userInRoom = []

    // users.forEach((user) => {
    //     if(user.room === room) {
    //         userInRoom.push(user)
    //     }
    // })

    // return 
    room = room.trim().toLowerCase()
    return users.filter((user) => {
        return user.room === room
    })
}

module.exports = {
    getUser,
    removeUser,
    addUser,
    getUsersInRoom
}