import {Router} from "express"
import {   getUser, registerUser,   updateUser } from "../controller/user.controller"
import { loginUser } from "../controller/user.controller"
import { authMiddleware } from "../middleware/route"


const router = Router()


router.post('/register', registerUser)
router.post("/login", loginUser)
 
router.post('/update', updateUser)
router.post('/me',  authMiddleware , getUser)


export default router


