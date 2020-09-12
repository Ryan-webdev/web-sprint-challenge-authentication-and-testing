const db = require("../database/dbConfig")
const bcrypt = require("bcryptjs")


const add = async (user) => {
    user.password = await bcrypt.hash(user.password, 14);
    const [id] = await db("users").insert(user);

    return findById(id);
}

const find = () => {
    return db("users")
        .select("id", "username")
}

const findBy = (filter) => {
    return db("users")
        .select("id", "username", "password")
        .where(filter)
}

const findById = (id) => {
    return db("users")
        .select("id", "username", "password")
        .where({ id })
        .first()
}

module.exports = {
    add,
    find,
    findBy,
    findById
}