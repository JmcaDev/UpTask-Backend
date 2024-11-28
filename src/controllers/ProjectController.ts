import type {Request, Response} from "express"
import Project from "../models/Project"

export class ProjectController {

    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body)
        
        //Asignar manager
        project.manager = req.user.id
        try {
            await project.save()
            res.send("Proyecto creado correctamente")
        } catch (error) {
            res.status(500).json({error})
        }
    }

    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({
                $or: [
                    {manager: {$in: req.user.id}}
                ]
            })
            res.json(projects)
        } catch (error) {
            res.status(500).json({error: error})
        }
    }

    static getProjectById = async(req: Request, res: Response) => {
        const { projectId } = req.params
        try {
            const project = await Project.findById(projectId).populate("tasks")
            if(!project){
                const error = new Error("Proyecto no encontrado")
                res.status(404).json({error: error.message})
                return 
            }

            if(project.manager.toString() !== req.user.id.toString()){
                const error = new Error("Accion no valida")
                res.status(403).json({error: error.message})
                return
            }

            res.json(project)
        } catch (error) {
            console.log(error)
        }
    }

    static updateProject = async (req: Request, res: Response) => {

        const { projectId } = req.params 

        try {
            const project = await Project.findById(projectId)
            if(!project){
                const error = new Error("Proyecto no encontrado")
                res.status(404).json({error: error.message})
                return
            }

            if(project.manager.toString() !== req.user.id.toString()){
                const error = new Error("Accion no valida, Solo el manager puede actualizar un proyecto")
                res.status(403).json({error: error.message})
                return
            }

            req.project.projectName = req.body.projectName
            req.project.clientName = req.body.clientName
            req.project.description = req.body.description
            await req.project.save()

            res.send("Proyecto actualizado")
        } catch (error) {
            res.status(500).json({error: error})
        }
    }

    static deleteProject = async(req: Request, res: Response) => {

        const { projectId } = req.params 
        try {
            const project = await Project.findById(projectId)
            if(!project){
                const error = new Error("Proyecto no encontrado")
                res.status(404).json({error: error.message})
                return
            }

            if(project.manager.toString() !== req.user.id.toString()){
                const error = new Error("Accion no valida, Solo el manager puede eliminar un proyecto")
                res.status(403).json({error: error.message})
                return
            }

            await req.project.deleteOne()
            res.send("Proyecto Eliminado")

        } catch (error) {
            res.status(500).json({error: error})
        }
    }

}