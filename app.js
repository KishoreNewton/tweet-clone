const express = require("express");
const app = express();
const port = 3000;
app.set("view engine", "pug");
app.set("views", "views");

app.get("/", (req, res, next) => {
  const payload = {
    pageTitle: "Home"
  };

  res.status(200).render("home", payload);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
