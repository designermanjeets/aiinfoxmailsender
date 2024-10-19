const express = require("express");
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
const cors = require('cors');

app.use(cors({ origin: 'https://aiinfox.com' })); // allow only aiinfox.com to access the API
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const route = express.Router();
const port = process.env.PORT || 8080;

const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    type: "SMTP",
    host: "smtp.gmail.com",
    secure: true,
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASS
    }
});

app.use('/v1', route);

route.post('/send-email', (req, res) => {
    const { recipient, subject, text } = req.body;
    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: recipient,
        subject: subject,
        text: text,
        html: "<b>Hello world?</b>", // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send('Error sending email: ' + error);
        }
        res.status(200).send('Email sent: ' + info.response);
    });
});



app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});