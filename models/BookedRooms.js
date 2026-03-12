import mongoose from 'mongoose';

const bookedRoomSchema = new mongoose.Schema({
    roomCode: String,
    seat: String,
    time: String,
    date: String
});

export default mongoose.model('BookedRooms', bookedRoomSchema);