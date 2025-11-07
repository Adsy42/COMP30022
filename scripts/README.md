# 🔧 Deployment Helper Scripts

This directory contains helper scripts for Railway deployment configuration.

## 📜 Scripts

### `generate-railway-keys.py`

Generates secure random keys for Railway backend service.

**Usage:**
```bash
python scripts/generate-railway-keys.py
```

**Output:**
- `FLASK_SECRET_KEY` - For Flask session encryption
- `JWT_SECRET_KEY` - For JWT token signing

**Example:**
```bash
$ python scripts/generate-railway-keys.py

============================================================
🔐 Railway Security Keys Generator
============================================================

Copy these values to your Railway Backend service variables:

------------------------------------------------------------
FLASK_SECRET_KEY
------------------------------------------------------------
xK3mN9pQ2wE5rT8yU1iO4pA7sD0fG3hJ5kL8zX2cV6bN9mQ1wE4rT7yU0iO3pA6s

------------------------------------------------------------
JWT_SECRET_KEY
------------------------------------------------------------
aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT1uV2wX3yZ4aB5cD6eF7gH8iJ9kL0mN1oP2qR

============================================================
⚠️  IMPORTANT: Keep these keys secure!
    Do NOT commit them to git
    Only add them to Railway environment variables
============================================================
```

**Notes:**
- Generates cryptographically secure random strings
- Each run generates different keys
- Keys are 32 bytes encoded as URL-safe base64
- Always use fresh keys for production deployments
- Never reuse keys across environments

---

## 🔒 Security Best Practices

1. **Never commit keys to git**
   - Keys should only exist in Railway environment variables
   - Don't add them to `.env` files that might be committed

2. **Generate new keys for each environment**
   - Development, staging, and production should have different keys
   - Never copy production keys to development

3. **Rotate keys periodically**
   - Generate new keys every few months
   - After any security incident
   - When team members leave

4. **Store keys securely**
   - Use password managers for backup
   - Limit access to production keys
   - Use Railway's secrets management

---

## 📝 Alternative Key Generation Methods

If you can't run Python scripts, you can generate keys using:

### OpenSSL (Linux/Mac/Git Bash)
```bash
openssl rand -base64 32
```

### PowerShell (Windows)
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### Online (Not recommended for production)
- Only use for development/testing
- Never use online generators for production keys
- Always assume online-generated keys are compromised

---

## 🎯 Usage in Railway

After generating keys:

1. Go to Railway dashboard
2. Click on **Backend** service
3. Click **Variables** tab
4. Add two new variables:
   - `FLASK_SECRET_KEY` = [generated key 1]
   - `JWT_SECRET_KEY` = [generated key 2]
5. Click "Redeploy"

The backend will use these keys for:
- Encrypting session cookies
- Signing JWT authentication tokens
- Securing user authentication

---

## ⚠️ Troubleshooting

### "ModuleNotFoundError: No module named 'secrets'"
- You're using Python 2.x (secrets module requires Python 3.6+)
- Solution: Use `python3 scripts/generate-railway-keys.py`

### Keys not working in Railway
- Make sure you copied the entire key (no spaces or newlines)
- Verify variable names are exactly: `FLASK_SECRET_KEY` and `JWT_SECRET_KEY`
- Redeploy backend service after adding variables

### "Invalid token" errors after deploying new keys
- This is expected - all existing sessions are invalidated
- Users need to log in again
- Clear browser cookies/local storage

---

## 📚 More Information

- See `../.railway-env-template.md` for all environment variables
- See `../IMPLEMENT-NOW.md` for complete deployment guide
- See `../RAILWAY-QUICK-FIX.md` for troubleshooting

