
import User from '../models/User.js';
import LabTech from '../models/LabTech.js';
import bcrypt from 'bcryptjs';

const LoginController = {
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            
            const userStudent = await User.findOne({
                username: username,
            });
            const userLab = await LabTech.findOne({
                username:username,
            });

<<<<<<< Updated upstream
            const rememberMe = req.body.rememberMe === 'on';

            if (!user) {
=======

            if(!userStudent && !userLab) {
>>>>>>> Stashed changes
                return res.redirect('/login');
            }
            
            if(userStudent.status === "admin"){
                req.session.user = {
                        fname: userStudent.fname,
                        lname: userStudent.lname,
                        status: userStudent.status
                    }
                return res.redirect('admindashboard-page');
            }
            if(userLab && await bcrypt.compare(password, userLab.password)) {
                    req.session.user = {
                        fname: userLab.fname,
                        lname: userLab.lname,
                        status: userLab.status
                    }
                    return res.redirect('labtechdashboard-page');
                } else {
                    req.session.user = {

                        fname: userStudent.fname,
                        lname: userStudent.lname,
                        email: userStudent.email,
                        username: userStudent.username,
                        reservations: userStudent.reservations,
                        status: userStudent.status
                    }
                    return res.redirect('studentdashboard-page');
                }

            if (!passwordMatch && !passwordMatchLab) {
                return res.send(`
                    <script>
                        alert('Incorrect password! Please try again.');
                        window.history.back();
                    </script>
                `);
            } else {
<<<<<<< Updated upstream

                const cookieExpire = 3 * 7 * 24 * 60 * 60 * 1000; // 3 weeks

                //const cookieExpire = 60 * 1000; // for testing, 1 min

                if (user.status === "admin") {
=======
                if (userAdmin) {
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream

                } else if (user.status === "labtech") {
=======
                } else if (userLab) {
>>>>>>> Stashed changes
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