const express = require("express");
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
const cors = require('cors');
const cron = require('node-cron');
const axios = require('axios');

const allowedOrigins = ['https://aiinfox.com', 'http://localhost:4200','https://aiinfoxtech.com', 'https://aiinfoxtech-livid.vercel.app', 'https://www.aiinfoxtech.com', 'https://www.gajaro.com', 'https://www.gajmailbox.com', 'https://www.ppcopilot.com', 'http://localhost:5173'];
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

// Landing page
app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Aiinfox Backend API</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0e1a; color: #e0e6f0; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
  .container { max-width: 720px; width: 90%; padding: 48px 40px; background: #111827; border-radius: 16px; border: 1px solid #1e293b; box-shadow: 0 4px 24px rgba(0,0,0,0.4); }
  h1 { font-size: 28px; font-weight: 700; margin-bottom: 6px; color: #fff; }
  .subtitle { color: #94a3b8; font-size: 15px; margin-bottom: 32px; }
  .badge { display: inline-block; background: #065f46; color: #6ee7b7; font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 12px; margin-left: 10px; vertical-align: middle; }
  h2 { font-size: 16px; font-weight: 600; color: #cbd5e1; margin: 28px 0 12px; text-transform: uppercase; letter-spacing: 0.5px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
  th, td { text-align: left; padding: 10px 12px; font-size: 14px; }
  th { color: #64748b; font-weight: 500; border-bottom: 1px solid #1e293b; }
  td { color: #cbd5e1; border-bottom: 1px solid #1e293b; }
  .method { font-weight: 700; font-size: 12px; padding: 2px 8px; border-radius: 4px; }
  .post { background: #1e3a5f; color: #60a5fa; }
  .get { background: #14532d; color: #86efac; }
  .delete { background: #7f1d1d; color: #fca5a5; }
  code { background: #1e293b; padding: 2px 6px; border-radius: 4px; font-size: 13px; color: #e2e8f0; }
  .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #1e293b; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
  .footer a { color: #60a5fa; text-decoration: none; font-size: 14px; }
  .footer a:hover { text-decoration: underline; }
  .footer span { color: #475569; font-size: 13px; }
</style>
</head>
<body>
<div class="container">
  <h1>Aiinfox Backend API <span class="badge">Online</span></h1>
  <p class="subtitle">Email delivery and Omnisend CRM integration service for aiinfox.com</p>

  <h2>Email</h2>
  <table>
    <tr><th>Method</th><th>Endpoint</th><th>Purpose</th></tr>
    <tr><td><span class="method post">POST</span></td><td><code>/v1/send-email</code></td><td>Send contact form email</td></tr>
  </table>

  <h2>Omnisend Contacts</h2>
  <table>
    <tr><th>Method</th><th>Endpoint</th><th>Purpose</th></tr>
    <tr><td><span class="method post">POST</span></td><td><code>/v1/omnisend/contacts</code></td><td>Create or update contact</td></tr>
    <tr><td><span class="method get">GET</span></td><td><code>/v1/omnisend/contacts?email=</code></td><td>Look up contact</td></tr>
  </table>

  <h2>Omnisend Events</h2>
  <table>
    <tr><th>Method</th><th>Endpoint</th><th>Purpose</th></tr>
    <tr><td><span class="method post">POST</span></td><td><code>/v1/omnisend/events</code></td><td>Track custom event</td></tr>
  </table>

  <h2>Omnisend Products</h2>
  <table>
    <tr><th>Method</th><th>Endpoint</th><th>Purpose</th></tr>
    <tr><td><span class="method post">POST</span></td><td><code>/v1/omnisend/products</code></td><td>Sync product</td></tr>
    <tr><td><span class="method get">GET</span></td><td><code>/v1/omnisend/products</code></td><td>List products</td></tr>
    <tr><td><span class="method get">GET</span></td><td><code>/v1/omnisend/products/:id</code></td><td>Get product</td></tr>
    <tr><td><span class="method delete">DELETE</span></td><td><code>/v1/omnisend/products/:id</code></td><td>Delete product</td></tr>
  </table>

  <h2>Omnisend Categories</h2>
  <table>
    <tr><th>Method</th><th>Endpoint</th><th>Purpose</th></tr>
    <tr><td><span class="method post">POST</span></td><td><code>/v1/omnisend/categories</code></td><td>Create category</td></tr>
    <tr><td><span class="method get">GET</span></td><td><code>/v1/omnisend/categories</code></td><td>List categories</td></tr>
    <tr><td><span class="method delete">DELETE</span></td><td><code>/v1/omnisend/categories/:id</code></td><td>Delete category</td></tr>
  </table>

  <div class="footer">
    <a href="https://aiinfox.com">aiinfox.com</a>
    <span>Aiinfox Backend API v1</span>
  </div>
</div>
</body>
</html>`);
});

app.use('/v1', route);

// Omnisend REST API routes (separate from mailer)
const omnisendRoutes = require('./omnisend.routes');
app.use('/v1/omnisend', omnisendRoutes);

// Origins that require reCAPTCHA verification
const recaptchaOrigins = ['https://aiinfox.com', 'http://localhost:4200'];

async function verifyRecaptcha(token) {
    const secret = process.env.RECAPTCHA_SECRET;
    const response = await axios.post(
        'https://www.google.com/recaptcha/api/siteverify',
        null,
        { params: { secret, response: token } }
    );
    return response.data;
}

route.post('/send-email', async (req, res) => {
    const { recipient, subject, text, recaptchaToken } = req.body;
    const origin = req.get('origin') || '';
    console.log(req.body);

    // Verify reCAPTCHA only for aiinfox.com origins
    if (recaptchaOrigins.includes(origin)) {
        if (!recaptchaToken) {
            return res.status(400).json({ error: 'reCAPTCHA token missing', text: 'Spam verification failed' });
        }
        try {
            const captchaResult = await verifyRecaptcha(recaptchaToken);
            if (!captchaResult.success || captchaResult.score < 0.5) {
                console.log('reCAPTCHA failed:', captchaResult);
                return res.status(403).json({ error: 'reCAPTCHA verification failed', text: 'Spam verification failed' });
            }
            console.log('reCAPTCHA passed, score:', captchaResult.score);
        } catch (err) {
            console.error('reCAPTCHA verification error:', err.message);
            return res.status(500).json({ error: 'reCAPTCHA verification error', text: 'Spam verification failed' });
        }
    }

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