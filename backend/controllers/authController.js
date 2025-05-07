import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const register = async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.body.email });
    if (user) {
      res.json({ error: "email déja utilisé !" });
    } else {
      const userData = {
        ...req.body,
        image: req.file ? req.file.path : null,
      };
      if (userData.image == null) {
        delete userData.image;
      }
      let newUser = new userModel(userData);
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          res.json({ error: err });
        }
        bcrypt.hash(req.body.password, salt, async (err, hashedPassword) => {
          if (err) {
            res.json({ error: err });
          }
          newUser.password = hashedPassword;
          await newUser.save();
          res.json({ msg: "compte cree avec succes ! ", user: newUser });
        });
      });
    }
  } catch (err) {
    res.json({ error: err });
  }
};

export const login = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({ error: "Email n'existe pas !" });
    }

    if (user.account_status === "pending") {
      return res
        .status(403)
        .json({ error: "Votre compte n'est pas encore activé." });
    }

    if (user.account_status === "rejected") {
      return res.status(403).json({ error: "Votre compte est suspendu !" });
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordMatch) {
      return res.status(400).json({ error: "Mot de passe incorrect !" });
    }

    const payload = {
      _id: user._id,
      email: user.email,
    };

    const token = jwt.sign(payload, "ter-515-420-AAA-basma-tunis-2278", {
      expiresIn: "7d",
    });

    return res.json({ msg: "Bienvenue", user, token });
  } catch (err) {
    console.error("Login error:", err);
    return res
      .status(500)
      .json({ error: "Erreur serveur lors de la connexion." });
  }
};
export const updateProfile = async (req, res) => {
  let id = req.params.id;
  console.log(id);
  try {
    const userData = {
      ...req.body,
      image: req.file ? req.file.path : null,
    };
    if (userData.image == null) {
      delete userData.image;
    }
    if (userData.password) {
      let hashedPassword = null;
      hashedPassword = await bcrypt.hash(userData.password, 10);
      await userModel.findOneAndUpdate(
        { _id: id },
        { ...userData, password: hashedPassword }
      );
      let result = await userModel.findOne({ _id: id });
      res.json(result);
    } else {
      await userModel.findOneAndUpdate({ _id: id }, userData);
      let result = await userModel.findOne({ _id: id });
      res.json(result);
    }
  } catch (error) {
    res.json({ error: error });
  }
};
