import Room from '../models/Rooms.js'

const ReserveController = {
    reserve: async (req,res)=>{
        try{
            const {lab, seat, date, time, anon} = req.body;
            
        }catch(error){
            console.log(error);
        }
    }
};