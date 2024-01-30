const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");
const authConfig = require("../config/auth.config");
const ErrorHander = require("../utils/errorhander");


const verifyToken = (req, res, next) => {
    const token =
        req.get("Authorization")?.split("Bearer ")[1] ||
        req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({
            message: "no token provided! Access prohibited",
        });
    }

    jwt.verify(token, authConfig.secret, async (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(401).send({
                message: "UnAuthorised !",
            });
        }
        const user = await User.findOne({ _id: decoded.id, userType: "USER" });
        const user1 = await User.findOne({ _id: decoded.id, userType: "USER" });
        if (!user && !user1) {
            return res.status(400).send({
                message: "The USER that this token belongs to does not exist",
            });
        }
        req.user = user || user1;
        next();
    });
};


const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHander(
                    `Role: ${req.user.role} is not allowed to access this resouce `,
                    403
                )
            );
        }

        next();
    };
};
const isAdmin = (req, res, next) => {
    const token =
        req.headers["x-access-token"] ||
        req.get("Authorization")?.split("Bearer ")[1];

    if (!token) {
        return res.status(403).send({
            message: "no token provided! Access prohibited",
        });
    }

    jwt.verify(token, authConfig.secret, async (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "UnAuthorised ! Admin role is required! ",
            });
        }

        const user = await User.findOne({ _id: decoded.id });

        if (!user) {
            return res.status(400).send({
                message: "The admin that this  token belongs to does not exist",
            });
        }
        req.user = user;

        next();
    });
};

module.exports = {
    verifyToken,
    authorizeRoles,
    isAdmin,
};