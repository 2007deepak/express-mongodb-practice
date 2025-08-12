import {body} from "express-validator"

const userRegistrationValidator = () => {
    return [
        body('email')
        .trim()
        .notEmpty().withMessage("Email is required")
        .notEmpty().withMessage("Email is invalid"),
        body("username")
        .trim()
        .notEmpty.withMessage("username is required")
        
    ]
}

const userLoginValidator = () => {

    returne [
        body("email").isEmail().withMessage("Email is not valid"),
        body("password").notEmpty().withMessage("Password cannot be empty")
    ];
};

export {userRegistrationValidator , userLoginValidator}