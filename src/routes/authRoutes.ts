import { Router } from "express"
import { AuthController } from "../controllers/AuthController"
import { body } from "express-validator"
import { handleInputErrors } from "../middleware/validation"

const router = Router()

router.post("/create-account", 
    body("name")
        .notEmpty().withMessage("El nombre no puede ir vacio"),
    body("password")
        .notEmpty().withMessage("El password no puede ir vacio").isLength({min: 8}).withMessage("El password debe tener minimo 8 caracteres"),
    body("password_confirmation").custom((value, {req}) => {
       if(value !== req.body.password){
        throw new Error("Los password no son iguales")
       }
       return true
    }),
    body("email")
        .notEmpty().withMessage("El email no puede ir vacio").isEmail().withMessage("Email no valido"),
    handleInputErrors,
    AuthController.createAccount
)

router.post("/confirm-account",
    body("token")
        .notEmpty().withMessage("El token no puede ir vacio"),
    handleInputErrors,
    AuthController.confirmAccount
)

router.post("/login",
    body("email")
        .notEmpty().withMessage("El email no puede ir vacio").isEmail().withMessage("Email no valido"),
    body("password")
        .notEmpty().withMessage("El password no puede ir vacio"),
    handleInputErrors,
    AuthController.login
)

router.post("/request-code",
    body("email")
        .notEmpty().withMessage("El email no puede ir vacio").isEmail().withMessage("Email no valido"),
    handleInputErrors,
    AuthController.requestConfirmationCode
)

export default router