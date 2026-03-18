import mongoose from "mongoose";

const LabTechSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contactNumber: { type: String },
    password: { type: String, required: true },
    assignedLab: { type: String, required: true },
    status: { type: String, default: "" } // Online / Offline
}, { timestamps: true });

export default mongoose.model("LabTech", LabTechSchema);