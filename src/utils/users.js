const users = []

const addUser = ({
    id,
    username,
    room
}) => {
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    if (!username || !room) {
        return {
            error: 'username and room are required'
        }
    }

    // check for existing user
    const existingUser = users.find((user) => {
        return user.username === username && user.room === room;
    })

    if (existingUser) {
        return {
            error: 'userName is in use'
        }
    }

    // Store User
    const user = {
        id,
        username,
        room
    }
    users.push(user);
    return {user};
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

const getuser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if (index != -1) {
        return users[index];
    }
}

const getUsersInRoom = (room) => {
    const usersInRoom = users.filter((user) => user.room === room);
    return usersInRoom;
}

module.exports = {
    addUser,
    removeUser,
    getUsersInRoom,
    getuser
}