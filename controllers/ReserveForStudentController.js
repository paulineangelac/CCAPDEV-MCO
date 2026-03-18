import BookedRooms from '../models/BookedRooms.js'
import User from "../models/User.js";

const ReserveForStudentController = {
    reserveforstudent: async(req,res)=>{
        try{
            const {username,roomNumber, seat, date,time, anon} = req.body;
            const user = await User.findOne({username:username});
            const booking = await BookedRooms.findOne({
                roomNumber: roomNumber,
                seat: seat,
                time:time,
                date:date,
            });

            if(booking){
                return res.send(`
                    <script>
                        alert('Seat is already reserved');
                        window.location.href = '/labtechdashboard-page';
                    </script>
                `);
            }
            else if(!user){
                return res.send(`
                    <script>
                        alert('Username not Found');
                        window.location.href = '/labtechdashboard-page';
                    </script>
                `);
            }else{
                
                const newRoomBooking = new BookedRooms({
                roomNumber,
                seat,
                time,
                date,
                anon
                });
                const result = await newRoomBooking.save();

                await User.findOneAndUpdate(
                    {username: username},
                    {
                        $push:{
                            reservations:{roomNumber, seat,time,date}
                        }
                    }
                )   
                res.send(`
                    <script>
                        alert('Room successfully reserved!');
                        window.location.href = '/labtechdashboard-page';
                    </script>
                `);
            }
        }catch(error){
            console.log(error);
        }
    }
}

export default ReserveForStudentController;