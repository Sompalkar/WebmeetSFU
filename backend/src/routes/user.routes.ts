import {Router} from "express"
import {  registerUser, loginUser, updateUser } from "../controller/user.controller"



const router = Router()


router.post('/register', registerUser)
router.get('/login', loginUser)
router.post('/update', updateUser)


export default router


