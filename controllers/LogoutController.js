const LogoutController = {
    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.log("Logout error:", err);
                return res.redirect('/');
            }

            res.clearCookie('connect.sid');
            res.redirect('/login');
        });
    }
};

export default LogoutController;


