import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    fname: {
        type: String, trim: true, required: true
    },
    lname: {
        type: String, trim: true, required: true
    },
    email: {
        type: String, trim: true, required: true
    },
    username: {
        type: Number, trim: true, unique: true, required: true
    },
    password: {
        type: String, trim: true, required: true
    },
    reservations: {
        type: Array, default: []
    },
    status: {
        type: String, enum: ['Student', 'Labtech', 'Admin'], default: "Student"
    },
    bio: {
        type: String, default: "This user has no Bio yet."

    },
    profilePic:{
    type: String,
    default: '/pictures/temp.jpeg'
    }
});
export default mongoose.model('User', userSchema);