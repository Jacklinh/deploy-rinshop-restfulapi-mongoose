import mongoose from "mongoose";
import { TypeResume } from "../types/models";
import { fa } from "@faker-js/faker";

const resumeSchema = new mongoose.Schema<TypeResume>({
    personalInfo: {
        avatar: { type: String, required: false },
        fullName: { type: String, required: false },
        birthday: { type: String, required: false },
        email: { type: String, required: false },
        phone: { type: String, required: false },
        github: { type: String, required: false },
        address: { type: String, required: false },
    },
    education: [{
        institution: { type: String, required: false },
        degree: { type: String, required: false },
        year: { type: String, required: false },
        detail: { type: String, required: false }
    }],
    skills: [{
        name: { type: String, required: false },
        percentage: { type: Number, required: false },
        detail: [{
            value: { type: String, required: false }
        }]
    }],
    experience: [{
        company: { type: String, required: false },
        role: { type: String, required: false },
        duration: { type: String, required: false },
        details: { type: String, required: false }
    }],
    projects: [{
        name: { type: String, required: false },
        description: { type: String, required: false },
        link: { type: String, required: false },
        role: { type: String, required: false }
    }]
}, {
    timestamps: true,
    collection: "resumes"
});

const ResumeModel = mongoose.model<TypeResume>("Resume", resumeSchema);

export default ResumeModel;
