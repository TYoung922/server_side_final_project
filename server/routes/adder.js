const express = require("express");
const router = express.Router();
const Movies = require("../models/movies");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWTSECRET;
const adderLayout = "../../views/layouts/add-layout";

/**
 * Check Login Middleware
 */
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

/**
 * Get /
 * Adder - Check Login
 */
router.get("/adder", async (req, res) => {
  try {
    const locals = {
      title: "Adder",
      description: "A database of movies",
    };
    res.render("add-movies/add-index", { locals, layout: adderLayout });
  } catch (error) {
    console.log(error);
  }
});

// Post /login
// Adder - Login Account
router.post("/adder", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

// GET /dashboard
//Adder - Dashboard
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Dashboard",
      description: "A blog template made with NodeJS and ExpressJS",
    };

    const data = await Movies.find();
    res.render("add-movies/add-dashboard", {
      locals,
      data,
      layout: adderLayout,
    });
  } catch (error) {}
});

//Movies /register
//Adder - Register account
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({
        username,
        password: hashedPassword,
      });
      res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
      if (error === 11000) {
        return res.status(500).json({ message: "User aldeady Exists!" });
      } else {
        return res
          .status(500)
          .json({ message: "Something went wrong with the server!" });
      }
    }
  } catch {
    console.log(error);
  }
});

//GET /logout
// Adder - Logout
router.get("/logout", authMiddleware, async (req, res) => {
  try {
    res.clearCookie("token");
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

//GET / add-post
//Adder - Create New Post
router.get("/add-post", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Create Movie",
      description: "A blog template made with NodeJS and ExpressJS, and EJS",
    };

    const data = await Movies.find();
    res.render("add-movies/add-movies", { locals, data, layout: adderLayout });
  } catch (error) {
    console.log(error);
  }
});

//POST / add-post
//Adder - Create New Post
router.post("/add-post/", authMiddleware, async (req, res) => {
  try {
    console.log(res.body);
    try {
      const newMovie = new Movies({
        title: req.body.title,
        body: req.body.body,
      });
      await Movies.create(newMovie);
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
});

/** Get /edit-post
 * Adder - Update Post */
router.get("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Edit Mvie",
      description: "A blog template made with NodeJS and ExpressJS, and EJS",
    };

    const data = await Movies.findOne({ _id: req.params.id });
    res.render("add-movies/edit-movies", { locals, data, layout: adderLayout });
  } catch (error) {
    console.log(error);
  }
});

/** PUT /edit-post
 * Adder - Edit Post
 */
router.put("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    await Movies.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now(),
    });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

/** DELETE /delete-post
 * Adder - Delete Post
 */
router.delete("/delete-post/:id", authMiddleware, async (req, res) => {
  try {
    await Movies.deleteOne({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
