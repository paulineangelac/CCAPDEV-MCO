import User from "../models/User.js";

async function searchUsers(req, res) {
    try {
        const query = req.query.q;

        if (!query || query.trim() === "") {
            return res.json([]);
        }

        const users = await User.find({
            $or: [
                { fname: { $regex: `^${query}`, $options: "i" } },
                { lname: { $regex: `^${query}`, $options: "i" } }
            ]
        }).select("fname lname username email status bio");

        res.json(users);

    } catch (error) {
        console.error("Error searching user:", error);
        res.status(500).json({ error: "server error" });
    }
}

async function getUserProfile(req, res) {
    try {
        const username = req.query.username;

        if (!username || username.trim() === "") {
            return res.status(400).json({ error: "Username is required" });
        }

        const user = await User.findOne({ username: username })
            .select("fname lname username email status bio");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);

    } catch (error) {
        console.error("Error getting user profile:", error);
        res.status(500).json({ error: "server error" });
    }
}

async function renderProfilePage(req, res) {
    try {
        const username = req.query.username;
        const user = await User.findOne({ username: username }).lean();

        if (!user) {
            return res.status(404).send("User not found");
        }

        // render the hbs file and pass user object as data
        res.render('ViewProfilePage', {
            title: `${user.fname}'s Profile`,
            profileUser: user // passes data to .hbs file
        });
    } catch (error) {
        res.status(500).send("server error");
    }
}

export default {
    searchUsers,
    getUserProfile,
    renderProfilePage
};