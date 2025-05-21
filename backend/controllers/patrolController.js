import Patrol from "../models/PatrolModel.js";
import fs from "fs";

import path from "path";
import transporter from "../config/emailConfig.js";

// Helper function to process uploaded files
const processFiles = (files) => {
  if (!files || files.length === 0) return [];
  return files.map((file) => `/uploads/${file.filename}`);
};

export const getAllPatrols = async (req, res) => {
  try {
    const patrols = await Patrol.find().sort({ createdAt: -1 });
    res.json(patrols);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPatrolById = async (req, res) => {
  try {
    const patrol = await Patrol.findById(req.params.id);
    if (!patrol) return res.status(404).json({ message: "Patrol not found" });
    res.json(patrol);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createPatrol = async (req, res) => {
  console.log(req.body);
  console.log("files" + req.body.files);
  const data = JSON.parse(req.body.data);
  const files = req.files;
  try {
    // Parse participants if it's a string
    const participants =
      typeof data.participants === "string"
        ? JSON.parse(data.participants)
        : data.participants;

    const patrolData = {
      ...data,
      participants, // Use the parsed participants
      photosBefore: processFiles(files?.photosBefore),
      photosAfter: processFiles(files?.photosAfter),
      progress: parseInt(data.progress),
      dueDate: new Date(data.dueDate),
    };

    const newPatrol = await Patrol.create(patrolData);
    const mailOptions = {
      from: "<no-reply@example.com>", // Sender address
      to: patrolData.personInCharge, // Recipient email
      subject: "non confirmité", // Email subject
      text: "plz check the patrols ", // Plain text body
    };
    await transporter.sendMail(mailOptions);
    res.status(201).json(newPatrol);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updatePatrol = async (req, res) => {
  try {
    const { params, files } = req;
    console.log(JSON.parse(req.body.data).progress);
    // Vérifie si req.body est une string, sinon c'est déjà un objet
    const parsedBody = JSON.parse(req.body.data);
    console.log(parsedBody.progress);
    const participants =
      typeof parsedBody.participants === "string"
        ? JSON.parse(parsedBody.participants)
        : parsedBody.participants;

    // Get existing patrol
    const existingPatrol = await Patrol.findById(params.id);
    if (!existingPatrol)
      return res.status(404).json({ message: "Patrol not found" });

    // Prepare update data
    let updateData;
    if (files.length > 0) {
      updateData = {
        ...parsedBody,
        participants,
        progress: parseInt(parsedBody.progress),
        dueDate: new Date(parsedBody.dueDate),
        photosAfter: processFiles(files?.photosAfter),
      };
    } else {
      updateData = {
        ...parsedBody,
        participants,
        progress: parseInt(parsedBody.progress),
        dueDate: new Date(parsedBody.dueDate),
      };
    }

    const updatedPatrol = await Patrol.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    );
    res.json(updatedPatrol);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updatePatrolStatus = async (req, res) => {
  await Patrol.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "status updated succefelyy" });
};

export const deletePatrol = async (req, res) => {
  try {
    const patrol = await Patrol.findByIdAndDelete(req.params.id);
    if (!patrol) return res.status(404).json({ message: "Patrol not found" });

    // Delete associated files
    patrol.photosBefore.concat(patrol.photosAfter).forEach((file) => {
      fs.unlinkSync(path.join(__dirname, "../public", file));
    });

    res.json({ message: "Patrol deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
