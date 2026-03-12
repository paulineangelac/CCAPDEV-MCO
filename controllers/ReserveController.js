import BookedRooms from '../models/BookedRooms.js'
import User from "../models/User.js";

const ReserveController = {
    reserve: async (req,res)=>{
        try{
            const {roomNumber, seat, date, time, anon} = req.body;
            const username = req.session.user.username;
            const booking = await BookedRooms.findOne({
                roomNumber: roomNumber,
                seat:seat,
                time:time,
                date:date
            });

            if(booking){
                return res.send(`
                    <script>
                        alert('Seat is already reserved');
                        window.location.href = '/studentdashboard-page';
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
                        window.location.href = '/studentdashboard-page';
                    </script>
                `);
            }
        }catch(error){
            console.log(error);
        }
    }
};

export default ReserveController;