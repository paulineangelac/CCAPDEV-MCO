import LabTech from "../models/LabTech.js";

const AdminController ={
    makelabtech: async (req,res)=>{
        try{
            const {fname,lname,number,email,password,confirmpass} = req.body;
            const labtech = await LabTech.findOne({
                fname: fname,
                lname: lname
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
            const newLabTech = new LabTech({
                fname,
                lname,
                email,
                number,
                password
            });
            const result = await newLabTech.save();
            return res.redirect('/admindashboard-page');
        }catch(error){
            console.log(error);
        }
    }
}

export default AdminController;