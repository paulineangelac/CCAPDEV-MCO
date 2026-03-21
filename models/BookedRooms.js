import mongoose from 'mongoose';

const bookedRoomSchema = new mongoose.Schema({
    user: Number,
    roomNumber: String,
    seat: String,
    time: String,
    date: String,
    name: String,
    username: Number
});

export default mongoose.model('BookedRooms', bookedRoomSchema);