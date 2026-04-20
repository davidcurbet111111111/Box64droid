// non-root.js
const { execSync } = require("child_process");
const fs = require("fs");

function run(cmd) {
  try {
    execSync(cmd, { stdio: "inherit", shell: "/data/data/com.termux/files/usr/bin/bash" });
  } catch (e) {
    console.error("❌ Failed:", cmd);
  }
}

// 📦 Install packages
function packages() {
  run("pkg install x11-repo -y");
  run("pkg install pulseaudio wget xkeyboard-config proot-distro termux-x11-nightly termux-am -y");
}

// 🧹 Remove old version
function checkPrevVersion() {
  const config = "/sdcard/Box64Droid";

  if (fs.existsSync(config)) {
    run(`rm -rf ${config}`);
  }

  run("proot-distro remove ubuntu-box64droid");
}

// 📁 Install rootfs
function installRootfs() {
  const base = "/data/data/com.termux/files/usr/var/lib/proot-distro";

  // Create directories
  fs.mkdirSync(`${base}/installed-rootfs/ubuntu`, { recursive: true });

  console.log("⬇️ Downloading rootfs...");
  run("wget -q --show-progress https://github.com/Ilya114/Box64Droid/releases/download/stable/box64droid-rootfs.tar.xz");

  console.log("📦 Restoring rootfs...");
  run("proot-distro restore box64droid-rootfs.tar.xz");
}

// ⚙️ Download scripts
function scripts() {
  console.log("⬇️ Downloading scripts...");

  run("wget https://raw.githubusercontent.com/Ilya114/Box64Droid/main/scripts/non-root/box64droid");
  run("wget https://raw.githubusercontent.com/Ilya114/Box64Droid/main/scripts/non-root/start-box64droid");

  run("chmod +x start-box64droid box64droid");
  run("mv box64droid start-box64droid $PREFIX/bin/");
}

// 🗑 Cleanup
function clearWaste() {
  run("rm -f box64droid-rootfs.tar.xz install non-root.js");
  run("clear");
}

// 📁 Storage permission
function storage() {
  const path = "/data/data/com.termux/files/home/storage";

  if (!fs.existsSync(path)) {
    console.log("📁 Requesting storage permission...");
    run("termux-setup-storage");
  }
}

// ===== MAIN =====

run("clear");

console.log("🚀 Starting Box64Droid installation...");
console.log("Please allow storage permission!\n");

storage();

console.log("\n📦 Installing packages...\n");
packages();

console.log("\n🧹 Checking for older versions...\n");
checkPrevVersion();

console.log("\n📥 Installing rootfs...\n");
installRootfs();

console.log("\n⚙️ Setting up scripts...\n");
scripts();

console.log("\n🗑 Cleaning up...\n");
clearWaste();

console.log("✅ Installation finished!");
console.log("Run: box64droid --start");
console.log("Help: box64droid --help\n");

console.log("If everything works, Wine + 7-Zip should start.");
