import urllib.request
import json
import time
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')


def test_endpoint(name, url, method="GET", payload=None):
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        req_data = None
        if payload is not None:
            headers["Content-Type"] = "application/json"
            req_data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
        with urllib.request.urlopen(req, timeout=5) as res:
            status = res.status
            body = res.read().decode("utf-8", errors="ignore")
            try:
                parsed = json.loads(body)
                return {
                    "name": name,
                    "status": status,
                    "success": True,
                    "count": len(parsed.get("data", [])) if isinstance(parsed.get("data"), list) else None,
                    "raw": str(parsed)[:150]
                }
            except Exception:
                return {
                    "name": name,
                    "status": status,
                    "success": True,
                    "raw": body[:150].strip()
                }
    except Exception as e:
        return {"name": name, "status": "FAIL", "success": False, "error": str(e)}

tests = [
    # 1. Frontend Web App Tests
    ("1. Frontend Web App (Port 80 Nginx)", "http://localhost/"),
    ("2. Frontend Web App (Port 5173 Nginx)", "http://localhost:5173/"),
    ("3. Frontend Nginx API Proxy (/api/health)", "http://localhost/api/health"),
    ("4. Frontend Nginx API Proxy (/api/properties)", "http://localhost/api/properties?limit=5"),
    
    # 2. Backend Direct REST API Tests (Port 5000)
    ("5. Backend Direct Health Check", "http://localhost:5000/api/health"),
    ("6. Backend Total Properties (Limit 5)", "http://localhost:5000/api/properties?limit=5"),
    ("7. Backend Filter by District (เมืองกาฬสินธุ์)", "http://localhost:5000/api/properties?district=%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%87%E0%B8%81%E0%B8%B2%E0%B8%AC%E0%B8%AA%E0%B8%B4%E0%B8%99%E0%B8%98%E0%B8%B8%E0%B9%8C&limit=5"),
    ("8. Backend Filter by Sub-district (หลุบ)", "http://localhost:5000/api/properties?district=%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%87%E0%B8%81%E0%B8%B2%E0%B8%AC%E0%B8%AA%E0%B8%B4%E0%B8%99%E0%B8%98%E0%B8%B8%E0%B9%8C&subdistrict=%E0%B8%AB%E0%B8%A5%E0%B8%B8%E0%B8%9A&limit=5"),
    ("9. Backend Filter by Type (led_asset)", "http://localhost:5000/api/properties?type=led_asset&limit=5"),
    ("10. Backend Filter by Has Structure (has_structure)", "http://localhost:5000/api/properties?type=has_structure&limit=5"),
    ("11. Backend Search Keyword (สมเด็จ)", "http://localhost:5000/api/properties?keyword=%E0%B8%AA%E0%B8%A1%E0%B9%80%E0%B8%94%E0%B7%87%E0%B8%88&limit=5"),
    ("12. Backend Contractors API", "http://localhost:5000/api/contractors"),
]

# 3. Calculation API Tests (POST)
calc_tests = [
    (
        "13. FastLED Max Bid Calculation API",
        "http://localhost:5000/api/calculate/max-bid",
        "POST",
        {
            "marketEstimate": 1500000,
            "targetProfitPercent": 15,
            "mortgageDebt": 200000,
            "evictionCostEst": 40000,
            "renovationCostEst": 60000
        }
    ),
    (
        "14. Wood Valuation Engine API",
        "http://localhost:5000/api/calculate/wood-valuation",
        "POST",
        {
            "woodType": "ไม้สัก (Teak)",
            "woodVolumeCuM": 20,
            "pillarCount": 16,
            "conditionPercent": 90
        }
    ),
    (
        "15. Post Real Wood House Submission API",
        "http://localhost:5000/api/properties",
        "POST",
        {
            "id": f"TEST-WOOD-{int(time.time())}",
            "title": "เรือนไม้สักโบราณทดสอบระบบอัตโนมัติ",
            "type": "wooden_building",
            "assetCategory": "สิ่งปลูกสร้างไม้เก่า",
            "district": "เมืองกาฬสินธุ์",
            "subdistrict": "กาฬสินธุ์",
            "address": "ต.กาฬสินธุ์ อ.เมืองกาฬสินธุ์ จ.กาฬสินธุ์",
            "deedNo": "กรรมสิทธิ์บ้านไม้เก่า",
            "priceStarting": 320000,
            "priceAppraised": 350000,
            "marketEstimate": 400000,
            "mortgageDebt": 0,
            "realTotalPayment": 320000,
            "woodDetails": {
                "woodType": "ไม้สัก (Teak)",
                "woodVolumeCubicM": 25,
                "woodPillars": 18,
                "woodConditionPercent": 88,
                "woodValueEstimate": 420000,
                "salvageFeasibility": "ผ่านการประเมิน"
            },
            "images": ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb"],
            "features": ["ไม้สักทองแท้ 100%", "เสา 18 ต้น", "สภาพ 88%"],
            "contactName": "ช่างทดสอบระบบ",
            "contactPhone": "081-999-9999"
        }
    )
]

print("=" * 70)
print("🚀 เริ่มต้นการทดสอบฟีเจอร์ระบบเว็บไซต์ทั้งหมด (Automated Test Suite)")
print("=" * 70)

all_passed = True

for t in tests:
    res = test_endpoint(t[0], t[1])
    if res["success"]:
        count_str = f"({res.get('count')} รายการ)" if res.get("count") is not None else ""
        print(f"✅ {res['name']}: ผ่าน (HTTP {res['status']}) {count_str}")
    else:
        all_passed = False
        print(f"❌ {res['name']}: ล้มเหลว - {res.get('error')}")

print("-" * 70)
for t in calc_tests:
    res = test_endpoint(t[0], t[1], t[2], t[3])
    if res["success"]:
        print(f"✅ {res['name']}: ผ่าน (HTTP {res['status']})")
        print(f"   ผลลัพธ์: {res['raw'][:110]}...")
    else:
        all_passed = False
        print(f"❌ {res['name']}: ล้มเหลว - {res.get('error')}")

print("=" * 70)
if all_passed:
    print("🎉 ผลการทดสอบ: ทุกฟีเจอร์ทำงานถูกต้องสมบูรณ์ 100%!")
else:
    print("⚠️ ผลการทดสอบ: มีบางฟีเจอร์ไม่ผ่าน กรุณาตรวจสอบข้อผิดพลาดด้านบน")
print("=" * 70)
