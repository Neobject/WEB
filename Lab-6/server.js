const express = require("express");
const tf = require("@tensorflow/tfjs");
const jsonParser = require("body-parser").json;
const fs = require("fs");
const csvReader = require("csv-parser");

const server = express();
server.use(jsonParser());

let spamDetector = null;

/* ---------- CSV DATA LOADER ---------- */
function readCsvDataset(path) {
  const features = [];
  const targets = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(path)
      .pipe(csvReader())
      .on("data", (row) => {
        const marks = Number(row.exclamationMarks);
        const ads = Number(row.promowords);
        const label = Number(row.isspam);

        if (![marks, ads, label].some(isNaN)) {
          features.push([marks, ads]);
          targets.push([label]);
        }
      })
      .on("end", () => {
        console.log(`CSV loaded: ${features.length} records`);
        resolve({
          x: tf.tensor2d(features),
          y: tf.tensor2d(targets),
        });
      })
      .on("error", reject);
  });
}

/* ---------- MODEL CREATION ---------- */
function buildModel() {
  const net = tf.sequential();

  net.add(
    tf.layers.dense({
      inputShape: [2],
      units: 8,
      activation: "relu",
    })
  );

  net.add(
    tf.layers.dense({
      units: 1,
      activation: "sigmoid",
    })
  );

  net.compile({
    optimizer: tf.train.adam(0.01),
    loss: "binaryCrossentropy",
  });

  return net;
}

/* ---------- TRAINING ---------- */
async function initSpamAI() {
  try {
    const { x, y } = await readCsvDataset("./data.csv");

    spamDetector = buildModel();

    console.log("AI training started...");
    await spamDetector.fit(x, y, {
      epochs: 200,
      verbose: 0,
    });

    x.dispose();
    y.dispose();

    console.log("AI successfully trained ✔");
  } catch (e) {
    console.error("Failed to initialize AI:", e.message);
  }
}

/* ---------- API ---------- */
server.post("/check", (req, res) => {
  try {
    const marks = Number(req.body.exclamationMarks);
    const ads = Number(req.body.promowords);

    if (isNaN(marks) || isNaN(ads)) {
      return res.status(400).json({ error: "Bad input format" });
    }

    const prediction = tf.tidy(() => {
      const input = tf.tensor2d([[marks, ads]]);
      return spamDetector.predict(input);
    });

    const value = prediction.dataSync()[0];
    prediction.dispose();

    res.json({
      probability: `${(value * 100).toFixed(2)}%`,
      verdict: value > 0.5 ? "SPAM" : "NOT SPAM",
      status: value > 0.5 ? "Suspicious" : "Clean",
    });
  } catch {
    res.status(500).json({ error: "Prediction error" });
  }
});

/* ---------- SERVER START ---------- */
const PORT = 4000;

initSpamAI().then(() => {
  server.listen(PORT, () => {
    console.log(`API running → http://localhost:${PORT}`);
  });
});
