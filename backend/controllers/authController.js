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
    let user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      res.json({ error: "email n'existe pas ! " });
    } else {
      bcrypt.compare(req.body.password, user.password, (err, kifkif) => {
        if (err) {
          res.json({ error: err });
        } else {
          if (kifkif == true) {
            let payload = {
              _id: user._id,
              email: user.email,
            };
            let token = jwt.sign(payload, "ter-515-420-AAA-basma-tunis-2278");
            res.json({ msg: "bienvenue", user: user, token: token });
          } else {
            res.json({ error: "mot de passe incorrecte ! " });
          }
        }
      });
    }
  } catch (err) {
    res.json({ error: err });
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
