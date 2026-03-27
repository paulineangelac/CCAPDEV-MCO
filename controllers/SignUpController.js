import User from "../models/User.js";
import bcrypt from 'bcryptjs';

const SignUpController = {
    signUp: async (req, res) => {
        try {
            const { fname, lname, email, username, password, confirmPassword } = req.body;

            //checks if username is a valid id number (8 digits)
            
            if(username < 10000000 || username > 99999999){
                return res.send(
                `<script>
                    alert('Enter a Valid DLSU ID Number. Please try again.');
                    window.history.back(); 
                </script>`)
            } // ex: 12411299
            //check if password matches
            if (password !== confirmPassword) {
                return res.send(`
                <script>
                    alert('Passwords do not match! Please try again.');
                    window.history.back(); 
                </script>
            `);
            }

            const salting = 10;
            const hashedPassword = await bcrypt.hash(password, salting);

            const newUser = new User({
                fname,
                lname,
                email,
                username,
                password: hashedPassword
            });

            const result = await newUser.save();

            return res.redirect('/login');

        } catch (error) {
            console.log("MongoDB Error:", error.message);
        }
    }
};

export default SignUpController;