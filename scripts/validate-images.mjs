import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const collectionsPath = path.join(projectRoot, "content", "collections.yaml");
const piecesPath = path.join(projectRoot, "content", "pieces.yaml");
const imagesDir = path.join(projectRoot, "public", "images");

const errors = [];

function readYaml(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  return YAML.parse(text);
}

function imageExists(filename) {
  return fs.existsSync(path.join(imagesDir, filename));
}

function formatOwner(type, item) {
  return `${type} "${item?.title ?? "Untitled"}" (${item?.slug ?? "no slug"})`;
}

function validateImageReference({ source, owner, field, filename }) {
  if (!filename || typeof filename !== "string") {
    errors.push(`${source}: ${owner} has missing or invalid ${field}.`);
    return;
  }

  if (!imageExists(filename)) {
    errors.push(`${source}: ${owner} references missing image "${filename}" in ${field}.`);
  }
}

const collectionsData = readYaml(collectionsPath);
const piecesData = readYaml(piecesPath);

for (const collection of collectionsData.collections ?? []) {
  validateImageReference({
    source: "collections.yaml",
    owner: formatOwner("collection", collection),
    field: "coverImage",
    filename: collection.coverImage,
  });
}

for (const piece of piecesData.pieces ?? []) {
  const owner = formatOwner("piece", piece);

  validateImageReference({
    source: "pieces.yaml",
    owner,
    field: "primaryImage",
    filename: piece.primaryImage,
  });

  for (const variant of piece.variants ?? []) {
    validateImageReference({
      source: "pieces.yaml",
      owner: `${owner}, variant "${variant.label ?? "Untitled"}"`,
      field: "variants[].image",
      filename: variant.image,
    });
  }
}

if (errors.length > 0) {
  console.error("\nImage validation failed:\n");

  for (const error of errors) {
    console.error(`  - ${error}`);
  }

  console.error(`\nFound ${errors.length} image reference problem${errors.length === 1 ? "" : "s"}.\n`);
  process.exit(1);
}

console.log("Image validation passed. All referenced artwork images exist.");
