import mongoose from 'mongoose';
const roomSchema = new mongoose.Schema({
    roomNumber:{type: String},
    seatNumbers:{type: Array},
    isAvailable:{type: Boolean, default: true}
});
export default mongoose.model('Room', roomSchema);