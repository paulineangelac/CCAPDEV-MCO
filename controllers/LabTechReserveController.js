import BookedRooms from '../models/BookedRooms.js';
import User from '../models/User.js';

const LabTechReserveController = {
    reserve: async (req, res) => {
        try {
            const { roomNumber, seat, date, time, username } = req.body;
    
            const booking = await BookedRooms.findOne({ roomNumber, seat, time, date });

            if (booking) {
                return res.send(`
                    <script>
                        alert('Seat is already reserved');
                        window.location.href = '/LabTechReservationPage';
                    </script>
                `);
            }

            const newRoomBooking = new BookedRooms({ roomNumber, seat, time, date, username: Number(username) });
            await newRoomBooking.save();

            await User.findOneAndUpdate(
                { username: username },
                { $push: { reservations: { roomNumber, seat, time, date } } }
            );

            res.send(`
                <script>
                    alert('Room successfully reserved!');
                    window.location.href = '/LabTechDashboardPage';
                </script>
            `);

        } catch (error) {
            console.log(error);
        }
    }
};
export default LabTechReserveController;