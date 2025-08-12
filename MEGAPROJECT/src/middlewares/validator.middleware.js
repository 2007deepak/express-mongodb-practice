import { validationResult } from "express-validator"
import { ApiError } from "../utils/api-error.js"
export const validate = (req, res,next) => {

    const errors = validationResult(req)
    if(errors.isEmpty()){
        return next()
    }

    // yadi error empty nhi hai to ise array me store kar denge 
    const extractedError = []
    errors.array().map((err)=> extractedError.push({
       [ err.path]: err.mes
    }))

    throw new ApiError(422, "Recived data is not valid", extractedError);
};