const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth");

const User = require("../models/User");

function generateToken(params = {}) {
    // Gera o token de autenticação do usuário
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

router.post("/register", async (req, res) => {
    const { email } = req.body;
    try {
        if (await User.findOne({ email }))
            return res
                .status(400)
                .send({ error: "User Already Exists!" });
        const user = await User.create(req.body);

        user.password = undefined;

        return res.send({
            user,
            token: generateToken({ user: user.id }),
        });
    } catch (err) {
        return res.status(400).send({ error: "Registration Failed" });
    }
});

router.post("/authenticate", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    // Valida se o usuário não existe. então retorna o error
    if (!user)
        return res.status(400).send({ error: "User not Found!" });

    // Compara a senha digitada é igual a senha cadastrada do usuário
    if (!(await bcrypt.compare(password, user.password)))
        return res.status(400).send({ error: "Invalid Password" });

    user.password = undefined; // remove o retorno do password

    return res.send({
        user,
        token: generateToken({ user: user.id }),
    });
});

module.exports = (app) => app.use("/auth", router);
