import mongoose from "mongoose";

const LabTechSchema = new mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    number: { type: Number },
    password: { type: String, required: true }
});

export default mongoose.model("LabTech", LabTechSchema);