import { Router } from 'express'
import { upload } from '../../MulterConfig.js'
import { RegisterUser } from '../Controllers/Auth/Signup.js'
import { SignIn } from '../Controllers/Auth/SignIn.js'
import { ResetPass } from '../Controllers/Auth/ResetPass.js'
import { Signout } from '../Controllers/Auth/Signout.js'

const AuthRouter = Router()
AuthRouter.post('/RegisterUser', upload.single('Image'), RegisterUser)
AuthRouter.get('/Login', SignIn)
AuthRouter.post('/ResetPassword', ResetPass)
AuthRouter.get('/SIGNOUT', Signout)
export default AuthRouter
