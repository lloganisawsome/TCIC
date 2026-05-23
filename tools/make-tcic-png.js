const fs = require("fs");
const zlib = require("zlib");

const width = 1280;
const height = 720;
const data = Buffer.alloc((width * 4 + 1) * height);

const letters = {
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  C: ["01111", "10000", "10000", "10000", "10000", "10000", "01111"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"]
};

function setPixel(x, y, r, g, b, a = 255) {
  if (x < 0 || x >= width || y < 0 || y >= height) return;
  const i = y * (width * 4 + 1) + 1 + x * 4;
  data[i] = r;
  data[i + 1] = g;
  data[i + 2] = b;
  data[i + 3] = a;
}

function rect(x, y, w, h, color) {
  for (let yy = y; yy < y + h; yy++) {
    for (let xx = x; xx < x + w; xx++) setPixel(xx, yy, ...color);
  }
}

function circle(cx, cy, radius, color) {
  const r2 = radius * radius;
  for (let y = cy - radius; y <= cy + radius; y++) {
    for (let x = cx - radius; x <= cx + radius; x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= r2) setPixel(x, y, ...color);
    }
  }
}

function drawLetter(letter, x, y, scale, color, shadow) {
  const pattern = letters[letter];
  pattern.forEach((row, ry) => {
    [...row].forEach((cell, rx) => {
      if (cell !== "1") return;
      rect(x + rx * scale + 10, y + ry * scale + 10, scale, scale, shadow);
      rect(x + rx * scale, y + ry * scale, scale, scale, color);
    });
  });
}

for (let y = 0; y < height; y++) {
  data[y * (width * 4 + 1)] = 0;
  for (let x = 0; x < width; x++) {
    const cx = x - width / 2;
    const cy = y - height / 2;
    const angle = Math.atan2(cy, cx);
    const radius = Math.sqrt(cx * cx + cy * cy) / 760;
    const stripe = Math.floor((angle + Math.PI) / (Math.PI / 9)) % 3;
    const glow = Math.max(0, 1 - radius);
    const base = stripe === 0 ? [255, 47, 109] : stripe === 1 ? [0, 215, 255] : [255, 208, 41];
    const vignette = Math.max(.24, 1 - radius * .65);
    setPixel(
      x,
      y,
      Math.round((base[0] * .55 + 28 * .45 + glow * 70) * vignette),
      Math.round((base[1] * .55 + 5 * .45 + glow * 60) * vignette),
      Math.round((base[2] * .55 + 35 * .45 + glow * 80) * vignette)
    );
  }
}

for (let i = 0; i < 58; i++) {
  const x = Math.floor((i * 223) % width);
  const y = Math.floor((i * 137) % height);
  circle(x, y, 8 + (i % 12), [255, 255, 255, 55 + (i % 4) * 20]);
}

rect(128, 80, 1024, 560, [8, 2, 22, 168]);
rect(142, 94, 996, 532, [255, 255, 255, 36]);
rect(166, 116, 948, 488, [0, 0, 0, 82]);

const scale = 42;
const start = 210;
drawLetter("T", start, 178, scale, [255, 208, 41, 255], [255, 47, 109, 255]);
drawLetter("C", start + 235, 178, scale, [255, 255, 255, 255], [0, 215, 255, 255]);
drawLetter("I", start + 470, 178, scale, [255, 208, 41, 255], [255, 47, 109, 255]);
drawLetter("C", start + 705, 178, scale, [255, 255, 255, 255], [0, 215, 255, 255]);

rect(325, 555, 630, 24, [255, 208, 41, 255]);
rect(388, 590, 504, 10, [0, 215, 255, 255]);

function chunk(type, body) {
  const header = Buffer.alloc(8);
  header.writeUInt32BE(body.length, 0);
  header.write(type, 4);
  const crc = crc32(Buffer.concat([Buffer.from(type), body]));
  const footer = Buffer.alloc(4);
  footer.writeUInt32BE(crc >>> 0, 0);
  return Buffer.concat([header, body, footer]);
}

function crc32(buffer) {
  let c = ~0;
  for (let i = 0; i < buffer.length; i++) {
    c ^= buffer[i];
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  return ~c;
}

const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(width, 0);
ihdr.writeUInt32BE(height, 4);
ihdr[8] = 8;
ihdr[9] = 6;
const png = Buffer.concat([
  signature,
  chunk("IHDR", ihdr),
  chunk("IDAT", zlib.deflateSync(data, { level: 9 })),
  chunk("IEND", Buffer.alloc(0))
]);

fs.writeFileSync("assets/TCIC-placeholder.png", png);
console.log(`wrote assets/TCIC-placeholder.png (${Math.round(png.length / 1024)} KB)`);
