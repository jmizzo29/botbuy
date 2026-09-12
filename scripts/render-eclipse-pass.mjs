import { execFileSync } from "node:child_process";
import { mkdirSync, copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const kit = join(root, "brand/logo-eclipse-pass");

function rsvg(src, dest, width, height) {
  mkdirSync(dirname(dest), { recursive: true });
  const args = ["-w", String(width), "-h", String(height), "-o", dest, src];
  execFileSync("rsvg-convert", args);
}

function runPython(code) {
  execFileSync("python3", ["-c", code], { cwd: root });
}

const mark = join(kit, "botbuyer-mark.svg");
const header = join(kit, "botbuyer-logo-header.svg");
const primary = join(kit, "botbuyer-logo-primary.svg");
const app = join(kit, "app-icon-master.svg");
const fav = join(kit, "favicon/favicon.svg");
const og = join(kit, "og/og-1200x630.svg");

rsvg(header, join(kit, "png/botbuyer-lockup-header-1x.png"), 260, 56);
rsvg(header, join(kit, "png/botbuyer-lockup-header-2x.png"), 520, 112);
rsvg(primary, join(kit, "png/botbuyer-lockup-1x.png"), 420, 160);
rsvg(primary, join(kit, "png/botbuyer-lockup-2x.png"), 840, 320);
rsvg(mark, join(kit, "png/botbuyer-mark.png"), 256, 256);
rsvg(app, join(kit, "app-icon/icon-128.png"), 128, 128);
rsvg(app, join(kit, "app-icon/icon-152.png"), 152, 152);
rsvg(app, join(kit, "app-icon/icon-180.png"), 180, 180);
rsvg(app, join(kit, "app-icon/icon-192.png"), 192, 192);
rsvg(app, join(kit, "app-icon/icon-512.png"), 512, 512);
rsvg(app, join(kit, "app-icon/icon-1024.png"), 1024, 1024);
rsvg(fav, join(kit, "favicon/favicon-16.png"), 16, 16);
rsvg(fav, join(kit, "favicon/favicon-32.png"), 32, 32);
rsvg(fav, join(kit, "favicon/favicon-48.png"), 48, 48);
rsvg(app, join(kit, "favicon/apple-touch-icon.png"), 180, 180);
rsvg(og, join(kit, "og/og-1200x630.png"), 1200, 630);

runPython(`
from PIL import Image
from pathlib import Path
kit = Path("brand/logo-eclipse-pass")
sizes = [16, 32, 48]
imgs = [Image.open(kit / f"favicon/favicon-{s}.png").convert("RGBA") for s in sizes]
imgs[0].save(kit / "favicon/favicon.ico", sizes=[(s, s) for s in sizes], append_images=imgs[1:])
src = Image.open(kit / "app-icon/icon-512.png").convert("RGBA")
src.save(kit / "app-icon/icon-512-maskable.png")
print("ico+maskable ok")
`)

const publicKit = join(root, "public/brand/logo-eclipse-pass");
mkdirSync(publicKit, { recursive: true });
execFileSync("cp", ["-a", `${kit}/.`, publicKit]);

copyFileSync(join(kit, "favicon/favicon.svg"), join(root, "public/favicon.svg"));
copyFileSync(join(kit, "favicon/favicon.ico"), join(root, "public/favicon.ico"));
copyFileSync(join(kit, "og/og-1200x630.png"), join(root, "public/brand/og-1200x630.png"));
copyFileSync(join(kit, "favicon/apple-touch-icon.png"), join(root, "public/icons/apple-touch-icon.png"));
for (const name of [
  "icon-128.png",
  "icon-152.png",
  "icon-180.png",
  "icon-192.png",
  "icon-512.png",
  "icon-1024.png",
  "icon-512-maskable.png",
]) {
  copyFileSync(join(kit, "app-icon", name), join(root, "public/icons", name));
}
for (const name of ["favicon-16.png", "favicon-32.png", "favicon-48.png"]) {
  copyFileSync(join(kit, "favicon", name), join(root, "public/icons", name));
}

copyFileSync(join(kit, "botbuyer-mark.svg"), join(root, "public/brand/botbuy-mark.svg"));
copyFileSync(join(kit, "botbuyer-logo-header.svg"), join(root, "public/brand/botbuy-logo-header-light.svg"));
copyFileSync(join(kit, "botbuyer-logo-header.svg"), join(root, "public/brand/botbuy-logo-header.svg"));
copyFileSync(join(kit, "botbuyer-logo-primary.svg"), join(root, "public/brand/botbuy-logo-primary.svg"));
copyFileSync(join(kit, "botbuyer-logo-primary-dark-bg.svg"), join(root, "public/brand/botbuy-logo-primary-dark-bg.svg"));
copyFileSync(join(kit, "app-icon-master.svg"), join(root, "public/brand/botbuy-app-icon.svg"));
copyFileSync(join(kit, "botbuyer-mark.svg"), join(root, "about/assets/mark-eclipse-pass.svg"));
copyFileSync(join(kit, "botbuyer-mark.svg"), join(root, "public/about/assets/mark-eclipse-pass.svg"));

writeFileSync(join(root, "public/brand/botbuy-logo-reverse-teal.svg"), readFileSync(join(kit, "botbuyer-logo-primary-dark-bg.svg")));

console.log("eclipse-pass rasters + public copies written");
