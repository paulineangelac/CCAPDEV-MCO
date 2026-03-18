import LabTech from "../models/LabTech.js";
import bcrypt from "bcryptjs";

export const getAllLabTechs = async (req, res) => {
    try {
        const labTechs = await LabTech.find().lean();
        res.json(labTechs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createLabTech = async (req, res) => {
    try {
        const { firstName, lastName, email, contactNumber, password} = req.body;

        if (!firstName || !lastName || !email || !password || !assignedLab) {
            return res.status(400).json({ error: "Please fill in all required fields." });
        }

        const existing = await LabTech.findOne({ email });
        if (existing) return res.status(400).json({ error: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newLabTech = new LabTech({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            assignedLab
        });

        await newLabTech.save();
        res.status(201).json({ message: "Lab technician created successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};