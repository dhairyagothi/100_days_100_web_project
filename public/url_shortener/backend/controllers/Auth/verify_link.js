const bcrypt = require('bcrypt')
const Links_data = require('../../models/LinksData')
const ClicksLogs = require('../../models/CicksLogs')
const { AppError } = require('../../middlewares/errorHandler')



exports.verified_password = async (req, res) => {
    const { password } = req.body;
    const { shortcode } = req.params;



    const link = await Links_data.findOne({ randomId: shortcode });
    if (!link) {
        throw new AppError("Link not found", 404);
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
        throw new AppError("Password dont not match , TRY again ", 401)

    }

}
