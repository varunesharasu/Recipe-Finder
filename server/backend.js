// const express = require("express")
// const mongoose = require("mongoose")
// const cors = require("cors")
// const bodyParser = require("body-parser")
// const bcrypt = require("bcryptjs")
// const nodemailer = require("nodemailer")
// const crypto = require("crypto")
// require("dotenv").config()

// const app = express()

// // Enhanced CORS configuration
// const corsOptions = {
//   origin: [
//     "http://localhost:3000",
//     "http://localhost:3001",
//     "https://culinary-finder.vercel.app/", // Add your production domain here
//     "https://recipe-finder-frontend.vercel.app", // Example production domain
//   ],
//   credentials: true,
//   optionsSuccessStatus: 200,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
// }

// app.use(cors(corsOptions))

// // Handle preflight requests
// app.options("*", cors(corsOptions))

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))

// // Add request logging middleware
// app.use((req, res, next) => {
//   console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
//   next()
// })

// let tempEmail = null
// const isGmailEmail = (email) => {
//   const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/
//   return gmailRegex.test(email)
// }

// mongoose
//   .connect("mongodb+srv://varunesh:varunesh@cluster1.lvoka.mongodb.net/recipeFinder", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB connected successfully"))
//   .catch((err) => console.log("MongoDB connection error:", err))

// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   otp: { type: String },
//   otpExpires: { type: Date },
// })

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "varunesht.22it@kongu.edu",
//     pass: "Varunesh@1",
//   },
//   connectionTimeout: 60000,
// })

// const User = mongoose.model("User", userSchema)

// const RecipeSchema = new mongoose.Schema({
//   label: {
//     type: String,
//     required: true,
//   },
//   image: {
//     type: String,
//     required: true,
//   },
//   totalTime: {
//     type: Number,
//     required: true,
//   },
//   calories: {
//     type: Number,
//     required: true,
//   },
//   servings: {
//     type: Number,
//     default: 4,
//   },
//   ingredients: {
//     type: [String],
//     required: true,
//   },
// })

// const Recipe = mongoose.model("Recipe", RecipeSchema)

// const adminSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// })

// const Admin = mongoose.model("Admin", adminSchema)

// // Health check endpoint
// app.get("/", (req, res) => {
//   res.json({ message: "Recipe Finder API is running!", timestamp: new Date().toISOString() })
// })

// // API Routes
// app.get("/recipes", async (req, res) => {
//   try {
//     const { label } = req.query

//     const filter = {}

//     if (label) {
//       filter.label = { $regex: label, $options: "i" }
//     }

//     const recipes = await Recipe.find(filter)
//     res.json(recipes)
//   } catch (err) {
//     console.error("Error fetching recipes:", err)
//     res.status(500).json({ message: "Server error", error: err.message })
//   }
// })

// app.post("/recipes", async (req, res) => {
//   const { label, image, totalTime, calories, servings, ingredients } = req.body

//   try {
//     const newRecipe = new Recipe({
//       label,
//       image,
//       totalTime,
//       calories,
//       servings: servings || 4,
//       ingredients,
//     })

//     await newRecipe.save()
//     res.status(201).json({ message: "Recipe saved successfully", recipe: newRecipe })
//   } catch (err) {
//     console.error("Error saving recipe:", err)
//     res.status(500).json({ message: "Server error", error: err.message })
//   }
// })

// app.delete("/recipes/:id", async (req, res) => {
//   try {
//     const { id } = req.params
//     const deletedRecipe = await Recipe.findByIdAndDelete(id)

//     if (!deletedRecipe) {
//       return res.status(404).json({ message: "Recipe not found" })
//     }

//     res.json({ message: "Recipe deleted successfully" })
//   } catch (err) {
//     console.error("Error deleting recipe:", err)
//     res.status(500).json({ message: "Server error", error: err.message })
//   }
// })

// // Admin routes
// app.post("/admin/login", async (req, res) => {
//   const { email, password } = req.body

