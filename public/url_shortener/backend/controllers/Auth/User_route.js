exports.get_logges_user = (req, res) => {
    res.json({
        fullName: req.user.fullName,
        email: req.user.email,
        userId: req.user._id
    });
}

exports.post_loggout_user = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true, // production me true
        sameSite: "none"
    });

    return res.status(200).json({ msg: "Logged out successfully" });
}