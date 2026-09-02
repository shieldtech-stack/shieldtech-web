# SHIELDTECH — one-time JSONBin bin seeder.
#
# Creates a PUBLIC bin on jsonbin.io pre-loaded with the 13 shop products
# from content/shop.json. A public bin can be READ by anyone with NO key
# (perfect for the public shop page), while writes use your master key.
#
# SECURITY: your X-Master-Key is read ONLY from the environment variable
# below. It is never written to any file and never shown. After the bin is
# created you should remove it from your terminal history.
#
# Usage (from PowerShell in this folder):
#   $env:JSONBIN_KEY = "<your X-Master-Key>"
#   python tools/seed_bin.py
#
# It prints:
#   * the new BIN ID  (paste this into admin/shop config or tell the assistant)
#   * a preview of the first product (sanity check), and the bin's public URL.

import json
import os
import sys
import urllib.request

KEY = os.environ.get("JSONBIN_KEY", "").strip().strip("\"'")
if not KEY:
    sys.exit("ERROR: set $env:JSONBIN_KEY first, e.g.\n  $env:JSONBIN_KEY = '<key>'\nthen run this script again.")

# Sanity: a valid X-Master-Key is a long base64-ish string (usually 100+ chars).
if len(KEY) < 40:
    print("WARNING: the key looks too short to be a valid X-Master-Key ({0} chars).".format(len(KEY)))

with open("content/shop.json", "r", encoding="utf-8") as f:
    data = json.load(f)

body = json.dumps(data).encode("utf-8")
req = urllib.request.Request(
    "https://api.jsonbin.io/v3/b",
    data=body,
    method="POST",
    headers={
        "Content-Type": "application/json",
        "X-Master-Key": KEY,
        "X-Bin-Private": "false",   # public: readable without a key
        "X-Bin-Name": "shieldtech-shop",
        # A normal browser user-agent so Cloudflare (403/1010) doesn't block
        # the scripted request. API answers 403/error 1010 to the default
        # "Python-urllib/3.x" user-agent otherwise.
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/122.0 Safari/537.36"
        ),
    },
)

try:
    with urllib.request.urlopen(req, timeout=30) as resp:
        result = json.loads(resp.read().decode("utf-8"))
except urllib.error.HTTPError as e:
    sys.exit("HTTP error {}: {}".format(e.code, e.read().decode("utf-8", "ignore")))

meta = result.get("metadata", {})
bin_id = meta.get("id", "UNKNOWN")

print("BIN ID  :", bin_id)
print("Create URL:", meta.get("createUrl", "?"))
print("Public read URL: https://api.jsonbin.io/v3/b/{}/latest".format(bin_id))
print("Products stored:", len(data.get("products", [])))
print("First product preview:", json.dumps(data["products"][0], indent=2))
print()
print("Give this BIN ID to your assistant (it is not secret).")
