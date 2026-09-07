# -*- coding: utf-8 -*-
import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

import urllib.request
import urllib.parse
import re

p = urllib.parse.quote('กาฬสินธุ์')
a = urllib.parse.quote('เมืองกาฬสินธุ์')
t = urllib.parse.quote('กาฬสินธุ์')
url = f"https://www.fastledchecker.com/?province={p}&ampur={a}&tumbol={t}"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req, timeout=10).read().decode('utf-8', errors='ignore')
    cards = re.findall(r'<a[^>]+href="(/asset/[^"]+)"', html)
    print(f"Query with tumbol=กาฬสินธุ์: found {len(cards)} cards on {url}")
except Exception as e:
    print("Error:", e)
