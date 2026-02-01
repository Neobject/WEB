const { Router } = require("express");
const aiProvider = require("./provider");

const router = Router();

router.post("/chat", async (req, res) => {
  try {
    const message = req.body?.message?.trim() || "Hi!";
    const answer = await aiProvider.askAI(message);

    res.json({
      success: true,
      reply: answer,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || "Unknown error",
    });
  }
});

module.exports = router;
