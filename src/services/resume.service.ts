import createError from 'http-errors';
import { TypeResume } from '../types/models';
import Resume from '../models/resume.model';
import { query } from 'express';

const findAll = async (query: any) => {
    const resumes = await Resume.find().select('-v');
    return {
        resume_list: resumes
    }
}
const findByID = async (id: string) => {
    const resume = await Resume.findById(id).select('-v');
    if(!resume) {
        throw createError(400,'resume not found')
    }
    return resume;
}
const createDocument = async(body: any) => {
    const payloads = {
        personalInfo: {
            avatar: body.avatar,
            fullName: body.fullName,
            birthday: body.birthday,
            email: body.email,
            phone: body.phone,
            github: body.github,
            address: body.address,
        },
        education: [
            {
                institution: body.institution, 
                degree: body.degree, 
                year: body.year, 
                detail: body.detail
            }
        ],
        skills: [
            {
                nameSkill: body.nameSkill,
                percentage: body.percentage,
                detail: [{
                    value: body.value
                }]
            }
        ],
        experience: [
            { 
                company: body.company, 
                role: body.role, 
                duration: body.duration, 
                description: body.description 
            }
        ],
        projects: [
            { 
                nameProject: body.nameProject,
                 description: body.description, 
                 link: body.link, 
                 role: body.role,
                 image: body.image 
            }
        ],
    }
    const resume = await Resume.create(payloads);
    return resume;
}
const updateByID = async (id: string, payload: TypeResume) => {
    const resume = await findByID(id);
    Object.assign(resume,payload)
    await resume.save();
    return resume;
}
const deleteByID = async (id: string) => {
    const resume = await findByID(id);
    await Resume.deleteOne({ _id: resume._id })
    return resume;
}
export default {
    findAll,
    findByID,
    createDocument,
    updateByID,
    deleteByID
}