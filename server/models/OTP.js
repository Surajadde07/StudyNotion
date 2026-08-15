const mongoose = require("mongoose");
const OTPSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	otp: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 60 * 5, // Auto-deleted after 5 minutes
	},
});

// OTP email sending temporarily disabled
// Re-enable when SMTP credentials are properly configured on the hosting provider
OTPSchema.pre("save", async function (next) {
	console.log("New OTP document saved to database for:", this.email);
	// if (this.isNew) {
	// 	const mailSender = require("../utils/mailSender");
	// 	const emailTemplate = require("../mail/templates/emailVerificationTemplate");
	// 	try {
	// 		await mailSender(this.email, "Verification Email", emailTemplate(this.otp));
	// 		console.log("OTP email sent successfully");
	// 	} catch (error) {
	// 		console.error("Error sending OTP email:", error.message);
	// 		throw error;
	// 	}
	// }
	next();
});

const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;