
import User from '../models/User.js';

const LoginController ={
    login: async(req,res)=>{
        try{
            const {username, password} = req.body;

            const user = await User.findOne({
                username: username,
            });

            if (!user) {
                return res.redirect('/login');
            }
            if(user.password !== password){
                return res.send(`
                    <script>
                        alert('Incorrect password! Please try again.');
                    </script>
                `);
            }
                    req.session.user={
                        
                        fname: user.fname,
                        lname: user.lname,
                        email: user.email,
                        username: user.username,
                        reservations: user.reservations,
                        status: user.status
                    }

            if (user.status === 'Admin') {
                return res.send(`
                    <script>
                        window.location.href = '/AdminDashboardPage';
                    </script>
                `);
            } else if (user.status === 'LabTech') {
                return res.send(`
                    <script>
                        alert('Welcome, ${user.fname}!');
                        window.location.href = '/LabTechDashboardPage';
                    </script>
                `);
            } else {
                return res.send(`
                    <script>
                        alert('Welcome, ${user.fname}!');
                        window.location.href = '/studentdashboard-page';
                    </script>
                `);
            }
        }catch (error) {
            console.log("MongoDB Error:", error.message);
        }
    } 
}

export default LoginController;