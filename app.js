const express = require("express");
const client = require("prom-client");

const app = express();
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["route", "method", "status"],
});
register.registerMetric(httpRequestsTotal);

app.get("/", (req, res) => {
  httpRequestsTotal.labels({ route: "/", method: "GET", status: 200 }).inc();
  res.send("Hello Chronosphere!");
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.get("/healthz", (req, res) => res.json({ status: "ok" }));

// 8081 default
const PORT = Number(process.env.PORT) || 8081;
app.listen(PORT, "0.0.0.0", () => console.log(`Listening on ${PORT}`));

