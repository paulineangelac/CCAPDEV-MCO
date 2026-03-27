import User from "../models/User.js";
import BookedRooms from "../models/BookedRooms.js";

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
            .select("fname lname username email status bio profilePic");

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
        if (!req.session.user) {
            return res.redirect("/login");
        }

        const username = req.query.username;

        const currentUser = await User.findOne({
            username: req.session.user.username
        }).lean();

        const user = await User.findOne({
            username: username
        }).lean();

        if (!user) {
            return res.status(404).send("User not found");
        }

        const bookings = await BookedRooms.find({
            username: user.username
        }).lean();

        res.render("ViewProfilePage", {
            title: `${user.fname}'s Profile`,
            profileUser: user,
            bookings,

            // navbar data for logged-in user
            navProfilePic: currentUser?.profilePic || "/pictures/temp.jpeg",
            fname: currentUser?.fname || "",
            lname: currentUser?.lname || "",
            status: currentUser?.status || ""
        });
    } catch (error) {
        console.error("Error rendering profile page:", error);
        res.status(500).send("server error");
    }
}

export default {
    searchUsers,
    getUserProfile,
    renderProfilePage
};