import express from "express";
import http from "http";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: "*",
  }),
);

app.get("/", (req, res) => {
  res.json("Hello");
});

app.get("/search", async (req, res) => {
  try {
    const base_url = process.env.NORMINATIM_URL;
    const term = req.query.q || "";
    const limit = req.query.limit || 10;
    if (!term) {
      return res.json("Not found");
    }

    const response = await fetch(
      `${base_url}/search?q=${term}&limit=${limit}&addressdetails=1&format=json`,
      {
        method: "GET",
      },
    );

    const data = await response.json();
    const formatted = data.map((d) => {
      return {
        id: d.place_id,
        name: d.name,
        address: d.address,
        fullAddress: `${d.address?.county || d.address?.city || d.address?.state || ""}, ${d.address?.country_code.toUpperCase() || ""}, ${d.address?.country || ""}`,
        coordinates: [parseFloat(d.lat), parseFloat(d.lon)],
      };
    });
    return res.json(formatted);
  } catch (err) {
    console.log(err);
    return res.status(400).json("Failed to search");
  }
});

app.post("/directions", async (req, res) => {
  try {
    const { origin, destination } = req.body;

    if (!origin || !destination) {
      return res.status(500).json("Missing origin or destination");
    }
    const { lat: originLat, lon: originLon } = origin;
    const { lat: destinationLat, lon: destinationLon } = destination;

    const url = `${process.env.OSRM_URL}/route/v1/driving/${originLon},${originLat};${destinationLon},${destinationLat}?overview=full&steps=true`;
    const response = await fetch(url, {
      method: "GET",
    });
    const data = await response.json();
    return res.status(201).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json("Failed to calculate directions");
  }
});

app.use((req, res) => {
  res.status(404).json("Not found");
});

server.listen("8000", () => {
  console.log("Server running at 8000");
});
