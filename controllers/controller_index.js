const baseFunction = (req, res) => {
  res.send("Hello this is my first route");
};

const secondFunction = (rez, res) => {
  res.send("Hi, this is my second route");
};

module.exports = { baseFunction, secondFunction };
