const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "royjiny@gmail.com",
        subject: "WELCOME!",
        text: `Hey ${name}, welcome to the app`
    });
};

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "royjiny@gmail.com",
        subject: "GoodBye!",
        text: `Hey ${name}, we will wait for you...`
    });
};

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
};
