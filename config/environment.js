const fs = require("fs");
const rfs = require("rotating-file-stream");
const path = require("path");

const logDirectory = path.join(__dirname, "../production_logs");
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// using rfs.createStream instead of rfs. Update in the rfs library.
const accessLogStream = rfs.createStream("access.log",{
    interval: '1d',
    path: logDirectory,
})

const development = {
    name: "development",
    asset_path: "/assets",
    session_cookie_key: "blasomething",
    db: "codeial_development",
    smtp: {
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: "xerobhau@gmail.com",
            pass: "zjzhbzwnlbgmvefu", // app passwords from 2 step authentication at google security.
        },
    },
    google_client_id: "1026427801708-qg207fqh2n75v17sargrb1rt6hdbihag.apps.googleusercontent.com",
    google_client_secret: "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",
    google_call_back_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: "codeial",
    morgan: {
        mode: "dev",
        options: {stream: accessLogStream}
    }
}
const production = {
    name: "production",
    asset_path: process.env.CODEIAL_ASSET_PATH,
    session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
    db: process.env.CODEIAL_DB,
    smtp: {
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.CODEIAL_GMAIL_USERNAME,
            pass: process.env.CODEIAL_GMAIL_PASSWORD, // app passwords from 2 step authentication at google security.
        },
    },
    google_client_id: process.env.CODEIAL_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
    google_call_back_url: process.env.CODEIAL_GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.CODEIAL_JWT_SECRET,
    morgan: {
        mode: "combined",
        options: {stream: accessLogStream}
    }
}


// module.exports = development;   
module.exports = eval(process.env.CODEIAL_ENVIRONMENT == undefined ? development : eval(process.env.CODEIAL_ENVIRONMENT));