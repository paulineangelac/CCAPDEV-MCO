import BookedRooms from '../models/BookedRooms.js'
import User from "../models/User.js";

const ReserveController = {
    reserve: async (req, res) => {
        try {
            const { roomNumber, seat, date, time, anon } = req.body;
            const username = req.session.user.username;

            const booking = await BookedRooms.findOne({
                roomNumber,
                seat,
                time,
                date
            });

            if (booking) {
                return res.redirect('/reservation-page?error=Seat%20is%20already%20reserved');
            }

            const newRoomBooking = new BookedRooms({
                username,
                roomNumber,
                seat,
                time,
                date,
                anon
            });

            const result = await newRoomBooking.save();
            console.log(result);

            await User.findOneAndUpdate(
                { username: username },
                {
                    $push: {
                        reservations: { username, roomNumber, seat, time, date }
                    }
                }
            );

            if (req.session.user) {
                req.session.user.reservations.push({
                    roomNumber,
                    seat,
                    time,
                    date,
                });
            }

            req.session.save((err) => {
                if (err) console.error("Session save error:", err);

                res.redirect('/studentdashboard-page?success=Room%20successfully%20reserved');
            });

        } catch (error) {
            console.log(error);
            res.redirect('/reservation-page?error=Something%20went%20wrong');
        }
    }
};

export default ReserveController;