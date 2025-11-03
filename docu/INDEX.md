# 📚 Balkly Platform - Documentation Index

**Complete guides for development, deployment, and usage**

---

## 🎯 Start Here

**New to Balkly?** → [**START_HERE.md**](START_HERE.md) ⭐

**Ubuntu 22 VPS?** → [**VPS_INSTALLATION.md**](VPS_INSTALLATION.md) ⭐⭐⭐

**Quick setup**: Run `../setup.sh` or use one-command VPS install

---

## 📖 Documentation Guides

| # | Guide | Purpose | Target |
|---|-------|---------|--------|
| 1 | [**VPS_INSTALLATION**](VPS_INSTALLATION.md) ⭐⭐⭐ | One-command VPS install | Ubuntu 22 VPS |
| 2 | [**START_HERE**](START_HERE.md) ⭐ | Quick start guide | Everyone |
| 3 | [**SETUP_GUIDE**](SETUP_GUIDE.md) | Local development | Developers |
| 4 | [**DEPLOYMENT_GUIDE**](DEPLOYMENT_GUIDE.md) | Manual VPS deploy | DevOps |
| 5 | [**STRIPE_INTEGRATION**](STRIPE_INTEGRATION_GUIDE.md) | Payment config | Developers |
| 6 | [**AUTHENTICATION**](AUTHENTICATION_GUIDE.md) | Auth features | Developers |
| 7 | [**VIDEO_HERO**](VIDEO_HERO_GUIDE.md) | Video background | Designers |
| 8 | [**LAUNCH_CHECKLIST**](LAUNCH_CHECKLIST.md) | Pre-launch tasks | Everyone |
| 9 | [**CURRENT_STATUS**](CURRENT_STATUS.md) | Feature status | Everyone |

---

## ⚡ Quick Commands

### Ubuntu 22 VPS (One Command):
```bash
curl -fsSL https://raw.githubusercontent.com/XProject-hub/Balkly/main/install-vps.sh | sudo bash
```

### Local Development:
```bash
./setup.sh  # Linux/Mac
setup.bat   # Windows
```

### Access After Install:
- Frontend: http://YOUR_SERVER_IP
- API: http://YOUR_SERVER_IP/api/v1
- Admin: http://YOUR_SERVER_IP/admin

**Login**: admin@balkly.com / password123

---

## 🎯 By Task

| Task | Guide | Time |
|------|-------|------|
| Install on Ubuntu VPS | [VPS_INSTALLATION](VPS_INSTALLATION.md) | 5-10 min |
| Set up locally | [SETUP_GUIDE](SETUP_GUIDE.md) | 5 min |
| Manual VPS deploy | [DEPLOYMENT_GUIDE](DEPLOYMENT_GUIDE.md) | 30 min |
| Configure Stripe | [STRIPE_INTEGRATION](STRIPE_INTEGRATION_GUIDE.md) | 2 min |
| Enable 2FA/social | [AUTHENTICATION](AUTHENTICATION_GUIDE.md) | 5 min |
| Add video hero | [VIDEO_HERO](VIDEO_HERO_GUIDE.md) | 5 min |
| Pre-launch check | [LAUNCH_CHECKLIST](LAUNCH_CHECKLIST.md) | 30 min |

---

## 🚀 Deployment Paths

### Path 1: Ubuntu 22 VPS (Fastest) ⭐
```bash
curl -fsSL https://raw.githubusercontent.com/XProject-hub/Balkly/main/install-vps.sh | sudo bash
```
**Time**: 5-10 minutes  
**Result**: Fully installed platform!

### Path 2: Manual VPS Setup
Follow: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)  
**Time**: 30 minutes

### Path 3: Local Development
Follow: [SETUP_GUIDE.md](SETUP_GUIDE.md)  
**Time**: 5 minutes

---

## 📊 Platform Status

**Completion**: 95%  
**Status**: Production-Ready  
**VPS Ready**: YES!  
**Can Launch**: YES!

See [CURRENT_STATUS.md](CURRENT_STATUS.md) for details.

---

## 🔧 After Installation

1. Configure Stripe keys
2. Set up email SMTP
3. Create MinIO bucket
4. Add SSL certificate
5. Test platform
6. **LAUNCH!** 🚀

---

**GitHub**: https://github.com/XProject-hub/Balkly  
**Back to main**: [../README.md](../README.md)
