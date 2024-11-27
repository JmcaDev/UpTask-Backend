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
            const projects = await Project.find({})
            res.json(projects)
        } catch (error) {
            res.status(500).json({error: error})
        }
    }

    static getProjectById = async(req: Request, res: Response) => {
        try {
            res.status(200).json(req.project)
        } catch (error) {
            res.status(500).json({error: error})
        }
    }

    static updateProject = async (req: Request, res: Response) => {
        try {

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
        try {
            await req.project.deleteOne()
            res.send("Proyecto Eliminado")

        } catch (error) {
            res.status(500).json({error: error})
        }
    }

}