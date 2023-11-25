const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
};

const createActivationToken = (email) => {
    return jwt.sign({email}, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn: '5m'})
}

const createAccessToken = (id) => {
    return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1m'})
}

const createRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '5m'})
}

const verify = (req, res, next) => {
    const authHeader = req.headers.Authorization;
    if(authHeader) {
        const Authorization = authHeader.split(" ")[1];
        jwt.verify(Authorization, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err){ 
                res.status(403);
                throw new Error("Token is not valid!");
            };
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json("You are not authenticated!");
    }
}

module.exports = {generateToken, verify, createAccessToken, createActivationToken, createRefreshToken}