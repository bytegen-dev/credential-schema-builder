import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import {
  calculateSchemaSaid,
  SchemaMetadata,
} from "@credential-schema-builder/shared";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post("/api/schemas", async (req, res) => {
  try {
    const metadata: SchemaMetadata = req.body;

    if (!metadata.title || !metadata.credentialType) {
      return res.status(400).json({
        error: "Title and Credential Type are required",
      });
    }

    const result = await calculateSchemaSaid(metadata);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Error creating schema:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create schema",
    });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const frontendPath = path.join(__dirname, "../../frontend/out");
app.use("/web", express.static(frontendPath));
app.get("/web/*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Redirect root to /web
app.get("/", (req, res) => {
  res.redirect("/web");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Frontend: http://localhost:${PORT}/web`);
  console.log(`API: http://localhost:${PORT}/api`);
});