//   try {
//     console.log("Admin login attempt for:", email)

//     const admin = await Admin.findOne({ email })
//     if (!admin) {
//       console.log("Admin not found:", email)
//       return res.status(400).json({ message: "Invalid credentials" })
//     }

//     const isMatch = await bcrypt.compare(password, admin.password)
//     if (!isMatch) {
//       console.log("Password mismatch for admin:", email)
//       return res.status(400).json({ message: "Invalid credentials" })
//     }

//     console.log("Admin login successful:", email)
//     res.json({
//       message: "Login successful",
//       user: {
//         id: admin._id,
//         email: admin.email,
//         role: "admin",
//       },
//     })
//   } catch (err) {
//     console.error("Admin login error:", err)
//     res.status(500).json({ message: "Server error", error: err.message })
//   }
// })

// app.post("/admin/signup", async (req, res) => {
//   const { email, password, adminKey } = req.body

//   try {
//     // Simple admin key check (you should use environment variable in production)
//     const ADMIN_KEY = "admin123" // Change this to a secure key

//     if (adminKey !== ADMIN_KEY) {
//       return res.status(400).json({ message: "Invalid admin authorization key" })
//     }

//     const existingAdmin = await Admin.findOne({ email })
//     if (existingAdmin) {
//       return res.status(400).json({ message: "Admin already exists" })
//     }

//     const salt = await bcrypt.genSalt(10)
//     const hashedPassword = await bcrypt.hash(password, salt)
//     const newAdmin = new Admin({ email, password: hashedPassword })

//     await newAdmin.save()
//     console.log("New admin created:", email)

//     res.status(201).json({
//       message: "Admin created successfully",
//       admin: { email: newAdmin.email },
//     })
//   } catch (err) {
//     console.error("Admin signup error:", err)
//     res.status(500).json({ message: "Server error", error: err.message })
//   }
// })

// // User routes
// app.post("/api/login", async (req, res) => {
//   const { identifier, password } = req.body

//   try {
//     console.log("User login attempt for:", identifier)

//     const user = await User.findOne({
//       $or: [{ email: identifier }, { username: identifier }],
//     })

//     if (!user) {
//       console.log("User not found:", identifier)
//       return res.status(400).json({ message: "User not found. Please check your username or email." })
//     }

//     const isMatch = await bcrypt.compare(password, user.password)
//     if (!isMatch) {
//       console.log("Password mismatch for user:", identifier)
//       return res.status(400).json({ message: "Incorrect password. Please try again." })
//     }

//     console.log("User login successful:", identifier)
//     res.status(200).json({
//       message: "Login successful",
//       user: {
//         username: user.username,
//         email: user.email,
//         role: "user",
//       },
//     })
//   } catch (err) {
//     console.error("User login error:", err)
//     res.status(500).json({ message: "Error logging in. Please try again later.", error: err.message })
//   }
// })

// const sendOtp = async (email, otp) => {
//   const mailOptions = {
//     from: "varunesht.22it@kongu.edu",
//     to: email,
//     subject: "Your OTP Code",
//     text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
//   }

//   await transporter.sendMail(mailOptions)
// }

// app.post("/api/signup", async (req, res) => {
//   const { username, email, password } = req.body

//   try {
//     console.log("User signup attempt for:", email)

//     if (!isGmailEmail(email)) {
//       return res.status(400).json({ message: "Please provide a valid Gmail address." })
//     }

//     const existingUser = await User.findOne({
//       $or: [{ email }, { username }],
//     })

//     if (existingUser) {
//       if (existingUser.email === email) {
//         return res.status(400).json({ message: "Email already exists" })
//       }
//       if (existingUser.username === username) {
//         return res.status(400).json({ message: "Username already exists" })
//       }
//     }

//     const salt = await bcrypt.genSalt(10)
//     const hashedPassword = await bcrypt.hash(password, salt)

//     const otp = crypto.randomInt(100000, 999999).toString()
//     const otpExpires = Date.now() + 5 * 60 * 1000

