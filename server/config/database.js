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

    // If using mongodb+srv on cluster-1.7snxm, convert to direct standard replica set URI
    // to prevent cloud host querySrv ECONNREFUSED DNS errors
    if (url.startsWith("mongodb+srv://") && url.includes("cluster-1.7snxm.mongodb.net")) {
        const authAndDbMatch = url.match(/^mongodb\+srv:\/\/([^@]+)@cluster-1\.7snxm\.mongodb\.net\/?([^?]*)(\?.*)?$/);
        if (authAndDbMatch) {
            const auth = authAndDbMatch[1];
            const dbName = authAndDbMatch[2] || "StudyNotionDB";
            return `mongodb://${auth}@cluster-1-shard-00-00.7snxm.mongodb.net:27017,cluster-1-shard-00-01.7snxm.mongodb.net:27017,cluster-1-shard-00-02.7snxm.mongodb.net:27017/${dbName}?ssl=true&authSource=admin&retryWrites=true&w=majority`;
        }
    }
    return url;
}

exports.connect = () => {
    const connStr = getConnectionString(process.env.MONGODB_URL);
    mongoose.connect(connStr, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("DB Connected Successfully"))
    .catch((error) => {
        console.log("DB Connection Failed");
        console.error(error);
        process.exit(1);
    });
};