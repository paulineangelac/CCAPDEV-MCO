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
        const newUser = new User({
            fname,
            lname,
            email,
            username,
            password
        });

        const result = await newUser.save();

        res.send(`
            <script>
                alert('Account created successfully for ${username}!'); 
            </script>
        `);
        
        } catch (error) {
            console.log("MongoDB Error:", error.message);
        }
    }
};

export default SignUpController;