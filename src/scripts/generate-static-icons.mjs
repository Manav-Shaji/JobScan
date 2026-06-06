import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPng(width, height, drawFn) {
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type (RGBA)
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  
  // CRC-32 implementation
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) {
        c = 0xedb88320 ^ (c >>> 1);
      } else {
        c = c >>> 1;
      }
    }
    crcTable[n] = c;
  }

  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }
  
  const makeChunk = (type, data) => {
    const lenBuf = Buffer.alloc(4);
    lenBuf.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcVal = crc32(Buffer.concat([typeBuf, data]));
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crcVal, 0);
    return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
  };
  
  const ihdrChunk = makeChunk('IHDR', ihdrData);
  
  // IDAT chunk
  const rowSize = 1 + width * 4;
  const scanlines = Buffer.alloc(height * rowSize);
  for (let y = 0; y < height; y++) {
    scanlines[y * rowSize] = 0; // Filter None
    for (let x = 0; x < width; x++) {
      const color = drawFn(x, y, width, height);
      const pixelOffset = y * rowSize + 1 + x * 4;
      scanlines[pixelOffset] = color.r;
      scanlines[pixelOffset + 1] = color.g;
      scanlines[pixelOffset + 2] = color.b;
      scanlines[pixelOffset + 3] = color.a;
    }
  }
  
  const compressed = zlib.deflateSync(scanlines);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));
  
  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const drawFn = (x, y, w, h) => {
  const nx = (x - w / 2) / (w / 2);
  const ny = (y - h / 2) / (h / 2);
  const dist = Math.sqrt(nx * nx + ny * ny);
  
  // Background radial gradient from slate blue to near-black
  const bgRatio = Math.min(1, dist);
  const r = Math.round(15 * (1 - bgRatio) + 2 * bgRatio);
  const g = Math.round(23 * (1 - bgRatio) + 6 * bgRatio);
  const b = Math.round(42 * (1 - bgRatio) + 23 * bgRatio);
  const a = 255;
  
  const absX = Math.abs(nx);
  let isShield = false;
  if (absX <= 0.45 && ny >= -0.55 && ny <= 0.6) {
    const bottomCurve = 0.1 + 0.5 * (1.0 - (absX / 0.45) * (absX / 0.45));
    if (ny <= bottomCurve) {
      isShield = true;
    }
  }
  
  if (isShield) {
    const shieldRatio = (ny + 0.55) / 1.15;
    const sr = Math.round(56 * (1 - shieldRatio) + 16 * shieldRatio);
    const sg = Math.round(189 * (1 - shieldRatio) + 185 * shieldRatio);
    const sb = Math.round(248 * (1 - shieldRatio) + 129 * shieldRatio);
    
    const borderThickness = 0.08;
    const isBorder = (absX > 0.37 || ny < -0.47 || (ny > 0.1 + 0.5 * (1.0 - (absX / 0.45) * (absX / 0.45)) - borderThickness));
    
    let isCheck = false;
    if (nx >= -0.2 && nx <= 0.25) {
      if (nx <= 0) {
        const lineY = -nx * 1.0 - 0.15;
        if (Math.abs(ny - lineY) < 0.08) isCheck = true;
      } else {
        const lineY = nx * 1.5 - 0.15;
        if (Math.abs(ny - lineY) < 0.08) isCheck = true;
      }
    }
    
    if (isBorder || isCheck) {
      return { r: sr, g: sg, b: sb, a: 255 };
    } else {
      return { r: 10, g: 15, b: 30, a: 255 };
    }
  }
  
  return { r, g, b, a };
};

const targets = [
  { path: 'extension/assets/icon16.png', size: 16 },
  { path: 'extension/assets/icon48.png', size: 48 },
  { path: 'extension/assets/icon128.png', size: 128 },
  { path: 'public/icon-192.png', size: 192 },
  { path: 'public/icon-512.png', size: 512 }
];

targets.forEach(t => {
  const dest = path.resolve(t.path);
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  const pngBuf = createPng(t.size, t.size, drawFn);
  fs.writeFileSync(dest, pngBuf);
  console.log(`Generated static icon: ${t.path} (${t.size}x${t.size})`);
});
