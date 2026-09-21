import { PrismaClient } from "@prisma/client";
import { PROPERTIES_DATA, CONTRACTORS_DATA } from "../src/lib/data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 เริ่มต้นการทำ Mockup / Seed Data เข้าสู่ SQLite ผ่าน Prisma...");

  // ล้างข้อมูลเดิม
  await prisma.property.deleteMany({});
  await prisma.contractor.deleteMany({});

  console.log(`📦 กำลัง Mockup ข้อมูลทรัพย์สินจำนวน ${PROPERTIES_DATA.length} รายการ...`);

  // บันทึก Contractors
  for (const c of CONTRACTORS_DATA) {
    await prisma.contractor.create({
      data: {
        id: c.id,
        name: c.name,
        district: c.district,
        phone: c.phone,
        experienceYears: c.experienceYears,
        specialty: c.specialty,
        rating: c.rating || 4.5,
        reviewsCount: c.reviewsCount || 0,
        completedJobs: c.completedJobs || 0
      }
    });
  }

  // บันทึก Properties ทั้ง 900 รายการ
  const BATCH_SIZE = 100;
  for (let i = 0; i < PROPERTIES_DATA.length; i += BATCH_SIZE) {
    const batch = PROPERTIES_DATA.slice(i, i + BATCH_SIZE);
    
    await prisma.$transaction(
      batch.map((p) =>
        prisma.property.create({
          data: {
            id: p.id,
            title: p.title,
            type: p.type,
            assetCategory: p.assetCategory || "ที่ดินพร้อมสิ่งปลูกสร้าง",
            district: p.district,
            subdistrict: p.subdistrict || "",
            address: p.address || "",
            deedNo: p.deedNo || "",
            priceStarting: Number(p.priceStarting) || 0,
            priceAppraised: Number(p.priceAppraised) || Number(p.priceStarting) || 0,
            marketEstimate: Number(p.marketEstimate) || Number(p.priceAppraised) || 0,
            mortgageDebt: Number(p.mortgageDebt) || 0,
            realTotalPayment: Number(p.realTotalPayment) || Number(p.priceStarting) || 0,
            auctionDate: p.auctionDate || "ตามรอบศาล",
            competitorStatus: p.competitorStatus || "ปกติ",
            isMortgageAttached: Boolean(p.isMortgageAttached),
            evictionRisk: p.evictionRisk || "low",
            evictionCostEst: Number(p.evictionCostEst) || 0,
            renovationCostEst: Number(p.renovationCostEst) || 0,
            areaSqW: Number(p.areaSqW) || 0,
            usableAreaSqM: Number(p.usableAreaSqM) || 0,
            lat: Number(p.lat) || 16.4322,
            lng: Number(p.lng) || 103.5061,
            status: p.status || "พร้อมประมูล",
            ledCourt: p.ledCourt || "ศาลจังหวัดกาฬสินธุ์",
            ledCaseNo: p.ledCaseNo || "",
            reserveFund: Number(p.reserveFund) || 50000,
            saleLocation: p.saleLocation || "สำนักงานบังคับคดีจังหวัดกาฬสินธุ์",
            dataSourceUrl: p.dataSourceUrl || "",
            images: JSON.stringify(p.images || []),
            features: JSON.stringify(p.features || []),
            contactName: p.contactName || null,
            contactPhone: p.contactPhone || null,
            hasExistingStructure: Boolean(p.hasExistingStructure),
            woodType: p.woodDetails?.woodType || null,
            woodVolumeCubicM: p.woodDetails?.woodVolumeCubicM || null,
            woodPillars: p.woodDetails?.woodPillars || null,
            woodConditionPercent: p.woodDetails?.woodConditionPercent || null,
            woodValueEstimate: p.woodDetails?.woodValueEstimate || null,
            salvageFeasibility: p.woodDetails?.salvageFeasibility || null,
            isUserSubmitted: Boolean(p.isUserSubmitted)
          }
        })
      )
    );
    console.log(`  ✓ ดำเนินการแล้ว ${Math.min(i + BATCH_SIZE, PROPERTIES_DATA.length)} / ${PROPERTIES_DATA.length}`);
  }

  const count = await prisma.property.count();
  const contractorCount = await prisma.contractor.count();
  console.log(`🎉 Seed สำเร็จ! รวมข้อมูลในฐานข้อมูล SQLite: Properties = ${count}, Contractors = ${contractorCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
