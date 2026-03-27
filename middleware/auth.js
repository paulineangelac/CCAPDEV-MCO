export const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next(); // if user has a session, user is logged in + allow access to route
    } else {
        return res.redirect('/login'); // not logged in, redirect to login
    }

}