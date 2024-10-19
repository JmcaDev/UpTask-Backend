import { Router } from "express"
import { body, param } from "express-validator"
import { ProjectController } from "../controllers/ProjectController"
import { handleInputErrors } from "../middleware/validation"
import { TaskController } from "../controllers/TaskController"

const router = Router()

//POST - Create Project
router.post("/", 
    body("projectName").notEmpty().withMessage("El nombre del Proyecto es obligatorio"),    
    body("clientName").notEmpty().withMessage("El nombre del cliente es obligatorio"),    
    body("description").notEmpty().withMessage("la descripcion del proyecto es obligatoria"),
    handleInputErrors,
    ProjectController.createProject
)

//GET - Get Projects
router.get("/", ProjectController.getAllProjects)

//GET - Get project by id
router.get("/:id", 
    param("id").isMongoId().withMessage("ID no valido"),
    handleInputErrors,
    ProjectController.getProjectById
)

//PUT - Update Project
router.put("/:id",
    param("id").isMongoId().withMessage("ID no valido"),
    body("projectName").notEmpty().withMessage("El nombre del Proyecto es obligatorio"),    
    body("clientName").notEmpty().withMessage("El nombre del cliente es obligatorio"),    
    body("description").notEmpty().withMessage("la descripcion del proyecto es obligatoria"),
    handleInputErrors,
    ProjectController.updateProject
)

//DELETE - Delete a project
router.delete("/:id", 
    param("id").isMongoId().withMessage("ID no valido"),
    handleInputErrors,
    ProjectController.deleteProject
)

//Routes for task
router.post("/:projectId/task",
    TaskController.createTask
)

export default router