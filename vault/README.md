# 🏠 Kalasin Real Estate & FastLED Platform - Obsidian Vault

ยินดีต้อนรับสู่คลังเอกสารสถาปัตยกรรมและการวิเคราะห์ระบบ (Obsidian Knowledge Base) สำหรับโครงการ:
**"เว็บไซต์และแอปพลิเคชันตลาดอสังหาริมทรัพย์ ทรัพย์บังคับคดี และสิ่งปลูกสร้างไม้เก่า จังหวัดกาฬสินธุ์"**

---

## 🛠️ สแตกเทคโนโลยีปัจจุบัน (Current Tech Stack)
* **Frontend:** React 19, Vite, Tailwind CSS, Leaflet GIS, Nginx Alpine Reverse Proxy
* **Backend:** Node.js 20, Express.js, TypeScript, Prisma Client 6
* **Database:** PostgreSQL 16 Alpine (รันบน Docker พร้อม Persistent Volume)
* **Deployment:** Docker Multi-Container Compose (`kalasin_frontend`, `kalasin_backend`, `kalasin_postgres`)
* **แหล่งข้อมูลอ้างอิง:** ฐานข้อมูลจริง 100% จาก FastLEDChecker ([https://www.fastledchecker.com](https://www.fastledchecker.com))

---

## 🗺️ แผนผังเอกสารใน Vault (Documentation Sitemap)

### 📋 1. ข้อกำหนดความต้องการของระบบ (Software Requirements Specification: SRS)
- [[01_SRS_Software_Requirements_Specification]]
  - ภาพรวมวัตถุประสงค์และขอบเขตระบบ (Scope & Purpose)
  - ผู้ใช้งานระบบและกลุ่มเป้าหมาย (User Personas & Roles)
  - ข้อกำหนดเชิงหน้าที่ (Functional Requirements: FR)
    - FR-01: Smart Search & Filter (18 อำเภอ 133 ตำบล)
    - FR-02: Authentic Real Data & Direct FastLEDChecker Link Integration
    - FR-03: FastLEDChecker Analytics Engine (Max Bid & Debt Calculation)
    - FR-04: Wood Valuation Engine & Real Submission Marketplace
    - FR-05: Geospatial Information System (GIS Interactive Map)
    - FR-06: Side-by-Side Property Comparison
  - ข้อกำหนดเชิงคุณภาพ (Non-Functional Requirements: NFR)

### 🏗️ 2. สถาปัตยกรรมระบบ (System Architecture)
- [[02_System_Architecture]]
  - ภาพรวมสถาปัตยกรรม Docker Multi-Container (Frontend, Backend, PostgreSQL)
  - สถาปัตยกรรม Nginx Reverse Proxy และ Express REST API
  - ผังการทำงานเมื่อเปิดดูต้นทางบน FastLEDChecker.com
  - Sequence Diagram การส่งต่อข้อมูลระหว่าง React, Nginx, Express, และ PostgreSQL

### 🗄️ 3. การออกแบบฐานข้อมูล (Database Schema & Data Model)
- [[03_Database_Schema]]
  - แผนภาพความสัมพันธ์เชิงข้อมูล (Entity Relationship Diagram: ERD)
  - พจนานุกรมข้อมูล (Data Dictionary) ของตาราง `Property` และ `Contractor`
  - นิยามโมเดลภาษา Prisma สำหรับ PostgreSQL (`schema.prisma`)
  - การควบคุมคุณภาพข้อมูลจริง 900 รายการ และการตัดข้อมูลจำลองออก 100%

---

## 📚 เอกสารวิชาการบทที่ 1 (Thesis Chapter 1 Vault)
- [[1.1_ที่มาและความสำคัญ]]
- [[1.2_วัตถุประสงค์ของโครงการ]]
- [[1.3_ขอบเขตของโครงการ]]
- [[1.4_ผลที่คาดว่าจะได้รับ]]
- [[1.5_เครื่องมือและเทคโนโลยีที่ใช้ในการดำเนินงาน]]
- [[บทที่ 1]]
