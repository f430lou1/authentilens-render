HELLO WORLD TEST// Minimal Remotion runtime worker for AuthentiLens engine.
// v2: multi-lane dispatcher. Routes by props.template -> LANES registry.

const http = require("http");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = process.env.PORT || 3000;
const OUT_DIR = process.env.OUT_DIR || path.join(__dirname, "out");
const ENTRY = "src/index.ts";
const TRIGGER_TOKEN = process.env.RENDER_TRIGGER_TOKEN || "";

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// ------------------------------------------------------------------
// Template lane registry
// ------------------------------------------------------------------
const LANES = {
  authentilens_topical_v1: {
    command: "render",
    compositionId: "AuthentilensTopicalV1",
    ext: "mp4",
    contentType: "video/mp4",
    extraArgs: ["--concurrency=1", "--gl=swiftshader"],
    defaultOutput: "AUTH_BB_TOMHANKS_v1_topicalV1_1080x1920_22s.mp4",
  },
  authentilens_static_image_v1: {
    command: "still",
    compositionId: "AuthentilensStaticImageV1",
    ext: "png",
    contentType: "image/png",
    extraArgs: ["--gl=swiftshader"],
    defaultOutput: "AUTH_IMG_TOMHANKS_v1_staticVerdict_1080x1080.png",
  },
};

const DEFAULT_TEMPLATE = "authentilens_topical_v1";

function resolveLane(props, bodyTemplate) {
  const id =
    bodyTemplate ||
    (props && props.template) ||
    DEFAULT_TEMPLATE;
  const lane = LANES[id];
  if (!lane) return { id, lane: null };
  return { id, lane };
}

function contentTypeFor(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === ".mp4") return "video/mp4";
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  return "application/octet-stream";
}

const jobs = new Map();

function authOk(req) {
  if (!TRIGGER_TOKEN) return true;
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

function startRender({ jobId, lane, templateId, propsPath, outFile }) {
  const job = {
    status: "rendering",
    template: templateId,
    outputPath: outFile,
    error: null,
    startedAt: new Date().toISOString(),
    finishedAt: null,
  };
  jobs.set(jobId, job);

  const args = ["remotion", lane.command, ENTRY, lane.compositionId, outFile];
  if (propsPath) args.push(`--props=${propsPath}`);
  for (const a of lane.extraArgs) args.push(a);

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
    return res.end(
      JSON.stringify({
        ok: true,
        service: "authentilens-render",
        version: "0.2.0",
        lanes: Object.keys(LANES),
      })
    );
  }

  if (req.method === "GET" && url.pathname === "/lanes") {
    res.writeHead(200, { "content-type": "application/json" });
    return res.end(
      JSON.stringify(
        Object.fromEntries(
          Object.entries(LANES).map(([k, v]) => [
            k,
            { command: v.command, compositionId: v.compositionId, ext: v.ext },
          ])
        )
      )
    );
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
    res.writeHead(200, { "content-type": contentTypeFor(file) });
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

    const { id: templateId, lane } = resolveLane(body.props, body.template);
    if (!lane) {
      res.writeHead(400, { "content-type": "application/json" });
      return res.end(
        JSON.stringify({ error: "unknown_template", template: templateId, lanes: Object.keys(LANES) })
      );
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
          `render-${jobId}.${lane.ext}`
      );
    } else {
      outFile = path.join(OUT_DIR, lane.defaultOutput);
    }

    startRender({ jobId, lane, templateId, propsPath, outFile });
    res.writeHead(202, { "content-type": "application/json" });
    return res.end(
      JSON.stringify({
        jobId,
        template: templateId,
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
