// Minimal Remotion runtime worker for AuthentiLens engine.
// v1: HTTP webhook -> render existing composition with hard-coded fixture or posted props.
// Designed to lift cleanly into ClawBot as a containerized worker later.

const http = require("http");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = process.env.PORT || 3000;
const OUT_DIR = process.env.OUT_DIR || path.join(__dirname, "out");
const ENTRY = "src/index.ts";
const COMPOSITION = "AuthentilensTopicalV1";
const TRIGGER_TOKEN = process.env.RENDER_TRIGGER_TOKEN || "";

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const jobs = new Map(); // jobId -> { status, outputPath, error, startedAt, finishedAt }

function authOk(req) {
  if (!TRIGGER_TOKEN) return true; // dev mode
  const h = req.headers["authorization"] || "";
  return h === `Bearer ${TRIGGER_TOKEN}`;
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (c) => (data += c));
    req.on("end", () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

function startRender({ jobId, propsPath, outFile }) {
  const job = {
    status: "rendering",
    outputPath: outFile,
    error: null,
    startedAt: new Date().toISOString(),
    finishedAt: null,
  };
  jobs.set(jobId, job);

  const args = ["remotion", "render", ENTRY, COMPOSITION, outFile, "--concurrency=1", "--gl=swiftshader"];
  if (propsPath) args.push(`--props=${propsPath}`);

  const proc = spawn("npx", args, { cwd: __dirname, env: process.env });
  let stderr = "";
  proc.stderr.on("data", (d) => (stderr += d.toString()));
  proc.on("close", (code) => {
    job.finishedAt = new Date().toISOString();
    if (code === 0) {
      job.status = "rendered";
    } else {
      job.status = "failed";
      job.error = stderr.slice(-2000);
    }
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === "GET" && url.pathname === "/health") {
    res.writeHead(200, { "content-type": "application/json" });
    return res.end(JSON.stringify({ ok: true, service: "authentilens-render", version: "0.1.0" }));
  }

  if (req.method === "GET" && url.pathname.startsWith("/jobs/")) {
    const id = url.pathname.split("/")[2];
    const job = jobs.get(id);
    if (!job) {
      res.writeHead(404);
      return res.end("not found");
    }
    res.writeHead(200, { "content-type": "application/json" });
    return res.end(JSON.stringify({ jobId: id, ...job }));
  }

  if (req.method === "GET" && url.pathname.startsWith("/out/")) {
    const file = path.join(OUT_DIR, path.basename(url.pathname));
    if (!fs.existsSync(file)) {
      res.writeHead(404);
      return res.end("not found");
    }
    res.writeHead(200, { "content-type": "video/mp4" });
    return fs.createReadStream(file).pipe(res);
  }

  if (req.method === "POST" && url.pathname === "/render") {
    if (!authOk(req)) {
      res.writeHead(401);
      return res.end("unauthorized");
    }
    let body = {};
    try {
      body = await readJson(req);
    } catch {
      res.writeHead(400);
      return res.end("bad json");
    }

    const jobId = crypto.randomUUID();
    let propsPath = null;
    let outFile;

    if (body && body.props) {
      propsPath = path.join(OUT_DIR, `props-${jobId}.json`);
      fs.writeFileSync(propsPath, JSON.stringify(body.props));
      outFile = path.join(
        OUT_DIR,
        body.outputFilename ||
          (body.props.output && body.props.output.filename) ||
          `render-${jobId}.mp4`
      );
    } else {
      // fallback: use built-in defaultProps (Tom Hanks fixture)
      outFile = path.join(OUT_DIR, `AUTH_BB_TOMHANKS_v1_topicalV1_1080x1920_22s.mp4`);
    }

    startRender({ jobId, propsPath, outFile });
    res.writeHead(202, { "content-type": "application/json" });
    return res.end(
      JSON.stringify({
        jobId,
        status: "rendering",
        statusUrl: `/jobs/${jobId}`,
        outputUrl: `/out/${path.basename(outFile)}`,
      })
    );
  }

  res.writeHead(404);
  res.end("not found");
});

server.listen(PORT, () => {
  console.log(`authentilens-render listening on :${PORT}`);
});
