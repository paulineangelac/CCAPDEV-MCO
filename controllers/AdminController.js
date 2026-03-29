import User from "../models/User.js"; 
// Using the User model instead of LabTech implies a role-based system where the status field distinguishes roles

import bcrypt from 'bcryptjs'; 
// Used to hash passwords before storing in database (security best practice)

const AdminController = {

    // Controller function triggered by POST /makelabtech
    makelabtech: async (req, res) => {
        try {

            // Destructure form inputs sent from frontend
            const { username, fname, lname, number, email, password, confirmpass } = req.body;

            // Check if username already exists in database
            const labtech = await User.findOne({
                username: username
            });

            if (labtech) {
                // Sends inline script instead of rendering page (quick feedback approach)
                return res.send(`
                    <script>
                        alert('Lab Tech already exists.');
                        window.history.back();
                    </script>
                `);
            }

            // Validate password confirmation (basic backend validation)
            if (password !== confirmpass) {
                return res.send(`
                    <script>
                        alert('Password does not match confirmation.');
                        window.history.back();
                    </script>
                `);
            }

            // Salt rounds determine hashing complexity (10 is standard balance)
            const salting = 10;

            // Hash password before saving (never store plain text passwords)
            const hashedPassword = await bcrypt.hash(password, salting);

            // Create new user document
            const newLabTech = new User({
                username,
                fname,
                lname,
                email,
                number,
                status: "Labtech", 
                // Role-based design that distinguishes lab tech from student or admin

                password: hashedPassword
            });

            // Save to MongoDB
            const result = await newLabTech.save();

            // Redirect back to admin dashboard after successful creation
            return res.redirect('/admindashboard-page');

        } catch (error) {
            // Logs error but does not send response which could cause hanging request
            console.log(error);
        }
    }
};

export default AdminController;