const router = require('express').Router();
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const Users = require("../users/user-model")

router.post("/register", async (req, res, next) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: "Enter both, username and password!" })
  }

  try {
    const user = await Users.findBy({ username }).first()

    if (user) {
      res.status(409).json({ message: "This username is not available" })
    }
    res.json(await Users.add(req.body))
  }
  catch (err) {
    next(err)
  }
})

router.post('/login', async (req, res, next) => {
  // implement login
  try {
    const { username } = req.body
    const user = await Users.findBy({ username: username }).first()

    console.log(user)
    if (!user) {
      res.status(401).json({ message: "Invalid username" })
    }

    const { password } = req.body
    const validPassword = await bcrypt.compareSync(password, user.password)

    if (!validPassword) {
      res.status(401).json({ message: "Invalid password" })
    }

    const token = {
      userId: user.id,
      username: user.username
    }

    res.json({
      message: `Welcome ${user.username}!`,
      token: jwt.sign(token, process.env.JWT_SECRET),
    });
  }
  catch (err) {
    next(err)
  }
});

module.exports = router;