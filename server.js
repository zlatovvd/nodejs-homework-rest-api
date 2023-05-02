const mongoose = require("mongoose");
const app = require("./app");
const {DB_HOST} = require('./config');

// login - vasyl
// pass - k8opJ3kpTZ9JbsUb
// const DB_HOST =
//   "mongodb+srv://vasyl:k8opJ3kpTZ9JbsUb@cluster0.v95caoh.mongodb.net/db-contacts?retryWrites=true&w=majority";

mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(3000, () => {
      console.log("Server running. Use our API on port: 3000");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
