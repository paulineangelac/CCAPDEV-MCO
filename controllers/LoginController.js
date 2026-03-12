
import User from '../models/User.js';

const LoginController ={
    login: async(req,res)=>{
        try{
            const {username, password} = req.body;

            const user = await User.findOne({
                username: username,
            });

            if(!user){
                return res.send(`
                    <script>
                        alert('Username not found! Please try again.');
                    </script>
                `);
            }
            if(user.password !== password){
                return res.send(`
                    <script>
                        alert('Incorrect password! Please try again.');
                    </script>
                `);
            }else{
                if(username === "admin"){
                    return res.redirect('/AdminDashboardPage');
                }else if(username === "labtech"){
                    return res.redirect('/LabTechDashboardPage');
                }else{
                    req.session.user={
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

        }catch (error) {
            console.log("MongoDB Error:", error.message);
        }
    } 
}

export default LoginController;