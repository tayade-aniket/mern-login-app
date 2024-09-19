import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Schemas
import UserModel from "../model/User.model.js";

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
    const {
      username,
      password,
      profile,
      email,
      firstName,
      lastName,
      mobile,
      address,
    } = req.body;

    // Check the existing user
    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ error: "Please use a unique username" });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ error: "Please use a unique email" });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new UserModel({
      username,
      password: hashedPassword,
      profile: profile || "",
      email,
      firstName,
      lastName,
      mobile,
      address,
    });

    // Save user
    await newUser.save();

    res.status(201).json({ msg: "User Registered Successfully!" });
  } catch (error) {
    console.error(error);
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
  const { username, password } = req.body;

  try {
    UserModel.findOne({ username })
      .then((user) => {
        bcrypt
          .compare(password, user.password)
          .then((passwordCheck) => {
            if (!passwordCheck)
              return res.status(400).send({ error: "Don't have password!" });

            // create JWT token
            const token = jwt.sign(
              {
                userId: user._id,
                username: user.username,
              },
              "secret",
              { expiresIn: "1h" }
            );

            return res.status(200).send({
              msg: "Login Successful...!",
              username: user.username,
              token,
            });
          })
          .catch((error) => {
            return res.status(400).send({ error: "Password does not match!" });
          });
      })
      .catch((error) => {
        return res.status(404).send({ error: "Username not Found!" });
      });
  } catch (error) {
    return res.status(500).send({ error });
  }
}

/** GET: http://localhost:8080/api/user/admin          */
export async function getUser(req, res) {
  res.json("getUser route");
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
  res.json("updateUser route");
}

/** GET: http://localhost:080/api/generateOTP            */
export async function generateOTP(req, res) {
  res.json("generateOTP route");
}

/** GET: http://localhost:8080/api/verifyOTP         */
export async function verifyOTP(req, res) {
  res.json("verifyOTP route");
}

/** Successfully redirect user when OTP is valid
 * GET: htpp://localhost:8080/api/createResetSession
 */
export async function createResetSession(req, res) {
  res.json("createResetSession route");
}

// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword     */
export async function resetPassword(req, res) {
  res.json("resetPassword route");
}
