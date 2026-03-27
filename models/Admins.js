import mongoose from 'mongoose'

const adminSchema = new mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    status: {type: String, required: true, default: "Administrator"},
    password: {type: String, erquired: true}
});

export default mongoose.model("Admin", adminSchema);