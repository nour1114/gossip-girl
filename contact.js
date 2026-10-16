
const SERVICE_ID = "service_klb4g4i";
const TEMPLATE_ID = "template_24tbv2f";
const PUBLIC_KEY = "youcdpI7hifj2-mY9";

emailjs.init({
  publicKey: PUBLIC_KEY
});

const form = document.getElementById("gossip-form");
const submitButton = document.getElementById("gossip-submit");
const statusMessage = document.getElementById("gossip-status");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name =
    document.getElementById("sender-name").value.trim();

  const email =
    document.getElementById("sender-email").value.trim();

  const category =
    document.getElementById("gossip-category").value;

  const message =
    document.getElementById("gossip-message").value.trim();

  if (!category || !message) {
    statusMessage.textContent =
      "Please choose your tea and write your message.";
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "SENDING YOUR TEA...";
  statusMessage.textContent = "";

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      name: name || "Anonymous",
      email: email || "Not provided",
      category: category,
      message: message,
      recipient: "nourelsayedelsbaay@gmail.com"
    });

    statusMessage.textContent =
      "Spotted! Your message is on its way. XOXO 💋";

    form.reset();
  } catch (error) {
    console.error("Email sending failed:", error);

    statusMessage.textContent =
      "Oops! The tea couldn't be delivered. Try again.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "💋 SPILL THE TEA";
  }
});
