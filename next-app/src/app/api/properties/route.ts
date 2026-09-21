import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const district = searchParams.get("district");
  const subdistrict = searchParams.get("subdistrict");
  const type = searchParams.get("type");
  const keyword = searchParams.get("keyword");
  const limit = parseInt(searchParams.get("limit") || "100", 10);

  try {
    const whereClause: Record<string, any> = {};

    if (district && district !== "all") {
      whereClause.district = district;
    }
    if (subdistrict && subdistrict !== "all") {
      whereClause.subdistrict = subdistrict;
    }
    if (type && type !== "all") {
      if (type === "has_structure") {
        whereClause.OR = [
          { hasExistingStructure: true },
          { assetCategory: { contains: "สิ่งปลูกสร้าง" } },
          { assetCategory: { contains: "บ้าน" } }
        ];
      } else {
        whereClause.type = type;
      }
    }
    if (keyword) {
      whereClause.OR = [
        { title: { contains: keyword } },
        { district: { contains: keyword } },
        { subdistrict: { contains: keyword } },
        { ledCaseNo: { contains: keyword } },
        { deedNo: { contains: keyword } }
      ];
    }

    const properties = await prisma.property.findMany({
      where: whereClause,
      take: limit,
      orderBy: { createdAt: "desc" }
    });

    const parsed = properties.map((p) => ({
      ...p,
      images: JSON.parse(p.images || "[]"),
      features: JSON.parse(p.features || "[]"),
      woodDetails: p.woodType
        ? {
            woodType: p.woodType,
            woodVolumeCubicM: p.woodVolumeCubicM || 0,
            woodPillars: p.woodPillars || 0,
            woodConditionPercent: p.woodConditionPercent || 85,
            woodValueEstimate: p.woodValueEstimate || 0,
            salvageFeasibility: p.salvageFeasibility || ""
          }
        : undefined
    }));

    return NextResponse.json({
      success: true,
      total: parsed.length,
      data: parsed
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const created = await prisma.property.create({
      data: {
        id: body.id || `KLS-WOOD-PRISMA-${Date.now()}`,
        title: body.title,
        type: body.type || "wooden_building",
        assetCategory: body.assetCategory || "สิ่งปลูกสร้างไม้เก่า",
        district: body.district,
        subdistrict: body.subdistrict || "",
        address: body.address || "",
        deedNo: body.deedNo || "",
        priceStarting: Number(body.priceStarting) || 0,
        priceAppraised: Number(body.priceAppraised) || 0,
        marketEstimate: Number(body.marketEstimate) || 0,
        mortgageDebt: Number(body.mortgageDebt) || 0,
        realTotalPayment: Number(body.realTotalPayment) || 0,
        auctionDate: body.auctionDate || "พร้อมขายรื้อถอนทันที",
        competitorStatus: body.competitorStatus || "เพิ่งลงประกาศ",
        isMortgageAttached: Boolean(body.isMortgageAttached),
        evictionRisk: body.evictionRisk || "none",
        evictionCostEst: Number(body.evictionCostEst) || 0,
        renovationCostEst: Number(body.renovationCostEst) || 0,
        areaSqW: Number(body.areaSqW) || 0,
        usableAreaSqM: Number(body.usableAreaSqM) || 0,
        lat: Number(body.lat) || 16.4322,
        lng: Number(body.lng) || 103.5061,
        status: body.status || "พร้อมขาย",
        ledCourt: body.ledCourt || "ผู้ลงประกาศโดยตรง",
        ledCaseNo: body.ledCaseNo || "PRISMA-DIRECT",
        reserveFund: Number(body.reserveFund) || 0,
        saleLocation: body.saleLocation || "",
        dataSourceUrl: body.dataSourceUrl || "",
        images: JSON.stringify(body.images || []),
        features: JSON.stringify(body.features || []),
        contactName: body.contactName || null,
        contactPhone: body.contactPhone || null,
        hasExistingStructure: Boolean(body.hasExistingStructure),
        woodType: body.woodDetails?.woodType || body.woodType || null,
        woodVolumeCubicM: body.woodDetails?.woodVolumeCubicM || body.woodVolumeCubicM || null,
        woodPillars: body.woodDetails?.woodPillars || body.woodPillars || null,
        woodConditionPercent: body.woodDetails?.woodConditionPercent || body.woodConditionPercent || null,
        woodValueEstimate: body.woodDetails?.woodValueEstimate || body.woodValueEstimate || null,
        salvageFeasibility: body.woodDetails?.salvageFeasibility || body.salvageFeasibility || null,
        isUserSubmitted: true
      }
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
