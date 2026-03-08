import User from "../models/User.js";

const SignUpController = {
    signUp: async (req, res) => {
    try {
        const { fname, lname, email, username, password, confirmPassword } = req.body;

        //check if password matches
        if (password !== confirmPassword) {
            return res.send(`
                <script>
                    alert('Passwords do not match! Please try again.');
                    window.history.back(); 
                </script>
            `);
        }

        // 2. Create and Save
        const newUser = new User({
            fname,
            lname,
            email,
            username,
            password
        });

        const result = await newUser.save();
        console.log("User saved to MongoDB with ID:", result._id);

        // 3. Tell the browser what to do next
        res.send(`
            <script>
                alert('Account created successfully for ${username}!');
                window.location.href = '../src/LoginPage.html'; 
            </script>
        `);
        
        } catch (error) {
            console.log("MongoDB Error:", error.message);
            res.status(500).json({ message: error.message });
        }
    }
};

export default SignUpController;