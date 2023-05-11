const { User } = require("../models/user");
const { HttpError, controllerWrapper, sendEmail } = require("../helpers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { nanoid } = require("nanoid");

const { SECRET_KEY, BASE_URL, MAIL_USER } = process.env;
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    from: MAIL_USER,
    subject: "Verify email",
    html: `<a target="_blank" 
              href="${BASE_URL}/users/verify/${verificationToken}">
                <strong>Verify Your Email</strong>
           </a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    users: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });
  res.json({
    message: "Verification successful",
  });
};

const resendVerifyEmail = async (req, res) => {
  const {email} = req.body;
  const user = await User.findOne({email});

  if (!user) {
    throw HttpError(401, "Email not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  
  const verifyEmail = {
    to: email,
    from: MAIL_USER,
    subject: "Verify email",
    html: `<a target="_blank" 
              href="${BASE_URL}/users/verify/${user.verificationToken}">
                <strong>Verify Your Email</strong>
           </a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Verification email sent"
  })

}

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Email is not verified");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = { id: user._id };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "22h" });

  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      email,
      subscription: user.subscription,
    },
  });
};

const current = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({ email, subscription });
};

const logout = async (req, res) => {
  const { _id: id } = req.user;
  await User.findByIdAndUpdate(id, { token: "" });
  res.status(204).json({ message: "Logout success" });
};

const subscription = async (req, res) => {
  const { _id: id } = req.user;
  const { subscription } = req.body;

  await User.findByIdAndUpdate(id, { subscription });

  res.status(201).json({
    message: "Subscription update",
  });
};

const updateAvatar = async (req, res) => {
  const { _id: id } = req.user;
  const { path: tempUpload, originalname } = req.file;

  const img = await Jimp.read(tempUpload);
  await img.resize(250, 250).writeAsync(tempUpload);

  const filename = `${id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(id, { avatarURL });

  res.json({ avatarURL });
};

module.exports = {
  register: controllerWrapper(register),
  verifyEmail: controllerWrapper(verifyEmail),
  resendVerifyEmail: controllerWrapper(resendVerifyEmail),
  login: controllerWrapper(login),
  current: controllerWrapper(current),
  logout: controllerWrapper(logout),
  subscription: controllerWrapper(subscription),
  updateAvatar: controllerWrapper(updateAvatar),
};
