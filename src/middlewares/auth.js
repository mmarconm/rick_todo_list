const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth");

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(400).send({ error: "No token provided!" });

    const parts = authHeader.split(" ");

    if (!parts.length === 2)
        return res.status(401).send({ error: "Token Error!" });

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme))
        return res.status(401).send({ error: "Token Malformatted" });

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err)
            return res.status(401).send({ error: "Token Invalid" });

        // incluir o id do usuário para as próximas requisições
        req.userId = decoded.user;

        return next();
    });
};
