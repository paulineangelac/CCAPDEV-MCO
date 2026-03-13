import mongoose from 'mongoose';
const roomSchema = new mongoose.Schema({
    roomNumber:{type: String},
    roomCode: {type: String},
    isAvailable:{type: Boolean, default: true},
    seatNumbers:[{
        number: String,
        slots:[{
            time: String
        }]
    }]
});
export default mongoose.model('Room', roomSchema);