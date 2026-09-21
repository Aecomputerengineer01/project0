"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  PROPERTIES_DATA,
  KALASIN_DISTRICTS,
  KALASIN_SUBDISTRICTS,
  CONTRACTORS_DATA
} from "@/lib/data";
import { PropertyItem, FastLEDCheckerEngine, WOOD_TYPES_PRICING } from "@/lib/fastled_engine";
import PropertyModal from "@/components/PropertyModal";
import CompareModal from "@/components/CompareModal";
import WoodSubmissionModal from "@/components/WoodSubmissionModal";
import {
  Building2,
  Search,
  MapPin,
  Scale,
  TreePine,
  Wrench,
  RotateCcw,
  ExternalLink,
  PhoneCall,
  Sparkles
} from "lucide-react";

// Dynamic import for Leaflet GIS Map to avoid SSR issues
const GisMap = dynamic(() => import("@/components/GisMap"), { ssr: false });

export default function HomePage() {
  const [properties, setProperties] = useState<PropertyItem[]>(PROPERTIES_DATA);
  const [activeTab, setActiveTab] = useState<"catalog" | "fastled" | "wood" | "map" | "contractors">(
    "catalog"
  );

  // Filters
  const [searchKeyword, setSearchKeyword] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [subdistrictFilter, setSubdistrictFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  // Selection & Modals
  const [selectedProperty, setSelectedProperty] = useState<PropertyItem | null>(null);
  const [compareList, setCompareList] = useState<PropertyItem[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isWoodModalOpen, setIsWoodModalOpen] = useState(false);

  // FastLED Interactive Calculator State
  const [calcMarketVal, setCalcMarketVal] = useState(1500000);
  const [calcRoi, setCalcRoi] = useState(15);
  const [calcDebt, setCalcDebt] = useState(250000);
  const [calcEviction, setCalcEviction] = useState(50000);
  const [calcReno, setCalcReno] = useState(80000);

  // Wood Valuation State
  const [woodTypeInput, setWoodTypeInput] = useState("ไม้สัก (Teak)");
  const [woodVolumeInput, setWoodVolumeInput] = useState(15);
  const [woodPillarInput, setWoodPillarInput] = useState(12);
  const [woodConditionInput, setWoodConditionInput] = useState(85);

  // Available Subdistricts based on selected District
  const availableSubdistricts = useMemo(() => {
    if (districtFilter === "all" || !KALASIN_SUBDISTRICTS[districtFilter]) {
      return [];
    }
    return KALASIN_SUBDISTRICTS[districtFilter];
  }, [districtFilter]);

  // Filtered Properties
  const filteredProperties = useMemo(() => {
    return properties.filter((item) => {
      if (districtFilter !== "all" && item.district !== districtFilter) return false;
      if (subdistrictFilter !== "all" && item.subdistrict !== subdistrictFilter) return false;

      if (typeFilter !== "all") {
        if (typeFilter === "has_structure") {
          const hasStruct =
            item.hasExistingStructure === true ||
            (item.assetCategory &&
              (item.assetCategory.includes("สิ่งปลูกสร้าง") || item.assetCategory.includes("บ้าน")));
          if (!hasStruct) return false;
        } else if (item.type !== typeFilter) {
          return false;
        }
      }

      if (priceFilter !== "all") {
        const price = item.priceStarting;
        if (priceFilter === "under_500k" && price > 500000) return false;
        if (priceFilter === "500k_1m" && (price < 500000 || price > 1000000)) return false;
        if (priceFilter === "1m_2m" && (price < 1000000 || price > 2000000)) return false;
        if (priceFilter === "over_2m" && price < 2000000) return false;
      }

      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        const mTitle = item.title.toLowerCase().includes(kw);
        const mDistrict = item.district.toLowerCase().includes(kw);
        const mSub = item.subdistrict.toLowerCase().includes(kw);
        const mCase = item.ledCaseNo?.toLowerCase().includes(kw);
        const mDeed = item.deedNo?.toLowerCase().includes(kw);
        if (!mTitle && !mDistrict && !mSub && !mCase && !mDeed) return false;
      }

      return true;
    });
  }, [properties, districtFilter, subdistrictFilter, typeFilter, priceFilter, searchKeyword]);

  const resetFilters = () => {
    setSearchKeyword("");
    setDistrictFilter("all");
    setSubdistrictFilter("all");
    setTypeFilter("all");
    setPriceFilter("all");
  };

  const handleToggleCompare = (property: PropertyItem) => {
    if (compareList.some((c) => c.id === property.id)) {
      setCompareList((prev) => prev.filter((c) => c.id !== property.id));
    } else {
      if (compareList.length >= 3) {
        alert("สามารถเปรียบเทียบได้สูงสุด 3 รายการพร้อมกัน");
        return;
      }
      setCompareList((prev) => [...prev, property]);
    }
  };

  const handleAddNewWoodProperty = (newProp: PropertyItem) => {
    setProperties((prev) => [newProp, ...prev]);
    setActiveTab("catalog");
    alert(`🎉 ลงประกาศสำเร็จเรียบร้อยแล้ว: ${newProp.title}`);
  };

  // Calculator Result
  const maxBidResult = FastLEDCheckerEngine.calculateMaxBid({
    marketEstimate: calcMarketVal,
    targetProfitPercent: calcRoi,
    mortgageDebt: calcDebt,
    evictionCostEst: calcEviction,
    renovationCostEst: calcReno
  });

  // Wood Valuation Result
  const woodResult = FastLEDCheckerEngine.calculateWoodValuation({
    woodType: woodTypeInput,
    woodVolumeCuM: woodVolumeInput,
    pillarCount: woodPillarInput,
    conditionPercent: woodConditionInput
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black shadow-md shadow-orange-600/20 text-lg">
                กา
              </div>
              <div>
                <h1 className="text-base font-extrabold text-slate-900 leading-tight">
                  กาฬสินธุ์ Real Estate & FastLED
                </h1>
                <p className="text-[11px] text-slate-500">
                  ตลาดอสังหาริมทรัพย์ • ทรัพย์บังคับคดี (Next.js Edition)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsWoodModalOpen(true)}
                className="bg-amber-800 hover:bg-amber-900 text-white text-xs px-3.5 py-2 rounded-xl font-semibold shadow-sm transition flex items-center gap-1.5"
              >
                <TreePine className="w-3.5 h-3.5" /> ลงประกาศบ้านไม้เก่า
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-6 text-xs font-semibold overflow-x-auto border-t border-slate-100 pt-2.5 pb-2">
            <button
              onClick={() => setActiveTab("catalog")}
              className={`pb-2 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "catalog"
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <Building2 className="w-4 h-4" /> ทรัพย์สินทั้งหมด ({filteredProperties.length})
            </button>
            <button
              onClick={() => setActiveTab("fastled")}
              className={`pb-2 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "fastled"
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <Scale className="w-4 h-4 text-amber-500" /> FastLEDChecker วิเคราะห์ประมูล
            </button>
            <button
              onClick={() => setActiveTab("wood")}
              className={`pb-2 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "wood"
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <TreePine className="w-4 h-4 text-amber-700" /> ตลาดบ้านไม้เก่า & คำนวณราคาไม้
            </button>
            <button
              onClick={() => setActiveTab("map")}
              className={`pb-2 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "map"
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <MapPin className="w-4 h-4 text-blue-600" /> แผนที่ GIS กาฬสินธุ์ 18 อำเภอ
            </button>
            <button
              onClick={() => setActiveTab("contractors")}
              className={`pb-2 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "contractors"
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <Wrench className="w-4 h-4 text-slate-600" /> บริการช่างรื้อถอน
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-amber-950 to-orange-950 text-white py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="inline-block bg-amber-500/20 text-amber-300 text-[11px] px-3 py-0.5 rounded-full font-semibold border border-amber-500/30 mb-2">
              📍 ข้อมูลจริง 100% ครบ 18 อำเภอ 133 ตำบล ในจังหวัดกาฬสินธุ์ (900 รายการ)
            </span>
            <h2 className="text-xl sm:text-2xl font-black mb-1">
              ตลาดอสังหาริมทรัพย์ ทรัพย์บังคับคดี และสิ่งปลูกสร้างไม้เก่า กาฬสินธุ์
            </h2>
            <p className="text-slate-300 text-xs max-w-2xl leading-relaxed">
              สถาปัตยกรรม Next.js App Router + TypeScript พร้อมระบบวิเคราะห์ความเสี่ยง FastLEDChecker
              Engine คำนวณเพดานประมูล Max Bid และสิทธิ์จำนองติดไป
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/15 min-w-[240px]">
            <div className="flex justify-between items-center mb-2 pb-1 border-b border-white/10 text-xs text-amber-300 font-bold">
              <span>LED Data Status</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400">ทรัพย์จริง:</span>
                <p className="text-base font-bold text-amber-400">900 รายการ</p>
              </div>
              <div>
                <span className="text-slate-400">ครอบคลุม:</span>
                <p className="text-base font-bold text-emerald-400">133 ตำบล</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
        {/* TAB 1: CATALOG */}
        {activeTab === "catalog" && (
          <div>
            {/* Smart Filter */}
            <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 mb-6">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                🔍 Smart Filter & Search (ค้นหาเจาะลึก 18 อำเภอ 133 ตำบล)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">คำค้นหา</label>
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="ชื่อทรัพย์, คดีแดง..."
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">อำเภอ</label>
                  <select
                    value={districtFilter}
                    onChange={(e) => {
                      setDistrictFilter(e.target.value);
                      setSubdistrictFilter("all");
                    }}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                  >
                    <option value="all">-- ทุกอำเภอ (18 อำเภอ) --</option>
                    {KALASIN_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">ตำบล</label>
                  <select
                    value={subdistrictFilter}
                    onChange={(e) => setSubdistrictFilter(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                  >
                    <option value="all">-- ทุกตำบล --</option>
                    {availableSubdistricts.map((sub) => (
                      <option key={sub} value={sub}>
                        ต.{sub}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    ประเภททรัพย์สิน
                  </label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                  >
                    <option value="all">-- ทุกประเภท --</option>
                    <option value="led_asset">⚡ ทรัพย์บังคับคดี (LED)</option>
                    <option value="has_structure">🏠 ที่ดินพร้อมสิ่งปลูกสร้าง</option>
                    <option value="wooden_building">🪵 สิ่งปลูกสร้างไม้เก่า</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">ช่วงราคาประมูล</label>
                  <select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                  >
                    <option value="all">-- ทุกช่วงราคา --</option>
                    <option value="under_500k">ต่ำกว่า 500,000 บาท</option>
                    <option value="500k_1m">500,000 - 1,000,000 บาท</option>
                    <option value="1m_2m">1,000,000 - 2,000,000 บาท</option>
                    <option value="over_2m">มากกว่า 2,000,000 บาท</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={resetFilters}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold p-2.5 rounded-lg border border-slate-300 flex items-center justify-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> ล้างตัวกรอง
                  </button>
                </div>
              </div>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProperties.slice(0, 60).map((item) => {
                const isLed = item.type === "led_asset";
                const isWood = item.type === "wooden_building";
                const isCompared = compareList.some((c) => c.id === item.id);

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition"
                  >
                    <div className="relative h-48 bg-slate-100">
                      <img
                        src={
                          item.images[0] ||
                          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600"
                        }
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <span
                        className={`absolute top-3 left-3 px-2 py-0.5 rounded-md text-[11px] font-semibold shadow-xs ${
                          isLed ? "badge-led" : isWood ? "badge-wood" : "badge-normal"
                        }`}
                      >
                        {isLed ? "⚡ ทรัพย์บังคับคดี" : isWood ? "🪵 สิ่งปลูกสร้างไม้เก่า" : "🏡 ทั่วไป"}
                      </span>
                      <span className="absolute bottom-3 right-3 bg-black/70 text-white text-[11px] px-2 py-0.5 rounded backdrop-blur-xs">
                        อ.{item.district} ต.{item.subdistrict}
                      </span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 mb-2">
                          {item.title}
                        </h4>
                        <div className="bg-slate-50 p-3 rounded-xl mb-3 text-xs border border-slate-200/80 space-y-1">
                          <div className="flex justify-between font-bold text-slate-900">
                            <span>ราคาเคาะเริ่มต้น:</span>
                            <span className="text-orange-600">
                              ฿{item.priceStarting.toLocaleString()} บาท
                            </span>
                          </div>
                          {item.mortgageDebt > 0 ? (
                            <div className="flex justify-between text-red-600 font-semibold pt-1 border-t border-slate-200">
                              <span>🚩 การจำนองติดไป:</span>
                              <span>+฿{item.mortgageDebt.toLocaleString()} บาท</span>
                            </div>
                          ) : (
                            <div className="flex justify-between text-emerald-600 font-semibold pt-1 border-t border-slate-200">
                              <span>✓ สถานะทางกฎหมาย:</span>
                              <span>ปลอดการจำนอง</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex gap-2">
                        <button
                          onClick={() => setSelectedProperty(item)}
                          className="flex-1 bg-slate-900 hover:bg-orange-600 text-white text-xs py-2 px-3 rounded-xl font-semibold transition"
                        >
                          รายละเอียด & วิเคราะห์
                        </button>
                        <button
                          onClick={() => handleToggleCompare(item)}
                          className={`px-3 py-2 text-xs font-semibold rounded-xl border transition ${
                            isCompared
                              ? "bg-orange-50 border-orange-500 text-orange-600"
                              : "border-slate-300 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {isCompared ? "✓ เทียบแล้ว" : "+ เทียบ"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: FASTLED CALCULATOR */}
        {activeTab === "fastled" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
              <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-500" /> เครื่องคำนวณเพดานราคาประมูลสูงสุด (Max Bid)
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                คำนวณราคาเสนอเคาะสูงสุดที่จะยังคงได้รับผลตอบแทนตามเป้าหมาย โดยไม่ขาดทุนจากภาระแฝง
              </p>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    ประมาณการราคาตลาดของทรัพย์ (บาท)
                  </label>
                  <input
                    type="number"
                    value={calcMarketVal}
                    onChange={(e) => setCalcMarketVal(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    เป้าหมายอัตรากำไร ROI ที่ต้องการ (%)
                  </label>
                  <input
                    type="number"
                    value={calcRoi}
                    onChange={(e) => setCalcRoi(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    ภาระจำนองติดไปตามสัญญา LED (บาท)
                  </label>
                  <input
                    type="number"
                    value={calcDebt}
                    onChange={(e) => setCalcDebt(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-red-600"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      ค่าฟ้องขับไล่ประมาณการ (บาท)
                    </label>
                    <input
                      type="number"
                      value={calcEviction}
                      onChange={(e) => setCalcEviction(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      ค่าปรับปรุงซ่อมแซม (บาท)
                    </label>
                    <input
                      type="number"
                      value={calcReno}
                      onChange={(e) => setCalcReno(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Results Output */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  FastLEDChecker Recommendation
                </span>
                <h4 className="text-2xl font-black text-amber-400 mt-2 mb-1">
                  ฿{maxBidResult.maxBid.toLocaleString()} บาท
                </h4>
                <p className="text-xs text-slate-400 mb-6">
                  เพดานราคาประมูลสูงสุดที่แนะนำ (ส่วนลดจากราคาตลาด{" "}
                  {maxBidResult.discountFromMarketPercent}%)
                </p>

                <div className="space-y-3 text-xs border-t border-slate-800 pt-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">กำไรเป้าหมายที่คาดว่าจะได้รับ:</span>
                    <span className="font-bold text-emerald-400">
                      ฿{maxBidResult.targetProfitAmount.toLocaleString()} บาท
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">ภาระจำนองที่ต้องชำระเพิ่ม:</span>
                    <span className="font-bold text-red-400">
                      ฿{maxBidResult.mortgageDebt.toLocaleString()} บาท
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">ค่าธรรมเนียมโอนและอากรแฝง (3.5%):</span>
                    <span className="text-slate-300">
                      ฿{maxBidResult.estimatedTransferFee.toLocaleString()} บาท
                    </span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t border-slate-800">
                    <span className="text-slate-300">รวมภาระและต้นทุนหักทอนทั้งหมด:</span>
                    <span className="text-amber-300">
                      ฿{maxBidResult.totalDeductions.toLocaleString()} บาท
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: WOOD MARKET */}
        {activeTab === "wood" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
              <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                <TreePine className="w-5 h-5 text-amber-700" /> Wood Valuation Engine
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                ประเมินมูลค่าเนื้อไม้สิ่งปลูกสร้างเก่าตามเกณฑ์มาตรฐาน
              </p>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">ชนิดไม้หลัก</label>
                  <select
                    value={woodTypeInput}
                    onChange={(e) => setWoodTypeInput(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    {Object.keys(WOOD_TYPES_PRICING).map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">ปริมาตร (ลบ.ม.)</label>
                    <input
                      type="number"
                      value={woodVolumeInput}
                      onChange={(e) => setWoodVolumeInput(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">จำนวนเสา (ต้น)</label>
                    <input
                      type="number"
                      value={woodPillarInput}
                      onChange={(e) => setWoodPillarInput(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">สภาพเนื้อไม้ (%)</label>
                    <input
                      type="number"
                      value={woodConditionInput}
                      onChange={(e) => setWoodConditionInput(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-950 text-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  ผลประเมินมูลค่าเนื้อไม้สุทธิ
                </span>
                <h4 className="text-2xl font-black text-amber-400 mt-2 mb-1">
                  ฿{woodResult.netEstimatedValue.toLocaleString()} บาท
                </h4>
                <p className="text-xs text-amber-200/80 mb-6">
                  ช่วงราคาซื้อขายแนะนำ: ฿{woodResult.recommendedPriceMin.toLocaleString()} - ฿
                  {woodResult.recommendedPriceMax.toLocaleString()} บาท
                </p>

                <div className="space-y-3 text-xs border-t border-amber-900/60 pt-4">
                  <div className="flex justify-between">
                    <span className="text-amber-200/70">มูลค่าเนื้อไม้พื้นฐาน:</span>
                    <span>฿{woodResult.baseMaterialValue.toLocaleString()} บาท</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-200/70">มูลค่าโบนัสเสาเรือนโบราณ:</span>
                    <span className="text-amber-300">
                      +฿{woodResult.pillarBonusValue.toLocaleString()} บาท
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-200/70">ประมาณการค่ารื้อถอนและขนย้าย:</span>
                    <span className="text-orange-400">
                      ฿{woodResult.estimatedDismantlingCost.toLocaleString()} บาท
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsWoodModalOpen(true)}
                className="mt-6 w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
              >
                <TreePine className="w-4 h-4" /> ลงประกาศขายบ้านไม้รายการนี้
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: GIS MAP */}
        {activeTab === "map" && (
          <div>
            <div className="mb-4">
              <h3 className="text-base font-bold text-slate-900">
                🗺️ แผนที่พิกัด GIS ทรัพย์สินและทรัพย์บังคับคดีกาฬสินธุ์
              </h3>
              <p className="text-xs text-slate-500">
                คลิกที่หมุดบนแผนที่เพื่อดูข้อมูลและเปิดรายละเอียดเชิงลึก
              </p>
            </div>
            <GisMap
              properties={filteredProperties}
              onSelectProperty={(prop) => setSelectedProperty(prop)}
            />
          </div>
        )}

        {/* TAB 5: CONTRACTORS */}
        {activeTab === "contractors" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CONTRACTORS_DATA.map((c) => (
              <div
                key={c.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      ✓ ผ่านการตรวจสอบ
                    </span>
                    <span className="text-[11px] text-slate-400">ประสบการณ์ {c.experienceYears} ปี</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">{c.name}</h4>
                  <p className="text-xs text-orange-600 mb-2">อ.{c.district} จ.กาฬสินธุ์</p>
                  <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg">{c.specialty}</p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-4">
                  <div className="text-xs">
                    <span className="text-amber-500 font-bold">★ {c.rating}</span>
                    <span className="text-slate-400"> ({c.reviewsCount} รีวิว)</span>
                  </div>
                  <a
                    href={`tel:${c.phone}`}
                    className="bg-orange-600 hover:bg-orange-700 text-white text-xs py-1.5 px-3 rounded-lg font-medium flex items-center gap-1 transition"
                  >
                    <PhoneCall className="w-3 h-3" /> โทรติดต่อ
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Compare Drawer */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700">
          <span className="text-xs font-semibold">
            เลือกไว้ {compareList.length}/3 รายการ
          </span>
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-1.5 rounded-lg font-bold transition"
          >
            เปิดหน้าเปรียบเทียบ
          </button>
          <button
            onClick={() => setCompareList([])}
            className="text-slate-400 hover:text-white text-xs underline"
          >
            ล้าง
          </button>
        </div>
      )}

      {/* Modals */}
      <PropertyModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onToggleCompare={handleToggleCompare}
        isCompared={selectedProperty ? compareList.some((c) => c.id === selectedProperty.id) : false}
      />

      <CompareModal
        compareList={compareList}
        onClose={() => setIsCompareModalOpen(false)}
        onRemove={(id) => setCompareList((prev) => prev.filter((c) => c.id !== id))}
      />

      <WoodSubmissionModal
        isOpen={isWoodModalOpen}
        onClose={() => setIsWoodModalOpen(false)}
        onSubmit={handleAddNewWoodProperty}
      />
    </div>
  );
}