//     tempEmail = email

//     const newUser = new User({
//       username,
//       email: tempEmail,
//       password: hashedPassword,
//       otp,
//       otpExpires,
//     })

//     await newUser.save()
//     await sendOtp(tempEmail, otp)

//     console.log("User signup successful, OTP sent to:", email)
//     res.status(201).json({ message: "User created successfully. Check your email for the OTP." })
//   } catch (err) {
//     console.error("User signup error:", err)
//     res.status(500).json({ message: "Error creating user", error: err.message })
//   }
// })

// app.post("/api/verify-otp", async (req, res) => {
//   const { email, otp } = req.body

//   try {
//     console.log("OTP verification attempt for:", email)

//     const emailToCheck = email || tempEmail

//     if (!emailToCheck) {
//       return res.status(400).json({ message: "No email found. Please sign up first." })
//     }

//     const user = await User.findOne({ email: emailToCheck })

//     if (!user) {
//       return res.status(400).json({ message: "User not found" })
//     }

//     if (user.otp === otp && Date.now() < user.otpExpires) {
//       user.otp = undefined
//       user.otpExpires = undefined
//       await user.save()

//       tempEmail = null
//       console.log("OTP verification successful for:", emailToCheck)
//       res.json({ message: "OTP verified successfully. You can now log in." })
//     } else {
//       console.log("Invalid or expired OTP for:", emailToCheck)
//       res.status(400).json({ message: "Invalid or expired OTP." })
//     }
//   } catch (err) {
//     console.error("OTP verification error:", err)
//     res.status(500).json({ message: "Error verifying OTP", error: err.message })
//   }
// })

// // Get users endpoint for admin
// app.get("/admin/users", async (req, res) => {
//   try {
//     const users = await User.find({}, { password: 0, otp: 0 }) // Exclude sensitive fields
//     res.json(users)
//   } catch (err) {
//     console.error("Error fetching users:", err)
//     res.status(500).json({ message: "Server error", error: err.message })
//   }
// })

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error("Unhandled error:", err)
//   res.status(500).json({ message: "Internal server error", error: err.message })
// })

// // 404 handler
// app.use("*", (req, res) => {
//   console.log("404 - Route not found:", req.method, req.originalUrl)
//   res.status(404).json({ message: "Route not found", path: req.originalUrl })
// })

// const PORT = process.env.PORT || 5000
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
//   console.log(`Server URL: http://localhost:${PORT}`)
// })











const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bodyParser = require("body-parser")
const bcrypt = require("bcryptjs")
const nodemailer = require("nodemailer")
const crypto = require("crypto")
require("dotenv").config()

const app = express()

// Enhanced CORS configuration with your new Vercel domain
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://culinary-finder.vercel.app", // Your new Vercel domain
    "https://recipe-finder-varunesh-ts-projects.vercel.app/",
    "https://recipe-finder-git-main-varunesh-ts-projects.vercel.app/",
    // Add any other domains you might use
    /\.vercel\.app$/, // This regex allows any vercel.app subdomain
    /\.netlify\.app$/, // This allows netlify deployments too
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers",
  ],
  exposedHeaders: ["Access-Control-Allow-Origin"],
}

// Apply CORS middleware
app.use(cors(corsOptions))

// Handle preflight requests for all routes
app.options("*", cors(corsOptions))

// Additional CORS headers middleware
app.use((req, res, next) => {
  const origin = req.headers.origin
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://culinary-finder.vercel.app",
    "https://recipe-finder-frontend.vercel.app",
  ]

  if (allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin)
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, Origin")
  res.setHeader("Access-Control-Allow-Credentials", "true")
  res.setHeader("Access-Control-Max-Age", "86400") // 24 hours

  // Handle preflight
  if (req.method === "OPTIONS") {
    res.status(200).end()
    return
  }

  next()
})

