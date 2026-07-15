/**
 * Genera un modello GLB segnaposto (casetta mediterranea stilizzata)
 * in public/models/casa.glb. Quando esporterai il tuo modello reale
 * da Blender/altro in GLB, sovrascrivi semplicemente quel file.
 *
 * Uso: node scripts/generate-placeholder-glb.js
 */
const fs = require("fs");
const path = require("path");

// ---------- geometria ----------
const primitives = []; // { positions, normals, indices, color, name }

function quad(a, b, c, d, normal, out) {
  const base = out.positions.length / 3;
  for (const v of [a, b, c, d]) out.positions.push(...v);
  for (let i = 0; i < 4; i++) out.normals.push(...normal);
  out.indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
}

function tri(a, b, c, normal, out) {
  const base = out.positions.length / 3;
  for (const v of [a, b, c]) out.positions.push(...v);
  for (let i = 0; i < 3; i++) out.normals.push(...normal);
  out.indices.push(base, base + 1, base + 2);
}

function box(cx, cy, cz, sx, sy, sz, color, name) {
  const out = { positions: [], normals: [], indices: [], color, name };
  const x0 = cx - sx / 2, x1 = cx + sx / 2;
  const y0 = cy - sy / 2, y1 = cy + sy / 2;
  const z0 = cz - sz / 2, z1 = cz + sz / 2;
  quad([x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1],[0,0,1],out);   // front
  quad([x1,y0,z0],[x0,y0,z0],[x0,y1,z0],[x1,y1,z0],[0,0,-1],out); // back
  quad([x1,y0,z1],[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],[1,0,0],out);  // right
  quad([x0,y0,z0],[x0,y0,z1],[x0,y1,z1],[x0,y1,z0],[-1,0,0],out); // left
  quad([x0,y1,z1],[x1,y1,z1],[x1,y1,z0],[x0,y1,z0],[0,1,0],out);  // top
  quad([x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1],[0,-1,0],out); // bottom
  primitives.push(out);
}

/** Tetto a due falde (prisma) */
function gableRoof(cx, yBase, cz, sx, height, sz, overhang, color, name) {
  const out = { positions: [], normals: [], indices: [], color, name };
  const x0 = cx - sx / 2 - overhang, x1 = cx + sx / 2 + overhang;
  const z0 = cz - sz / 2 - overhang, z1 = cz + sz / 2 + overhang;
  const yTop = yBase + height;
  const ridgeZ = cz;
  // falda sud (verso z1)
  const n1 = normalize([0, sz / 2 + overhang, height]);
  quad([x0, yBase, z1], [x1, yBase, z1], [x1, yTop, ridgeZ], [x0, yTop, ridgeZ], n1, out);
  // falda nord (verso z0)
  const n2 = normalize([0, sz / 2 + overhang, -height]);
  quad([x1, yBase, z0], [x0, yBase, z0], [x0, yTop, ridgeZ], [x1, yTop, ridgeZ], n2, out);
  // timpani
  tri([x1, yBase, z1], [x1, yBase, z0], [x1, yTop, ridgeZ], [1, 0, 0], out);
  tri([x0, yBase, z0], [x0, yBase, z1], [x0, yTop, ridgeZ], [-1, 0, 0], out);
  // sotto-tetto
  quad([x0, yBase, z0], [x1, yBase, z0], [x1, yBase, z1], [x0, yBase, z1], [0, -1, 0], out);
  primitives.push(out);
}

function normalize(v) {
  const l = Math.hypot(...v) || 1;
  return v.map((c) => c / l);
}

// ---------- la casetta ----------
const IVORY = [0.93, 0.9, 0.84, 1];
const GOLD = [0.72, 0.57, 0.35, 1];
const SEA = [0.18, 0.36, 0.42, 1];
const STONE = [0.62, 0.58, 0.51, 1];
const WHITE = [0.98, 0.97, 0.94, 1];

