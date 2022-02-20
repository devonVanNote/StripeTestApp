const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const env = require("dotenv").config();
const Stripe = require("stripe");
const stripe = Stripe(process.env.StripeTestSecretKey);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

app.use(express.static(path.join(__dirname, "./views")));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server is running."));

app.post("/charge", (request, response) => {
  try {
    stripe.customers
      .create({
        name: request.body.name,
        email: request.body.email,
        source: request.body.stripeToken,
      })
      .then((customer) =>
        stripe.charges
          .create({
            amount: request.body.amount * 100,
            currency: "usd",
            customer: customer.id,
          })
          .then(() => response.render("completed.html"))
          .catch((err) => {
            response.render("index.html", { errorMessage: err.message });
          })
      )
      .catch((err) => {
        console.log(err.message);
        response.redirect("index.html");
      });
  } catch (err) {
    console.log(err.message);
    response.redirect("index.html");
  }
});
