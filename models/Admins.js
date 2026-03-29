import mongoose from 'mongoose'

// Mongoose schema defines the structure of documents in MongoDB
const adminSchema = new mongoose.Schema({

    // Required admin first name
    fname: { 
        type: String, 
        required: true 
    },

    // Required admin last name
    lname: { 
        type: String, 
        required: true 
    },

    // Role field with default value
    // Even if not provided, it will always be set to "Administrator"
    status: { 
        type: String, 
        required: true, 
        default: "Administrator"
    },

    // Stores hashed password (should NEVER store plain text)
    password: { 
        type: String, 
        required: true 
    }
});

// Creates "Admin" collection in MongoDB (lowercased to "admins")
export default mongoose.model("Admin", adminSchema);