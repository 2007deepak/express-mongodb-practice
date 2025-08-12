import { asyncHndler } from "../utils/async-handler";
const registerUser = asyncHndler(async (requestAnimationFrame,res) => {
    
    //fetch data
    const {email ,username,password,role} = req.body

    //validation
   registraitionValidation(body)
})