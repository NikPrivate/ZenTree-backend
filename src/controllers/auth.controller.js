import { findUserByEmail } from "../models/user.model.js";

export const signup = async (req, res) => {
  try {
    const { firstName, lastName, gender, dateOfBirth, phone, email, password } =
      req.body;

    console.log("Signup attempt for email:", email); // Debug log

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const parsedDOB = new Date(dateOfBirth);
    if (isNaN(parsedDOB)) {
      return res.status(400).json({ message: "Invalid dateOfBirth format" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser({
      firstName,
      lastName,
      gender,
      dateOfBirth: parsedDOB,
      phone,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error("Signup error:", error); // More detailed error log
    console.error("Error stack:", error.stack); // Stack trace
    res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined, // Show error in dev
    });
  }
};
