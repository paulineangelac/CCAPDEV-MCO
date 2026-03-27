
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const LoginController = {
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            const user = await User.findOne({
                username: username,
            });

            const rememberMe = req.body.rememberMe === 'on';

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

                const cookieExpire = 3 * 7 * 24 * 60 * 60 * 1000; // 3 weeks

                //const cookieExpire = 60 * 1000; // for testing, 1 min

                if (user.status === "admin") {
                    req.session.user = {
                        fname: user.fname,
                        lname: user.lname,
                        status: user.status
                    };
                    if (rememberMe) {
                        req.session.cookie.maxAge = cookieExpire;
                    } else {
                        req.session.cookie.maxAge = null;
                    }
                    return res.redirect('admindashboard-page');

                } else if (user.status === "labtech") {
                    req.session.user = {
                        fname: user.fname,
                        lname: user.lname,
                        status: user.status
                    };
                    if (rememberMe) {
                        req.session.cookie.maxAge = cookieExpire;
                    } else {
                        req.session.cookie.maxAge = null;
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
                    };
                    if (rememberMe) {
                        req.session.cookie.maxAge = cookieExpire;
                    } else {
                        req.session.cookie.maxAge = null;
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