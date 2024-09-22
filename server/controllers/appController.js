import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ENV from '../config.js';
import otpGenerator from 'otp-generator';

// Schemas
import UserModel from "../model/User.model.js";

// middleware for verify user
export async function verifyUser(req, res, next) {
  try {
    const { username } = req.method == "GET" ? req.query : req.body;
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }
    const exist = await UserModel.findOne({ username });
    if (!exist) {
      return res.status(404).json({ error: "User not found" });
    }
    req.user = exist; // Attach user to request for potential use in next middleware
    next();
  } catch (error) {
    console.error('Error in verifyUser:', error);
    return res.status(500).json({ error: "Authentication Error" });
  }
}

/**POST : http://localhost:8080/api/register
 * @param : {
 * "username": "kol1122",
 * "password": "admin@123",
 * "email": "admin@gmail.com",
 * "firstName": "Kol",
 * "lastName": "Mikealson",
 * "mobile": 9090909091,
 * "address": "37, Burbon Street, New Orleans",
 * profile: ""
 * }
 */
export async function register(req, res) {
  try {
    const { username, password, email, firstName, lastName, mobile, address, profile } = req.body;

    // Validate required fields
    if (!username || !password || !email) {
      return res.status(400).json({ error: "Username, password, and email are required" });
    }

    // Check for existing user
    const existingUser = await UserModel.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ error: "Username already exists" });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ error: "Email already exists" });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new UserModel({
      username,
      password: hashedPassword,
      email,
      firstName,
      lastName,
      mobile,
      address,
      profile: profile || ""
    });

    await newUser.save();
    res.status(201).json({ msg: "User Registered Successfully!" });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/** POST: http://localhost:8080/api/login
 * @param: {
 *  "username": "kol1122",
 *  "password": "admin@123"
 * }
 */
export async function login(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "Username not found" });
    }

    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      ENV.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      msg: "Login Successful",
      username: user.username,
      token
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/** GET: http://localhost:8080/api/user/admin          */
export async function getUser(req, res) {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const user = await UserModel.findOne({ username }).lean();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { password, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Error in getUser:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/** PUT: http://localhost:8080/api/updateuser
 * @param: {
 *  "id": "<userid>"
 * }
 * body: {
 *  firstName: '',
 * address: '',
 * profile: ''
 * }
 */
export async function updateUser(req, res) {
  try {
    const { userId } = req.user;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await UserModel.updateOne({ _id: userId }, req.body);
    if (result.nModified === 0) {
      return res.status(404).json({ error: "User not found or no changes made" });
    }

    res.status(200).json({ msg: "User updated successfully" });
  } catch (error) {
    console.error('Error in updateUser:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


/** GET: http://localhost:080/api/generateOTP            */
export async function generateOTP(req, res) {
  try {
    const OTP = await otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
    // Store OTP securely (e.g., in a database associated with the user)
    // For demonstration, we'll use app.locals, but this is not recommended for production
    req.app.locals.OTP = OTP;
    res.status(200).json({ code: OTP });
  } catch (error) {
    console.error('Error in generateOTP:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/** GET: http://localhost:8080/api/verifyOTP         */
export async function verifyOTP(req, res) {
  try {
    const { code } = req.query;
    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
      // OTP is valid, set up reset session
      req.app.locals.OTP = null;
      req.app.locals.resetSession = true;
      return res.status(200).json({ msg: "OTP verified successfully" });
    }
    res.status(400).json({ error: "Invalid OTP" });
  } catch (error) {
    console.error('Error in verifyOTP:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/** Successfully redirect user when OTP is valid
 * GET: htpp://localhost:8080/api/createResetSession
 */
export async function createResetSession(req, res) {
  if (req.app.locals.resetSession) {
    req.app.locals.resetSession = false; // Reset the session immediately
    return res.status(200).json({ msg: "Access granted for password reset" });
  }
  res.status(440).json({ error: "Session expired" });
}

// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword     */
export async function resetPassword(req, res) {
  try {
    // This check should be consistent with how you're managing reset sessions
    if (!req.app.locals.resetSession) {
      return res.status(440).json({ error: "Session expired" });
    }

    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.updateOne({ username: user.username }, { password: hashedPassword });

    req.app.locals.resetSession = false; // Reset session after password change
    res.status(200).json({ msg: "Password updated successfully" });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}