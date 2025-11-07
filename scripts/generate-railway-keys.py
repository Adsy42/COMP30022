#!/usr/bin/env python3
"""
Generate secure random keys for Railway deployment.
Run this script to generate FLASK_SECRET_KEY and JWT_SECRET_KEY.
"""
import secrets

print("=" * 60)
print("🔐 Railway Security Keys Generator")
print("=" * 60)
print()
print("Copy these values to your Railway Backend service variables:")
print()
print("-" * 60)
print("FLASK_SECRET_KEY")
print("-" * 60)
flask_key = secrets.token_urlsafe(32)
print(flask_key)
print()
print("-" * 60)
print("JWT_SECRET_KEY")
print("-" * 60)
jwt_key = secrets.token_urlsafe(32)
print(jwt_key)
print()
print("=" * 60)
print("⚠️  IMPORTANT: Keep these keys secure!")
print("    Do NOT commit them to git")
print("    Only add them to Railway environment variables")
print("=" * 60)

