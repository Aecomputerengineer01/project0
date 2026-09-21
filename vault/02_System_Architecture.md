# 🏗️ สถาปัตยกรรมระบบ (System Architecture)

**โครงการ:** เว็บไซต์และแอปพลิเคชันตลาดอสังหาริมทรัพย์ ทรัพย์บังคับคดี และสิ่งปลูกสร้างไม้เก่า จังหวัดกาฬสินธุ์  
**รูปแบบสถาปัตยกรรม:** Decoupled Client-Server Multi-Container Architecture (Docker Compose)  
**เทคโนโลยีหลัก:**
- **Frontend Container (`kalasin_frontend`):** React 19, Vite, Tailwind CSS, Leaflet GIS, Nginx Alpine Reverse Proxy
- **Backend Container (`kalasin_backend`):** Node.js 20, Express.js, TypeScript, Prisma Client 6
- **Database Container (`kalasin_postgres`):** PostgreSQL 16 Alpine พร้อม Persistent Volume

---

## 1. ภาพรวมสถาปัตยกรรมเชิงคอนเทนเนอร์ (Containerized Architecture Context)

ระบบทำงานบน **Docker Compose Network** โดยแบ่งความรับผิดชอบออกเป็น 3 บริการหลักที่แยกส่วนกันอย่างชัดเจน (Separation of Concerns):

```mermaid
graph TB
    subgraph Host["🌐 User / Browser Client (Host Network)"]
        Browser["Web Browser (User Device)"]
    end

    subgraph DockerCompose["🐳 Docker Compose Environment (kalasin_network)"]
        subgraph Frontend_Service["Service: frontend (Port 80 / 5173)"]
            Nginx["Nginx Alpine Web Server"]
            StaticAssets["React + Vite Build Assets (HTML/JS/CSS)"]
        end

        subgraph Backend_Service["Service: backend (Port 5000)"]
            ExpressServer["Express.js Server (Node.js 20)"]
            Controllers["Properties & Calculators Controllers"]
            PrismaClient["Prisma Client ORM"]
            Engine["FastLED & Wood Valuation Engine"]
        end

        subgraph Database_Service["Service: db (Port 5432)"]
            PostgreSQL[("PostgreSQL 16 Engine")]
            Volume[("pgdata (Persistent Docker Volume)")]
        end
    end

    subgraph External["🌍 External Data Source"]
        FastLEDWebsite["FastLEDChecker.com (https://www.fastledchecker.com)"]
        LED["กรมบังคับคดี (LED Data Source)"]
        OSM["OpenStreetMap Tiles Server"]
    end

    Browser -->|HTTP Port 80 / 5173| Nginx
    Nginx -->|Serve Static HTML/JS| StaticAssets
    Nginx -->|Reverse Proxy /api/*| ExpressServer

    Browser -.->|Direct Tile Request| OSM
    Browser -.->|External Link click| FastLEDWebsite

    ExpressServer --> Controllers
    Controllers --> Engine
    Controllers --> PrismaClient
    PrismaClient -->|TCP 5432| PostgreSQL
    PostgreSQL --- Volume
```

---

## 2. การแบ่งเลเยอร์ซอฟต์แวร์ (Detailed Layer Breakdown)

### 2.1 Frontend Layer (`client/`)
* **Core:** React 19 + Vite สำหรับการพัฒนาที่รวดเร็ว (Hot Module Replacement) และ Production Bundling ที่มีประสิทธิภาพ
* **Style:** Tailwind CSS สำหรับการออกแบบ User Interface แบบ Responsive รองรับหน้าจอคอมพิวเตอร์ แท็บเล็ต และสมาร์ตโฟน
* **Web Server:** Nginx Alpine ทำหน้าที่:
  1. เสิร์ฟ Static Files (HTML, JS, CSS, Assets)
  2. ทำหน้าที่เป็น **Reverse Proxy** ส่งคำขอที่มีเส้นทางขึ้นต้นด้วย `/api/` ไปยังคอนเทนเนอร์ `backend:5000` โดยอัตโนมัติ ช่วยป้องกันปัญหา Cross-Origin Resource Sharing (CORS) ในระดับเครือข่าย

### 2.2 Backend Layer (`server/`)
* **Core:** Express.js บน Node.js 20 Alpine พัฒนาด้วย TypeScript เพื่อความถูกต้องของ Type Safety
* **สถาปัตยกรรมภายใน:**
  - `src/controllers/propertiesController.ts`: จัดการคำสั่งสืบค้น, คัดกรอง 18 อำเภอ 133 ตำบล, และรับลงประกาศ
  - `src/controllers/calculatorsController.ts`: ประมวลผลคำนวณราคาประมูล Max Bid และราคาประเมินเนื้อไม้
  - `src/lib/fastled_engine.ts`: อัลกอริทึมสูตรคำนวณทางการเงินและการประเมินไม้เก่า
  - `src/lib/prisma.ts`: การจัดการ Database Connection Pool ของ Prisma Client

### 2.3 Database Layer (`db`)
* **DBMS:** PostgreSQL 16 Alpine
* **ORM:** Prisma ORM v6 สำหรับ Migration, Type-Safe Data Querying, และ Seed Data
* **Data Volume:** ทำการ Mount Volume `pgdata` ไว้นอกคอนเทนเนอร์ ทำให้ข้อมูลคงอยู่ถาวรแม้จะ Restart หรือ Rebuild คอนเทนเนอร์

---

## 3. ผังการทำงานเมื่อผู้ใช้กดเปิดดูบน FastLEDChecker.com

```mermaid
sequenceDiagram
    autonumber
    actor User as ผู้ใช้งาน / นักลงทุน
    participant Card as Property Card / Modal (React)
    participant FastLED as FastLEDChecker.com

    User->>Card: คลิกปุ่ม "🌐 เปิดดูบน FastLEDChecker.com"
    Card->>FastLED: เปิดหน้าต่างใหม่ไปยัง https://www.fastledchecker.com/asset/{id}
    FastLED-->>User: แสดงประกาศทางการ, ภาพถ่าย และประวัติการประมูลของกรมบังคับคดี
```

---

## 4. ผังการส่งคำขอข้อมูลระหว่าง Frontend, Backend และ PostgreSQL

```mermaid
sequenceDiagram
    autonumber
    actor User as ผู้ใช้งาน
    participant React as React Web App
    participant Nginx as Nginx (Frontend Container)
    participant Express as Express.js (Backend Container)
    participant Prisma as Prisma ORM
    participant DB as PostgreSQL 16

    User->>React: ค้นหาอำเภอ "เมืองกาฬสินธุ์" ตำบล "หลุบ"
    React->>Nginx: GET /api/properties?district=...&subdistrict=...
    Nginx->>Express: Proxy Pass http://backend:5000/api/properties?...
    Express->>Prisma: prisma.property.findMany({ where: ... })
    Prisma->>DB: SELECT * FROM "Property" WHERE district = ... AND subdistrict = ...
    DB-->>Prisma: คืนค่าแถวข้อมูลจริง
    Prisma-->>Express: ส่ง Object ข้อมูลกลับ
    Express-->>Nginx: JSON Response { success: true, data: [...] }
    Nginx-->>React: HTTP 200 OK
    React-->>User: อัปเดตการ์ดรายการและหมุดบนแผนที่ GIS ทันที
```
