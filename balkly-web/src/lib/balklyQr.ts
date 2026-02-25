import QRCode from "qrcode";

/**
 * Generates a stylized Balkly QR code on canvas:
 * - Dark navy background (#0f172a)
 * - Neon cyan dots with rounded corners
 * - Custom eye style (rounded outer, solid inner)
 * - Balkly "B" logo in center
 * - High error correction (H) to survive the center logo
 */
export async function generateBalklyQR(
  url: string,
  size = 500
): Promise<string> {
  // Build QR data matrix
  const qr = QRCode.create(url, { errorCorrectionLevel: "H" });
  const { data: modules, size: qrSize } = qr.modules;

  const margin     = Math.round(size * 0.06);
  const cellSize   = (size - margin * 2) / qrSize;
  const radius     = cellSize * 0.38;

  const canvas  = document.createElement("canvas");
  canvas.width  = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // ÔöÇÔöÇ Background ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, size, size);

  // ÔöÇÔöÇ Helpers ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
  const isEyeZone = (row: number, col: number): boolean => {
    const s = qrSize;
    // top-left, top-right, bottom-left finder patterns (7├ù7)
    if (row < 8 && col < 8) return true;
    if (row < 8 && col >= s - 8) return true;
    if (row >= s - 8 && col < 8) return true;
    return false;
  };

  const drawRoundedRect = (
    x: number, y: number, w: number, h: number, r: number, fill: string
  ) => {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
  };

  // ÔöÇÔöÇ Draw data modules (skip eye zones) ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
  for (let row = 0; row < qrSize; row++) {
    for (let col = 0; col < qrSize; col++) {
      if (isEyeZone(row, col)) continue;
      if (!modules[row * qrSize + col]) continue;

      const x = margin + col * cellSize;
      const y = margin + row * cellSize;

      // Neon cyan with slight gradient effect per module
      const grad = ctx.createLinearGradient(x, y, x + cellSize, y + cellSize);
      grad.addColorStop(0, "#00e5ff");
      grad.addColorStop(1, "#7c3aed");
      ctx.fillStyle = grad;

      ctx.beginPath();
      ctx.roundRect(
        x + 0.5,
        y + 0.5,
        cellSize - 1,
        cellSize - 1,
        radius
      );
      ctx.fill();
    }
  }

  // ÔöÇÔöÇ Draw the three finder (eye) patterns ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
  const drawEye = (startRow: number, startCol: number) => {
    const ox = margin + startCol * cellSize;
    const oy = margin + startRow * cellSize;
    const outerW = 7 * cellSize;
    const outerR = cellSize * 1.2;

    // Outer ring ÔÇô cyan
    const grad = ctx.createLinearGradient(ox, oy, ox + outerW, oy + outerW);
    grad.addColorStop(0, "#00e5ff");
    grad.addColorStop(1, "#7c3aed");
    drawRoundedRect(ox, oy, outerW, outerW, outerR, "#0f172a"); // clear bg first
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(ox, oy, outerW, outerW, outerR);
    ctx.fill();

    // Inner white gap
    drawRoundedRect(
      ox + cellSize,
      oy + cellSize,
      5 * cellSize,
      5 * cellSize,
      cellSize * 0.6,
      "#0f172a"
    );

    // Inner filled square ÔÇô neon
    const iGrad = ctx.createLinearGradient(
      ox + 2 * cellSize, oy + 2 * cellSize,
      ox + 5 * cellSize, oy + 5 * cellSize
    );
    iGrad.addColorStop(0, "#00e5ff");
    iGrad.addColorStop(1, "#7c3aed");
    ctx.fillStyle = iGrad;
    ctx.beginPath();
    ctx.roundRect(
      ox + 2 * cellSize,
      oy + 2 * cellSize,
      3 * cellSize,
      3 * cellSize,
      cellSize * 0.5
    );
    ctx.fill();
  };

  drawEye(0, 0);
  drawEye(0, qrSize - 7);
  drawEye(qrSize - 7, 0);

  // ÔöÇÔöÇ Center Balkly "B" logo ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
  const logoSize  = size * 0.16;
  const logoPad   = logoSize * 0.18;
  const cx        = size / 2;
  const cy        = size / 2;
  const lr        = logoSize * 0.22;

  // Logo background ÔÇô dark rounded square with subtle border
  ctx.shadowColor   = "#00e5ff";
  ctx.shadowBlur    = 12;
  drawRoundedRect(
    cx - logoSize / 2 - logoPad,
    cy - logoSize / 2 - logoPad,
    logoSize + logoPad * 2,
    logoSize + logoPad * 2,
    lr + logoPad,
    "#0f172a"
  );
  ctx.shadowBlur = 0;

  // Logo border gradient
  const bGrad = ctx.createLinearGradient(
    cx - logoSize / 2, cy - logoSize / 2,
    cx + logoSize / 2, cy + logoSize / 2
  );
  bGrad.addColorStop(0, "#00e5ff");
  bGrad.addColorStop(1, "#7c3aed");
  ctx.strokeStyle = bGrad;
  ctx.lineWidth   = 2;
  ctx.beginPath();
  ctx.roundRect(
    cx - logoSize / 2 - logoPad,
    cy - logoSize / 2 - logoPad,
    logoSize + logoPad * 2,
    logoSize + logoPad * 2,
    lr + logoPad
  );
  ctx.stroke();

  // "B" letter
  const tGrad = ctx.createLinearGradient(cx - logoSize / 2, cy - logoSize / 2, cx + logoSize / 2, cy + logoSize / 2);
  tGrad.addColorStop(0, "#00e5ff");
  tGrad.addColorStop(1, "#a78bfa");
  ctx.fillStyle = tGrad;
  ctx.shadowColor  = "#00e5ff";
  ctx.shadowBlur   = 8;
  ctx.font         = `bold ${Math.round(logoSize * 0.85)}px 'Helvetica Neue', Arial, sans-serif`;
  ctx.textAlign    = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("B", cx, cy + logoSize * 0.04);
  ctx.shadowBlur = 0;

  return canvas.toDataURL("image/png");
}