app.use(bodyParser.json({ limit: "10mb" }))
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }))

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin}`)
  next()
})

let tempEmail = null
const isGmailEmail = (email) => {
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/
  return gmailRegex.test(email)
}

mongoose
  .connect("mongodb+srv://varunesh:varunesh@cluster1.lvoka.mongodb.net/recipeFinder", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err))

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String },
  otpExpires: { type: Date },
})

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "varunesht.22it@kongu.edu",
    pass: "Varunesh@1",
  },
  connectionTimeout: 60000,
})

const User = mongoose.model("User", userSchema)

const RecipeSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  totalTime: {
    type: Number,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  servings: {
    type: Number,
    default: 4,
  },
  ingredients: {
    type: [String],
    required: true,
  },
})

const Recipe = mongoose.model("Recipe", RecipeSchema)

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
})

const Admin = mongoose.model("Admin", adminSchema)

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Recipe Finder API is running!",
    timestamp: new Date().toISOString(),
    cors: "enabled",
    allowedOrigins: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://culinary-finder.vercel.app",
      "https://recipe-finder-frontend.vercel.app",
    ],
  })
})

// CORS test endpoint
app.get("/api/cors-test", (req, res) => {
  res.json({
    message: "CORS is working!",
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
  })
})

// API Routes
app.get("/recipes", async (req, res) => {
  try {
    const { label } = req.query

    const filter = {}

    if (label) {
      filter.label = { $regex: label, $options: "i" }
    }

    const recipes = await Recipe.find(filter)
    res.json(recipes)
  } catch (err) {
    console.error("Error fetching recipes:", err)
    res.status(500).json({ message: "Server error", error: err.message })
  }
})

app.post("/recipes", async (req, res) => {
  const { label, image, totalTime, calories, servings, ingredients } = req.body

  try {
    const newRecipe = new Recipe({
      label,
      image,
      totalTime,
      calories,
      servings: servings || 4,
      ingredients,
    })

    await newRecipe.save()
    res.status(201).json({ message: "Recipe saved successfully", recipe: newRecipe })
  } catch (err) {
    console.error("Error saving recipe:", err)
    res.status(500).json({ message: "Server error", error: err.message })
  }
})

app.delete("/recipes/:id", async (req, res) => {
  try {
    const { id } = req.params
    const deletedRecipe = await Recipe.findByIdAndDelete(id)

    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recipe not found" })
    }

    res.json({ message: "Recipe deleted successfully" })
  } catch (err) {
    console.error("Error deleting recipe:", err)
    res.status(500).json({ message: "Server error", error: err.message })
  }
})

// Admin routes
app.post("/admin/login", async (req, res) => {
  const { email, password } = req.body

  try {
    console.log("Admin login attempt for:", email)

    const admin = await Admin.findOne({ email })
    if (!admin) {
      console.log("Admin not found:", email)
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
      console.log("Password mismatch for admin:", email)
      return res.status(400).json({ message: "Invalid credentials" })
    }

    console.log("Admin login successful:", email)
    res.json({
      message: "Login successful",
      user: {
        id: admin._id,
        email: admin.email,
        role: "admin",
      },
    })
  } catch (err) {
    console.error("Admin login error:", err)
    res.status(500).json({ message: "Server error", error: err.message })
  }
})

app.post("/admin/signup", async (req, res) => {
  const { email, password, adminKey } = req.body

  try {
    // Simple admin key check (you should use environment variable in production)
    const ADMIN_KEY = "admin123" // Change this to a secure key

    if (adminKey !== ADMIN_KEY) {
      return res.status(400).json({ message: "Invalid admin authorization key" })
    }

    const existingAdmin = await Admin.findOne({ email })
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newAdmin = new Admin({ email, password: hashedPassword })

    await newAdmin.save()
    console.log("New admin created:", email)

    res.status(201).json({
      message: "Admin created successfully",
      admin: { email: newAdmin.email },
    })
  } catch (err) {
    console.error("Admin signup error:", err)
    res.status(500).json({ message: "Server error", error: err.message })
  }
})

// User routes
app.post("/api/login", async (req, res) => {
  const { identifier, password } = req.body

  try {
    console.log("User login attempt for:", identifier, "from origin:", req.headers.origin)

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    })

    if (!user) {
      console.log("User not found:", identifier)
      return res.status(400).json({ message: "User not found. Please check your username or email." })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      console.log("Password mismatch for user:", identifier)
      return res.status(400).json({ message: "Incorrect password. Please try again." })
    }

    console.log("User login successful:", identifier)
    res.status(200).json({
      message: "Login successful",
      user: {
        username: user.username,
        email: user.email,
        role: "user",
      },
    })
  } catch (err) {
    console.error("User login error:", err)
    res.status(500).json({ message: "Error logging in. Please try again later.", error: err.message })
  }
})

const sendOtp = async (email, otp) => {
  const mailOptions = {
    from: "varunesht.22it@kongu.edu",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
  }

  await transporter.sendMail(mailOptions)
}

app.post("/api/signup", async (req, res) => {
  const { username, email, password } = req.body

  try {
    console.log("User signup attempt for:", email, "from origin:", req.headers.origin)

    if (!isGmailEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid Gmail address." })
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already exists" })
      }
      if (existingUser.username === username) {
        return res.status(400).json({ message: "Username already exists" })
      }
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const otp = crypto.randomInt(100000, 999999).toString()
    const otpExpires = Date.now() + 5 * 60 * 1000

    tempEmail = email

    const newUser = new User({
      username,
      email: tempEmail,
      password: hashedPassword,
      otp,
      otpExpires,
    })

    await newUser.save()
    await sendOtp(tempEmail, otp)

    console.log("User signup successful, OTP sent to:", email)
    res.status(201).json({ message: "User created successfully. Check your email for the OTP." })
  } catch (err) {
    console.error("User signup error:", err)
    res.status(500).json({ message: "Error creating user", error: err.message })
  }
})

app.post("/api/verify-otp", async (req, res) => {
  const { email, otp } = req.body

  try {
    console.log("OTP verification attempt for:", email, "from origin:", req.headers.origin)

    const emailToCheck = email || tempEmail

    if (!emailToCheck) {
      return res.status(400).json({ message: "No email found. Please sign up first." })
    }

    const user = await User.findOne({ email: emailToCheck })

    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }

    if (user.otp === otp && Date.now() < user.otpExpires) {
      user.otp = undefined
      user.otpExpires = undefined
      await user.save()

      tempEmail = null
      console.log("OTP verification successful for:", emailToCheck)
      res.json({ message: "OTP verified successfully. You can now log in." })
    } else {
      console.log("Invalid or expired OTP for:", emailToCheck)
      res.status(400).json({ message: "Invalid or expired OTP." })
    }
  } catch (err) {
    console.error("OTP verification error:", err)
    res.status(500).json({ message: "Error verifying OTP", error: err.message })
  }
})

// Get users endpoint for admin
app.get("/admin/users", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0, otp: 0 }) // Exclude sensitive fields
    res.json(users)
  } catch (err) {
    console.error("Error fetching users:", err)
    res.status(500).json({ message: "Server error", error: err.message })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err)
  res.status(500).json({ message: "Internal server error", error: err.message })
})

// 404 handler
app.use("*", (req, res) => {
  console.log("404 - Route not found:", req.method, req.originalUrl, "Origin:", req.headers.origin)
  res.status(404).json({ message: "Route not found", path: req.originalUrl })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Server URL: http://localhost:${PORT}`)
  console.log("CORS enabled for:")
  console.log("- http://localhost:3000")
  console.log("- http://localhost:3001")
  console.log("- https://culinary-finder.vercel.app")
  console.log("- https://recipe-finder-varunesh-ts-projects.vercel.app/")
  console.log("- https://recipe-finder-git-main-varunesh-ts-projects.vercel.app/")
})
