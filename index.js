const express = require("express");
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
const cors = require('cors');
const cron = require('node-cron');
const axios = require('axios');

const allowedOrigins = ['https://aiinfox.com', 'http://localhost:4200','https://aiinfoxtech.com', 'http://localhost:5173'];
app.use(cors({
    origin: function(origin, callback){
        // allow requests with no origin (like mobile apps or curl requests)
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));
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
    console.log(req.body)
    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: recipient,
        subject: subject,
        text: text,
        html: text, // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ error: error.message, text: 'Error in Sending Email' });
        }
        res.status(200).json({ error: {}, text: 'Email sent: ' + info.response });
    });
});

// cron.schedule('*/1 * * * *', async () => { // Runs every 1 minute
//     try {
//         const response = await axios.get('https://api.fashioncarft.com/public/api/payment-response');
//         console.log('Scheduled Payment Check:', response.data);
//     } catch (error) {
//         console.error('Error fetching payment status:', error.message);
//     }
// });



app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});