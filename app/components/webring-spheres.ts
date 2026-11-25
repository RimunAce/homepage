const palettes = [
  { dark: [70, 39, 63], light: [252, 193, 126], speed: 1 / 19, tilt: -.31 },
  { dark: [25, 46, 106], light: [163, 228, 255], speed: 1 / 11, tilt: .29 },
  { dark: [70, 27, 74], light: [253, 153, 141], speed: -1 / 15, tilt: -.48 },
  { dark: [18, 61, 89], light: [154, 219, 166], speed: 1 / 8, tilt: .43 },
];

const textureWidth = 256;
const textureHeight = 128;
const turn = Math.PI * 2;
const clamp = (value: number) => Math.max(0, Math.min(1, value));

function createTexture(variant: number) {
  const texture = new Uint8Array(textureWidth * textureHeight);

  for (let row = 0; row < textureHeight; row++) {
    const latitude = row / textureHeight;
    for (let col = 0; col < textureWidth; col++) {
      const longitude = col / textureWidth * turn;
      const wave = Math.sin(longitude * 3 + latitude * 21);
      const jet = Math.sin(latitude * (variant === 0 ? 66 : 37) + wave * .65);
      const clouds = Math.sin(longitude * 5 - latitude * 31)
        * Math.sin(longitude * 3 + latitude * 22 + wave);
      const flecks = Math.sin(longitude * 17 + latitude * 83 + wave * 2)
        * Math.sin(longitude * 11 - latitude * 133);
      const base = .51 + jet * (variant === 0 ? .22 : .12) + clouds * .16 + flecks * .05;
      const stormLongitude = Math.cos(longitude - variant);
      const storm = Math.exp((stormLongitude - 1) * 24 - ((latitude - .61) * 27) ** 2);
      texture[row * textureWidth + col] = clamp(base + storm * .29) * 255;
    }
  }

  return texture;
}

function createSphere(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d");
  if (!context) return null;

  const variant = Number(canvas.dataset.sphere) % palettes.length;
  const { dark, light, speed, tilt } = palettes[variant];
  const texture = createTexture(variant);
  const size = canvas.width;
  const image = context.createImageData(size, size);
  const pixels = image.data;
  const sphere: { offset: number; longitude: number; row: number; light: number; rim: number }[] = [];
  const sin = Math.sin(tilt);
  const cos = Math.cos(tilt);

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const x = (col + .5 - size / 2) / (size / 2 - 1);
      const y = (row + .5 - size / 2) / (size / 2 - 1);
      const radius = Math.hypot(x, y);
      if (radius > 1 + 1 / size) continue;

      const z = Math.sqrt(Math.max(0, 1 - radius ** 2));
      const axisY = Math.max(-1, Math.min(1, y * cos - x * sin));
      const offset = (row * size + col) * 4;
      pixels[offset + 3] = clamp((1 - radius) * size + 1) * 255;
      sphere.push({
        offset,
        longitude: (Math.atan2(x * cos + y * sin, z) / turn + .5) * textureWidth,
        row: Math.min(textureHeight - 1, Math.floor((Math.asin(axisY) / Math.PI + .5) * textureHeight)) * textureWidth,
        light: .24 + .89 * Math.max(0, -.48 * x - .54 * y + .69 * z),
        rim: (1 - z) ** 5 * (.12 + Math.max(0, -.48 * x - .54 * y) * .4),
      });
    }
  }

  return (seconds: number) => {
    const spin = (seconds * speed % 1) * textureWidth;
    for (const { offset, longitude, row, light: exposure, rim } of sphere) {
      const u = longitude + spin;
      const column = Math.floor(u);
      const a = texture[row + (column & 255)];
      const b = texture[row + ((column + 1) & 255)];
      const tone = (a + (b - a) * (u - column)) / 255;
      for (let channel = 0; channel < 3; channel++) {
        pixels[offset + channel] = (dark[channel] + (light[channel] - dark[channel]) * tone) * exposure
          + light[channel] * rim;
      }
    }
    context.putImageData(image, 0, 0);
  };
}

export function mountSpheres(section: Element) {
  const renderers = [...section.querySelectorAll<HTMLCanvasElement>("canvas[data-sphere]")]
    .map(createSphere);
  return (seconds: number) => renderers.forEach((draw) => draw?.(seconds));
}