box(0, 0.06, 0, 5.6, 0.12, 4.6, STONE, "base");           // basamento
box(0, 1.31, 0, 4.2, 2.5, 3.2, WHITE, "walls");            // corpo casa
gableRoof(0, 2.56, 0, 4.2, 1.15, 3.2, 0.25, GOLD, "roof"); // tetto
box(0, 1.05, 1.63, 0.92, 1.9, 0.08, SEA, "door");          // porta
box(-1.3, 1.55, 1.62, 0.7, 0.9, 0.06, SEA, "window-l");    // finestra sx
box(1.3, 1.55, 1.62, 0.7, 0.9, 0.06, SEA, "window-r");     // finestra dx
box(2.11, 1.55, 0, 0.06, 0.9, 0.7, SEA, "window-side");    // finestra lato
box(1.35, 3.35, -0.8, 0.45, 0.8, 0.45, IVORY, "chimney");  // comignolo
box(0, 0.2, 2.7, 5.6, 0.16, 1.4, IVORY, "terrace");        // terrazza
box(0, 0.5, 3.36, 5.6, 0.44, 0.08, IVORY, "parapet");      // parapetto

// ---------- costruzione GLB ----------
function align(n, pad) { return Math.ceil(n / 4) * 4; }

const buffers = [];
let byteOffset = 0;
const bufferViews = [];
const accessors = [];
const meshPrimitives = [];
const materials = [];

for (const prim of primitives) {
  const pos = new Float32Array(prim.positions);
  const nor = new Float32Array(prim.normals);
  const idx = new Uint16Array(prim.indices);

  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < pos.length; i += 3) {
    for (let k = 0; k < 3; k++) {
      min[k] = Math.min(min[k], pos[i + k]);
      max[k] = Math.max(max[k], pos[i + k]);
    }
  }

  const parts = [
    { data: Buffer.from(pos.buffer), target: 34962, type: "VEC3", comp: 5126, count: pos.length / 3, min, max },
    { data: Buffer.from(nor.buffer), target: 34962, type: "VEC3", comp: 5126, count: nor.length / 3 },
    { data: Buffer.from(idx.buffer), target: 34963, type: "SCALAR", comp: 5123, count: idx.length },
  ];

  const accIdx = [];
  for (const part of parts) {
    const padded = align(part.data.length);
    const buf = Buffer.concat([part.data, Buffer.alloc(padded - part.data.length)]);
    bufferViews.push({ buffer: 0, byteOffset, byteLength: part.data.length, target: part.target });
    buffers.push(buf);
    byteOffset += padded;
    const acc = {
      bufferView: bufferViews.length - 1,
      componentType: part.comp,
      count: part.count,
      type: part.type,
    };
    if (part.min) { acc.min = part.min; acc.max = part.max; }
    accessors.push(acc);
    accIdx.push(accessors.length - 1);
  }

  materials.push({
    name: prim.name,
    pbrMetallicRoughness: {
      baseColorFactor: prim.color,
      metallicFactor: 0,
      roughnessFactor: 0.85,
    },
  });

  meshPrimitives.push({
    attributes: { POSITION: accIdx[0], NORMAL: accIdx[1] },
    indices: accIdx[2],
    material: materials.length - 1,
  });
}

const bin = Buffer.concat(buffers);

const gltf = {
  asset: { version: "2.0", generator: "casa-omero-placeholder" },
  scene: 0,
  scenes: [{ nodes: [0] }],
  nodes: [{ mesh: 0, name: "CasaOmero" }],
  meshes: [{ name: "casa", primitives: meshPrimitives }],
  materials,
  accessors,
  bufferViews,
  buffers: [{ byteLength: bin.length }],
};

let json = Buffer.from(JSON.stringify(gltf));
const jsonPadded = Buffer.concat([json, Buffer.alloc(align(json.length) - json.length, 0x20)]);
const binPadded = Buffer.concat([bin, Buffer.alloc(align(bin.length) - bin.length)]);

const header = Buffer.alloc(12);
header.writeUInt32LE(0x46546c67, 0); // 'glTF'
header.writeUInt32LE(2, 4);
header.writeUInt32LE(12 + 8 + jsonPadded.length + 8 + binPadded.length, 8);

const jsonHeader = Buffer.alloc(8);
jsonHeader.writeUInt32LE(jsonPadded.length, 0);
jsonHeader.writeUInt32LE(0x4e4f534a, 4); // 'JSON'

const binHeader = Buffer.alloc(8);
binHeader.writeUInt32LE(binPadded.length, 0);
binHeader.writeUInt32LE(0x004e4942, 4); // 'BIN'

const glb = Buffer.concat([header, jsonHeader, jsonPadded, binHeader, binPadded]);

const outDir = path.join(__dirname, "..", "public", "models");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "casa.glb");
fs.writeFileSync(outPath, glb);
console.log("scritto", outPath, (glb.length / 1024).toFixed(1) + "KB");
