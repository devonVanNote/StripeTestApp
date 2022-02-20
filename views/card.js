const stripe = Stripe(
  "pk_test_51KUNMJIpfslUCnL8U7natzPPWOJAjz996TVQ55IssawerKNkFmvLVHkBAY0Hu5GIgRCY7yDRfrPAEjhn2UgQPAez00GT2FYC3b"
);
const elements = stripe.elements();

var style = {
  base: {
    color: "#fff",
  },
};

const card = elements.create("card", { style });
card.mount("#card-element");

const form = document.querySelector("form");
const errorEl = document.querySelector("#card-errors");
const aboutMe = document.querySelector("#about-me");
const hiEmoji = document.querySelector("#hi-intrepid");

const stripeTokenHandler = (token) => {
  const hiddenInput = document.createElement("input");
  hiddenInput.setAttribute("type", "hidden");
  hiddenInput.setAttribute("name", "stripeToken");
  hiddenInput.setAttribute("value", token.id);
  form.appendChild(hiddenInput);

  form.submit();
};

form.addEventListener("submit", (e) => {
  e.preventDefault();

  stripe
    .createToken(card)
    .then((res) => {
      if (res.error) {
        errorEl.textContent = res.error.message;
      } else {
        stripeTokenHandler(res.token);
      }
    })
    .catch((err) => (errorEl.textContent = err.message));
});

const hideAboutMe = () => {
  aboutMe.style.display = "none";
  hiEmoji.style.display = "none";
};
