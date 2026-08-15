const mongoose = require("mongoose");
const dns = require("dns");
require("dotenv").config();

try {
    dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {
    console.log("Could not set custom DNS servers:", e.message);
}

function getConnectionString(rawUrl) {
    if (!rawUrl) return rawUrl;
    let url = rawUrl.trim().replace(/["']/g, "");

    // Convert mongodb+srv to direct replica set URI to bypass cloud DNS SRV lookup failures
    if (url.startsWith("mongodb+srv://") && url.includes("cluster-1.7snxm.mongodb.net")) {
        const m = url.match(/^mongodb\+srv:\/\/([^@]+)@cluster-1\.7snxm\.mongodb\.net\/?([^?]*)(\?.*)?$/);
        if (m) {
            const auth = m[1];
            const dbName = m[2] || "StudyNotionDB";
            return `mongodb://${auth}@cluster-1-shard-00-00.7snxm.mongodb.net:27017,cluster-1-shard-00-01.7snxm.mongodb.net:27017,cluster-1-shard-00-02.7snxm.mongodb.net:27017/${dbName}?ssl=true&authSource=admin&retryWrites=true&w=majority`;
        }
    }
    return url;
}

async function connectWithRetry(connStr, retries = 5, delay = 3000) {
    for (let i = 1; i <= retries; i++) {
        try {
            await mongoose.connect(connStr, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 10000,
                connectTimeoutMS: 10000,
            });
            console.log("DB Connected Successfully");
            return;
        } catch (error) {
            console.log(`DB Connection attempt ${i}/${retries} failed: ${error.message}`);
            if (i === retries) {
                console.error("All DB connection attempts failed. Exiting.");
                process.exit(1);
            }
            await new Promise((res) => setTimeout(res, delay));
        }
    }
}

exports.connect = async () => {
    const connStr = getConnectionString(process.env.MONGODB_URL);
    console.log("Connecting to DB...");
    await connectWithRetry(connStr);
};