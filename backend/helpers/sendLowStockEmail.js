import nodemailer from "nodemailer";
import stockModel from "../models/stockModel.js";
import transporter from "../config/emailConfig.js";

const sendLowStockEmail = async (recipientEmail) => {
  try {
    const allStock = await stockModel.find();

    const lowStockItems = allStock.filter((item) => {
      return item.stock_limit !== undefined && item.quantity < item.stock_limit;
    });

    if (lowStockItems.length === 0) {
      console.log("No low stock items found.");
      return;
    }

    let emailBody =
      "⚠️ The following items are below their HSE stock limits:\n\n";
    lowStockItems.forEach((item) => {
      emailBody += `- ${item.product_name}: ${item.quantity} (Limit: ${item.stock_limit})\n`;
    });

    await transporter.sendMail({
      from: "admin@gmail.com",
      to: recipientEmail,
      subject: "⚠️ HSE Low Stock Alert",
      text: emailBody,
    });

    console.log("Low stock email sent.");
  } catch (error) {
    console.error("Error sending low stock alert:", error);
  }
};

export default sendLowStockEmail;
