import mongoose from 'mongoose';

const bookedRoomSchema = new mongoose.Schema({
    roomNumber: String,
    seat: String,
    time: String,
    date: String,
    name: String,
    username: Number,
    anon: String
});

export default mongoose.model('BookedRooms', bookedRoomSchema);