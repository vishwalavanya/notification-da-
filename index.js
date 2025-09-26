const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");

const app = express();

// ✅ Allow all origins for testing + cross-origin browser support
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// ✅ Track Vishwa's online status
let vishwaStatus = {
  isOnline: false,
  lastSeen: new Date(),
};

// ✅ Endpoint to update Vishwa's status
app.post("/status", (req, res) => {
  const { user, status } = req.body;

  if (user === "vishwa") {
    vishwaStatus.isOnline = status === "online";
    vishwaStatus.lastSeen = new Date();
    console.log(`✅ Status update received: Vishwa is now ${status}`);
  }

  // 🔄 Respond with CORS-safe JSON format
  res.status(200).json({ success: true });
});

// ✅ Endpoint to trigger email if Vishwa is offline
app.post("/message", async (req, res) => {
  const { from, to, message } = req.body;

  console.log(`📩 Message received from ${from} to ${to}: ${message}`);

  if (from === "ammu" && to === "vishwa" && !vishwaStatus.isOnline) {
    try {
      await sendEmailNotification(message);
      console.log("✅ Email sent to Vishwa");
    } catch (err) {
      console.error("❌ Email failed:", err);
    }
  }

  // 🔄 Respond with CORS-safe JSON format
  res.status(200).json({ success: true });
});

// ✅ Email logic using Nodemailer
async function sendEmailNotification(message) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "vishwanavyasree@gmail.com",
      pass: "mrdxbtsqmgyrhlil ",
    },
  });

  const mailOptions = {
    from: "vishwanavyasree@gmail.com",
    to: "vishwanavyasree@gmail.com",
    subject: "You got a new message from Ammu",
    text: `Ammu sent you a message: "${message}"`,
  };

  await transporter.sendMail(mailOptions);
}

// ✅ Serve test UI (tester.html) if needed
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "tester.html"));
});

// ✅ Start server
app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});

