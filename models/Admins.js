import mongoose from 'mongoose'

const adminSchema = new mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    status:{type: String, required: true},
    password
});

export default mongoose.model("LabTech", LabTechSchema);