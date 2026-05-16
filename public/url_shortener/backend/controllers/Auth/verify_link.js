const bcrypt = require('bcrypt')
const Links_data = require('../../models/LinksData')
const ClicksLogs = require('../../models/CicksLogs')



exports.verified_password = async (req, res) => {
    const { password } = req.body;
    const { shortcode } = req.params;



    const link = await Links_data.findOne({ randomId: shortcode });
    if (!link) {
        return res.status(404).json({ msg: "Link not found" });
    }


    const matched = await bcrypt.compare(password, link.password);
    if (matched) {
        link.clicks += 1;
        await link.save();

        await ClicksLogs.create({
            randomID: shortcode,
            ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
            deviceInfo: req.headers['user-agent']
        });


        res.status(200).json({
            success: true,
            redirectUrl: link.originalLink
    })
        return;
    }

    else {
        res.status(404).json({ msg: "Password dont not match , TRY again " })

    }

}