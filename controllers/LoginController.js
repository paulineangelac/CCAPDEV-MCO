
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const LoginController = {
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            const user = await User.findOne({
                username: username,
            });

            if (!user) {
                return res.redirect('/login');
            }

            const passwordMatch = await bcrypt.compare(password, user.password)

            if (!passwordMatch) {
                return res.send(`
                    <script>
                        alert('Incorrect password! Please try again.');
                        window.history.back();
                    </script>
                `);
            } else {
                if (user.status === "admin") {
                    req.session.user = {
                        fname: user.fname,
                        lname: user.lname,
                        status: user.status
                    }
                    return res.redirect('admindashboard-page');
                } else if (user.status === "labtech") {
                    req.session.user = {
                        fname: user.fname,
                        lname: user.lname,
                        status: user.status
                    }
                    return res.redirect('labtechdashboard-page');
                } else {
                    req.session.user = {

                        fname: user.fname,
                        lname: user.lname,
                        email: user.email,
                        username: user.username,
                        reservations: user.reservations,
                        status: user.status
                    }
                    return res.redirect('studentdashboard-page');
                }
            }
        } catch (error) {
            console.log("MongoDB Error:", error.message);
        }
    }
}
export default LoginController;