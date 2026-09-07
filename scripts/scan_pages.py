# -*- coding: utf-8 -*-
import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

import urllib.request
import urllib.parse
import re

BASE_URL = "https://www.fastledchecker.com"
PROVINCE_ENCODED = urllib.parse.quote("กาฬสินธุ์")

# Check pages 1 to 20 for Kalasin to see total unique real assets
print("Scanning FastLEDChecker general pages for Kalasin...")
all_assets = set()
for page in range(1, 15):
    url = f"{BASE_URL}/?province={PROVINCE_ENCODED}&page={page}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        html = urllib.request.urlopen(req, timeout=10).read().decode('utf-8', errors='ignore')
        cards = re.findall(r'<a[^>]+href="(/asset/[^"]+)"', html)
        all_assets.update(cards)
        print(f"Page {page}: found {len(cards)} cards. Cumulative unique: {len(all_assets)}")
    except Exception as e:
        print(f"Page {page} error: {e}")
        break

print(f"Total unique real asset URLs found across 14 pages: {len(all_assets)}")
