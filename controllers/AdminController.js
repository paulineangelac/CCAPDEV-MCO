import LabTech from "../models/LabTech.js";
import User from "../models/User.js";
import bcrypt from 'bcryptjs';
const AdminController ={
    makelabtech: async (req,res)=>{
        try{
            const {username,fname,lname,number,email,password,confirmpass} = req.body;
            const labtech = await User.findOne({
                username:username
            });

            if(labtech){
                res.send(`
                
                    <script>
                        alert('Lab Tech already exists.');
                        window.history.back();
                    </script>
                    `);
            }
            if(password !== confirmpass) res.send(`
                
                <script>
                    alert('Password does not match confirmation.');
                    window.history.back();
                </script>
                `);

                const salting = 10;
                const hashedPassword = await bcrypt.hash(password, salting);
            
            const newLabTech = new User({
                username,
                fname,
                lname,
                email,
                number,
                status: "Labtech",
                password: hashedPassword
            });
            const result = await newLabTech.save();
            return res.redirect('/admindashboard-page');
        }catch(error){
            console.log(error);
        }
    }
}

export default AdminController;