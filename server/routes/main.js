const express = require("express");
const router = express.Router();
const Movie = require("../models/movies");

//Home Page
router.get("/", async (req, res) => {
  try {
    const locals = {
      title: "MFM Database",
      description:
        "Simple list of movies created with NodeJs, Express & MongoDb.",
    };

    let perPage = 3;
    let page = req.query.page || 1;

    const data = await Movie.aggregate([{ $sort: { title: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Movie.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);
    const hasNextPagePlus = nextPage <= Math.ceil(count * perPage);

    res.render("index", {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      prevPage: hasNextPagePlus ? page - 1 : null,
    });
  } catch (error) {
    console.log(error);
  }
});

//abot Page
router.get("/about", async (req, res) => {
  const locals = {
    title: "About This Site",
    description: "Learn what this site is and how to use it.",
  };

  try {
    const data = await Movie.find().sort({ title: "desc" });
    res.render("about", { locals, data });
  } catch (error) {
    console.log(error);
  }
});

//Get Movie by ID
router.get("/movies/:id", async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Movie.findById({ _id: slug });

    const locals = {
      title: data.title,
      description:
        "A Blog template application that will be used for your own use.",
    };
    res.render("movies", { locals, data });
  } catch (error) {
    console.log(error);
  }
});

// Search Route
router.post("/search", async (req, res) => {
  try {
    const locals = {
      title: "Search",
      description: "A blog template made with NodeJS and ExpressJS",
    };

    let searchTerm = req.body.SearchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z ]/g, "");

    const data = await Movie.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });

    res.render("search", { locals, data });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
