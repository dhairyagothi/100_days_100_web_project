const { nanoid } = require("nanoid");
const bcrypt = require('bcrypt');
const LinksData = require('../models/LinksData');
const QRCode = require('qrcode');
const { AppError } = require('../middlewares/errorHandler');

exports.Response_POST_API = async (req, res) => {

    const { originalURL, Password, expiryDate, customName } = req.body;

    const BASE_URL = process.env.SERVER_URL || "http://localhost:5000";

    if (!originalURL) {
        throw new AppError("Enter URL first", 400);
    }

    let Shortcode;

    if (customName) {
        // Validate customName format (alphanumeric, dash, underscore)
        const customNameRegex = /^[a-zA-Z0-9-_]+$/;
        if (!customNameRegex.test(customName)) {
            throw new AppError("Custom name can only contain letters, numbers, dashes, and underscores", 400);
        }
        if (customName.length > 50) {
            throw new AppError("Custom name cannot exceed 50 characters", 400);
        }
        
        // Check uniqueness
        const existingName = await LinksData.findOne({ randomId: customName });
        if (existingName) {
            throw new AppError("Custom name already taken. Please choose another.", 400);
        }
        
        Shortcode = customName;
    } else {
        let RegisteredURL = true;
        while (RegisteredURL) {
            Shortcode = nanoid(7);
            RegisteredURL = await LinksData.findOne({ randomId: Shortcode });
        }
    }

    const hashedPassword = Password ? await bcrypt.hash(Password, 10) : null;

    await LinksData.create({
        usedBy: req.user._id,
        originalLink: originalURL,
        randomId: Shortcode,
        password: hashedPassword,
        ExpiryDate: expiryDate ? new Date(expiryDate) : null,
        status: "ACTIVE"
    });

    const shortUrl = `${BASE_URL}/${Shortcode}`;

    const qrcode = await QRCode.toDataURL(shortUrl);

    res.status(201).json({
        ShortURL: shortUrl,
        qrcode: qrcode
    });
};
