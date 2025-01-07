import { Router } from "express"
import { body, param } from "express-validator"
import { ProjectController } from "../controllers/ProjectController"
import { handleInputErrors } from "../middleware/validation"
import { TaskController } from "../controllers/TaskController"
import { projectExists } from "../middleware/project"
import { hasAuthorization, taskBelongsToProject, taskExist } from "../middleware/task"
import { authenticate } from "../middleware/auth"
import { TeamMemberController } from "../controllers/TeamController"
import { NoteController } from "../controllers/NoteController"

const router = Router()

//Autenticar Usuario
router.use(authenticate)

//Middleware
router.param("projectId", projectExists)

//POST - Create Project
router.post("/",
    body("projectName").notEmpty().withMessage("El nombre del Proyecto es obligatorio"),    
    body("clientName").notEmpty().withMessage("El nombre del cliente es obligatorio"),    
    body("description").notEmpty().withMessage("la descripcion del proyecto es obligatoria"),
    handleInputErrors,
    ProjectController.createProject
)

//GET - Get Projects
router.get("/",ProjectController.getAllProjects)

//GET - Get project by id
router.get("/:projectId", 
    param("projectId").isMongoId().withMessage("ID no valido"),
    handleInputErrors,
    ProjectController.getProjectById
)

//PUT - Update Project
router.put("/:projectId",
    param("projectId").isMongoId().withMessage("ID no valido"),
    body("projectName").notEmpty().withMessage("El nombre del Proyecto es obligatorio"),    
    body("clientName").notEmpty().withMessage("El nombre del cliente es obligatorio"),    
    body("description").notEmpty().withMessage("la descripcion del proyecto es obligatoria"),
    handleInputErrors,
    ProjectController.updateProject
)

//DELETE - Delete a project
router.delete("/:projectId", 
    param("projectId").isMongoId().withMessage("ID no valido"),
    handleInputErrors,
    ProjectController.deleteProject
)

/**Routes for task */
//Middleware
router.param("taskId", taskExist)
router.param("taskId", taskBelongsToProject)

//POST - Create Task
router.post("/:projectId/task",
    hasAuthorization,
    body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"),    
    body("description").notEmpty().withMessage("La descripcion de la tarea es obligatoria"),
    handleInputErrors,  
    TaskController.createTask
)

//GET - Get all tasks from a project
router.get("/:projectId/task",
    TaskController.getProjectTasks
)

//GET - Get a task by id
router.get("/:projectId/task/:taskId",
    param("taskId").isMongoId().withMessage("ID no valido"),
    handleInputErrors,
    TaskController.getTaskById
)

//PUT - Update a task
router.put("/:projectId/task/:taskId",
    hasAuthorization,
    param("taskId").isMongoId().withMessage("ID no valido"),
    body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"),    
    body("description").notEmpty().withMessage("La descripcion de la tarea es obligatoria"),
    handleInputErrors,
    TaskController.updateTask
)

//DELETE - Delete a task
router.delete("/:projectId/task/:taskId",
    hasAuthorization,
    param("taskId").isMongoId().withMessage("ID no valido"),
    handleInputErrors,
    TaskController.deleteTask
)

//Post - Change Status Task
router.post("/:projectId/task/:taskId/status",
    param("taskId").isMongoId().withMessage("ID no valido"),
    body("status").notEmpty().withMessage("El estado es obligatorio"),
    handleInputErrors,
    TaskController.updateTaskStatus
)

/**Router for teams */

router.get("/:projectId/team",
    TeamMemberController.getProjectTeam
)

router.post("/:projectId/team/find",
    body("email")
        .isEmail().toLowerCase().withMessage("Email no valido"),
    handleInputErrors,
    TeamMemberController.findMemberById
)

router.post("/:projectId/team",
    body("id").isMongoId().withMessage("Id no valido"),
    handleInputErrors,
    TeamMemberController.addMemberById
)

router.delete("/:projectId/team/:userId",
    param("userId").isMongoId().withMessage("Id no valido"),
    handleInputErrors,
    TeamMemberController.removeMemberById
)

/** Routes for Notes */
router.post("/:projectId/tasks/:taskId/notes",
    body("content")
        .notEmpty().withMessage("El contenido de la nota es obligatorio"),
    handleInputErrors,
    NoteController.createNote
)

router.get("/:projectId/tasks/:taskId/notes",
    NoteController.getTaskNotes
)

export default router