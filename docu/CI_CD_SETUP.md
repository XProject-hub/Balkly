# 🚀 CI/CD Setup - Automated Deployment

## ✅ What's Included

**GitHub Actions workflow** for automated deployment to your VPS.

**Location**: `.github/workflows/deploy.yml`

---

## 🔧 Setup Instructions

### 1. **Add GitHub Secrets**

Go to your repository: https://github.com/XProject-hub/Balkly

**Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these 3 secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `VPS_HOST` | `balkly.live` | Your VPS IP or domain |
| `VPS_USER` | `root` | SSH username |
| `VPS_SSH_KEY` | `<your private key>` | SSH private key |

---

### 2. **Get SSH Private Key**

On your **local machine** (not VPS):

```bash
# Generate SSH key if you don't have one:
ssh-keygen -t rsa -b 4096 -C "deploy@balkly.live"

# Copy the PRIVATE key:
cat ~/.ssh/id_rsa

# Copy entire output (including BEGIN and END lines)
```

**Add this to GitHub as `VPS_SSH_KEY` secret**

### 3. **Add Public Key to VPS**

On your **VPS**:

```bash
# Create .ssh directory if needed
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Add your public key
nano ~/.ssh/authorized_keys

# Paste your PUBLIC key (from: cat ~/.ssh/id_rsa.pub)
# Save and exit

# Set permissions
chmod 600 ~/.ssh/authorized_keys
```

---

## ⚡ How It Works

**Every time you push to `main` branch:**

1. ✅ GitHub Actions triggers
2. ✅ Connects to your VPS via SSH
3. ✅ Pulls latest code
4. ✅ Installs dependencies
5. ✅ Runs migrations
6. ✅ Clears caches
7. ✅ Restarts services
8. ✅ Deployment complete!

**Manual Deployment:**

Go to **Actions** tab → **Deploy to VPS** → **Run workflow**

---

## 📊 Deployment Status

Check deployment status:
- GitHub → **Actions** tab
- See build logs
- Get notifications on failures

---

## 🎯 Benefits

- ✅ **Automatic deployments** (push → deploy)
- ✅ **No manual SSH needed**
- ✅ **Consistent deployment**
- ✅ **Rollback capability** (revert git commit)
- ✅ **Build logs** for debugging

---

**CI/CD is ready - just add the GitHub secrets!** ✅

