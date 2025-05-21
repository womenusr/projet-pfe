import hotWorkModel from "../models/hotWorkModel.js";
import WorkPermit from "../models/workPermitModel.js";

import nodemailer from "nodemailer";
import fs from "fs";
import transporter from "../config/emailConfig.js";

export const createWorkPermit = async (req, res) => {
  try {
    const exisitingWorkPermits = await WorkPermit.find();
    if (req.body.hotWork) {
      let newHotWork = new hotWorkModel(req.body.hotWork);
      await newHotWork.save();
      const permit = new WorkPermit({
        ...req.body,
        numero: exisitingWorkPermits.length + 1,
        hot_work_id: newHotWork._id,
      });
      await permit.save();
      res.status(201).json(permit);
    } else {
      const permit = new WorkPermit({
        ...req.body,
        numero: exisitingWorkPermits.length + 1,
      });
      await permit.save();
      res.status(201).json(permit);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllWorkPermits = async (req, res) => {
  try {
    const permits = await WorkPermit.find().populate("hot_work_id");
    res.json(permits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getWorkPermitById = async (req, res) => {
  try {
    const permit = await WorkPermit.findById(req.params.id).populate(
      "hot_work_id"
    );
    if (!permit) return res.status(404).json({ message: "Not found" });
    res.json(permit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateWorkPermit = async (req, res) => {
  const { hotWork, ...data } = req.body;

  try {
    if (hotWork) {
      if (hotWork._id) {
        // Update existing HotWork
        const updatedHotWork = await hotWorkModel.findByIdAndUpdate(
          hotWork._id,
          hotWork,
          { new: true }
        );

        if (!updatedHotWork) {
          return res.status(404).json({ message: "HotWork not found" });
        }
      } else {
        // Create new HotWork and link to WorkPermit
        const newHotWork = new hotWorkModel(hotWork);
        await newHotWork.save();
        data.hot_work_id = newHotWork._id;
      }
    }

    const updatedWorkPermit = await WorkPermit.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );

    if (!updatedWorkPermit) {
      return res.status(404).json({ message: "WorkPermit not found" });
    }

    res.json(updatedWorkPermit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteWorkPermit = async (req, res) => {
  try {
    const deleted = await WorkPermit.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const sendEmailWithAttachement = async (req, res) => {
  try {
    const { recipient, subject, message } = req.body;
    const file = req.file; // Multer adds the file here

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const mailOptions = {
      from: "<no-reply@example.com>", // Sender address
      to: recipient, // Recipient email
      subject: subject || "Work Permit Details", // Email subject
      text: message || "Please find attached the work permit details.", // Plain text body
      attachments: [
        {
          filename: file.originalname, // Name of the attachment
          path: file.path,
          contentType: "application/pdf",
        },
      ],
    };

    // Send email
    await transporter.sendMail(mailOptions);
    fs.unlinkSync(file.path);
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
};
