const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const prisma = require("../../lib/prisma");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
      },
      select: { id: true, name: true, email: true },
    });

    res.status(201).json({ ...user, token: generateToken(user.id) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid user name or password' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ ...userWithoutPassword, token: generateToken(user.id) });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET /api/auth/me
getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = {
  register,
  login,
  getMe,
};