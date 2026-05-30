const Links_data = require('../models/LinksData');
const ClicksLogs = require('../models/CicksLogs');

exports.Redirect_window = async (req, res) => {
    const { Shortcode } = req.params;

    const BASE_URL = process.env.CLIENT_URL;

    const link = await Links_data.findOne({ randomId: Shortcode });

    if (!link) {
       return res.redirect(`${BASE_URL}/error?type=notfound`);
    }

    if (link.ExpiryDate && link.ExpiryDate < new Date()) {
       return res.redirect(`${BASE_URL}/error?type=expired`);
    }

    if (link.password) {
        return res.redirect(`${BASE_URL}/verify/${Shortcode}`);
    }

    await Links_data.updateOne(
        { randomId: Shortcode },
        { $inc: { clicks: 1 } }
    );

    await ClicksLogs.create({
        randomID: Shortcode,
        ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        deviceInfo: req.headers['user-agent']
    });

    res.redirect(link.originalLink);
};