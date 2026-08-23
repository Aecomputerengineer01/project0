# โครงการพัฒนาเว็บไซต์และแอปพลิเคชันตลาดอสังหาริมทรัพย์ ทรัพย์บังคับคดี และสิ่งปลูกสร้างไม้เก่า จังหวัดกาฬสินธุ์

ระบบตลาดอสังหาริมทรัพย์ดิจิทัลและวิเคราะห์ข้อมูลทรัพย์ขายทอดตลาดของกรมบังคับคดี (LED) บูรณาการระบบวิเคราะห์เชิงลึก **FastLEDChecker Engine** ร่วมกับตลาดซื้อขายและประเมินมูลค่าสิ่งปลูกสร้างไม้เก่าในจังหวัดกาฬสินธุ์

---

## 🌟 คุณสมบัติเด่นของระบบ (Core Features)

1. **Smart Search & Filter System:** ระบบค้นหาและกรองทรัพย์สินขั้นสูง ครอบคลุมทั้ง 18 อำเภอ ในจังหวัดกาฬสินธุ์
2. **FastLEDChecker Analytics Engine:**
   - คำนวณเพดานราคาเสนอประมูลสูงสุดที่ไม่ขาดทุน (`Maximum Bid Calculator`)
   - ประเมินภาระจำนองติดไป (`Mortgage Debt Inspector`) และคำนวณ `ราคาจริงที่ต้องจ่าย = เคาะ + จำนอง`
   - ประเมินต้นทุนแฝง (`Implicit Cost Estimator`) ค่าฟ้องขับไล่ ค่าซ่อมแซม และค่าธรรมเนียมโอน
3. **Wood Valuation Engine (ประเมินมูลค่าบ้านไม้เก่า):**
   - ประเมินมูลค่าสิ่งปลูกสร้างไม้เก่า (ไม้สัก, ไม้ประดู่, ไม้เต็ง, ไม้แดง) ตามปริมาตรไม้ (ลบ.ม.), เสาเรือนโบราณ, และ % สภาพไม้
4. **Geospatial Information System (GIS Map):**
   - แสดงผลหมุดทรัพย์สินบนระบบแผนที่ปฏิสัมพันธ์ Leaflet.js
5. **Side-by-Side Property Comparison:**
   - ระบบเปรียบเทียบทรัพย์สินและตัวชี้วัดทางการเงินได้สูงสุด 3 รายการพร้อมกัน
6. **ReactJS Dashboard (บทที่ 1 บทนำ):**
   - หน้าเอกสารโครงงานบทที่ 1 ตอบโจทย์รูปแบบวิทยานิพนธ์ พัฒนาด้วย React 18 & Tailwind CSS

---

## 📂 โครงสร้างโฟลเดอร์โครงการ (Project Structure)

```
d:/Development of Web Application/
├── index.html                # หน้าเว็บแอปพลิเคชันหลัก (SPA Marketplace)
├── chapter1_react.html        # หน้าเว็บเอกสารบทที่ 1 บทนำ (ReactJS Dashboard)
├── css/
│   └── style.css             # Custom Stylesheet & Badges
├── js/
│   ├── data.js               # ข้อมูลจำลองอสังหาฯ และทรัพย์บังคับคดีกาฬสินธุ์
│   ├── fastled_engine.js     # อัลกอริทึมคำนวณ FastLEDChecker Engine
│   └── app.js                # UI Logic, Smart Filter, Leaflet Map, Compare System
├── scripts/
│   └── sync_fastled_data.py  # สคริปต์ Python Data Pipeline สำหรับซิงค์ข้อมูล FastLED
├── data/
│   └── fastled_full_sync.json# ไฟล์ JSON รวบรวมข้อมูลทรัพย์ซิงค์สมบูรณ์
└── vault/                    # เอกสารโครงงานฉบับเต็มภาษาไทยเชิงวิชาการ (1.1 - 1.5)
```

---

## 🌐 การเข้าถึงระบบ (Endpoints)

- **Main Application:** `http://localhost:8000/`
- **ReactJS Chapter 1 Page:** `http://localhost:8000/chapter1_react.html`
- **JSON Data Endpoint:** `http://localhost:8000/data/fastled_full_sync.json`
- **GitHub Repository:** `https://github.com/Aecomputerengineer01/project0.git`
