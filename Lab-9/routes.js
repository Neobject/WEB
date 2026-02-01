// Activity logging routes
app.post("/api/activity", async (req, res) => {
  const actionName = req.body.action;

  if (!actionName) {
    return res.status(400).json({ message: "Action field is missing" });
  }

  try {
    await pool.query(
      "INSERT INTO activity_logs(action) VALUES ($1)",
      [actionName]
    );
    res.sendStatus(201);
  } catch (error) {
    console.error("Activity insert failed:", error);
    res.status(500).json({ message: "Unable to save activity" });
  }
});

app.get("/api/activity/stats", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT action, COUNT(*)::int AS total FROM activity_logs GROUP BY action"
    );
    res.json(rows);
  } catch (error) {
    console.error("Stats fetch failed:", error);
    res.status(500).json({ message: "Statistics error" });
  }
});
