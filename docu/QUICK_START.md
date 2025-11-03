# ⚡ Balkly - Quick Start Guide

Choose your installation method:

---

## 🚀 Ubuntu 22 VPS (Recommended)

### One Command - Installs Everything:

```bash
curl -fsSL https://raw.githubusercontent.com/XProject-hub/Balkly/main/install-vps.sh | sudo bash
```

**Time**: 5-10 minutes  
**Result**: Complete installation!  
**Access**: http://YOUR_SERVER_IP

---

## 💻 Local Development

### Linux/Mac:
```bash
git clone https://github.com/XProject-hub/Balkly.git
cd Balkly
chmod +x setup.sh
./setup.sh
```

### Windows:
```bash
git clone https://github.com/XProject-hub/Balkly.git
cd Balkly
setup.bat
```

**Access**: http://localhost

---

## 🔧 After Installation

### 1. Add Stripe Keys
Edit `balkly-api/.env`:
```env
STRIPE_KEY=pk_test_...
STRIPE_SECRET=sk_test_...
```

### 2. Create MinIO Bucket
- Visit: http://YOUR_IP:9001
- Login: balkly / balkly_minio_pass
- Create: balkly-media

### 3. Login & Test
- Visit: http://YOUR_IP
- Login: admin@balkly.com / password123

---

## 📚 Full Guides

- **VPS Install**: [VPS_INSTALLATION.md](VPS_INSTALLATION.md)
- **Local Setup**: [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **All Docs**: [INDEX.md](INDEX.md)

---

**Platform ready in minutes!** 🎊

