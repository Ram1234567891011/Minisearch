// backend/server.js
import express from "express";
import { Client } from "@elastic/elasticsearch";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4000;

// Elasticsearch client
const es = new Client({ node: process.env.ELASTIC_URL || "http://elasticsearch:9200" });

app.use(cors());
app.use(bodyParser.json());

// Health check
app.get("/api/health", async (req, res) => {
  try {
    const health = await es.cluster.health();
    res.json({ status: "ok", elastic: health });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search endpoint
app.get("/api/search", async (req, res) => {
  const q = req.query.q || "";
  if (!q) return res.json({ results: [] });

  try {
    const response = await es.search({
      index: "documents",
      query: {
        multi_match: {
          query: q,
          fields: ["title^2", "snippet", "url"]
        }
      },
      size: 10
    });

    res.json({
      results: response.hits.hits.map(h => ({
        id: h._id,
        ...h._source,
        score: h._score
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin route: add document
app.post("/api/admin/index", async (req, res) => {
  try {
    const doc = req.body;
    const response = await es.index({
      index: "documents",
      document: doc
    });
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin route: reset index
app.delete("/api/admin/index", async (req, res) => {
  try {
    await es.indices.delete({ index: "documents" }, { ignore: [404] });
    await es.indices.create({
      index: "documents",
      mappings: {
        properties: {
          title: { type: "text" },
          snippet: { type: "text" },
          url: { type: "keyword" },
          type: { type: "keyword" },
          safe: { type: "boolean" }
        }
      }
    });
    res.json({ status: "reset ok" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
