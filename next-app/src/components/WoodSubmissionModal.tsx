"use client";

import { useState } from "react";
import { PropertyItem, FastLEDCheckerEngine, WOOD_TYPES_PRICING } from "@/lib/fastled_engine";
import { X, Sparkles } from "lucide-react";

interface WoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: PropertyItem) => void;
}

export default function WoodSubmissionModal({ isOpen, onClose, onSubmit }: WoodModalProps) {
  const [woodType, setWoodType] = useState("ไม้สัก (Teak)");
  const [volume, setVolume] = useState(20);
  const [pillars, setPillars] = useState(16);
  const [condition, setCondition] = useState(88);
  const [district, setDistrict] = useState("เมืองกาฬสินธุ์");
  const [subdistrict, setSubdistrict] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(250000);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  if (!isOpen) return null;

  const valuation = FastLEDCheckerEngine.calculateWoodValuation({
    woodType,
    woodVolumeCuM: volume,
    pillarCount: pillars,
    conditionPercent: condition
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subdistrict || !title) {
      alert("กรุณากรอกข้อมูลตำบลและหัวข้อประกาศให้ครบถ้วน");
      return;
    }

    const newItem: PropertyItem = {
      id: `KLS-WOOD-USER-${Date.now()}`,
      title: `${title} ต.${subdistrict} อ.${district} จ.กาฬสินธุ์`,
      type: "wooden_building",
      assetCategory: "สิ่งปลูกสร้างไม้เก่า",
      district,
      subdistrict,
      address: `ต.${subdistrict} อ.${district} จ.กาฬสินธุ์`,
      deedNo: "สิทธิ์สิ่งปลูกสร้างไม้เก่า",
      priceStarting: Number(price),
      priceAppraised: valuation.netEstimatedValue,
      marketEstimate: Math.round(valuation.netEstimatedValue * 1.15),
      mortgageDebt: 0,
      realTotalPayment: Number(price),
      auctionDate: "พร้อมขายรื้อถอนทันที",
      competitorStatus: "เพิ่งลงประกาศใหม่",
      isMortgageAttached: false,
      evictionRisk: "none",
      evictionCostEst: 0,
      renovationCostEst: 40000,
      areaSqW: 100,
      usableAreaSqM: Math.round(volume * 5.5),
      lat: 16.4322 + (Math.random() - 0.5) * 0.05,
      lng: 103.5061 + (Math.random() - 0.5) * 0.05,
      status: `พร้อมขาย | ราคา ฿${Number(price).toLocaleString()} บาท`,
      ledCourt: "เจ้าของกรรมสิทธิ์โดยตรง",
      ledCaseNo: "OWNER-DIRECT",
      reserveFund: Math.round(Number(price) * 0.1),
      saleLocation: `ต.${subdistrict} อ.${district} จ.กาฬสินธุ์`,
      dataSourceUrl: "",
      images: [
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80"
      ],
      features: [
        `⭐ ${woodType} แท้ (${pillars} เสา)`,
        `สภาพเนื้อไม้ ${condition}%`,
        `ผู้ลงประกาศ: ${contactName} (${contactPhone})`
      ],
      woodDetails: {
        woodType,
        woodVolumeCubicM: volume,
        woodPillars: pillars,
        woodConditionPercent: condition,
        woodValueEstimate: valuation.netEstimatedValue,
        salvageFeasibility: "ผ่านการประเมินราคา Wood Engine"
      },
      isUserSubmitted: true
    };

    onSubmit(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            🪵 ลงประกาศขายบ้านไม้เก่า & ประเมินมูลค่าเนื้อไม้จริง
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Live Valuation Card */}
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex items-center justify-between">
            <div>
              <span className="text-amber-800 font-medium">มูลค่าเนื้อไม้ประเมินอัตโนมัติ (AI Engine):</span>
              <p className="text-xl font-bold text-amber-950">
                ฿{valuation.netEstimatedValue.toLocaleString()} บาท
              </p>
              <p className="text-[11px] text-amber-700">
                ช่วงราคาแนะนำ: ฿{valuation.recommendedPriceMin.toLocaleString()} - ฿
                {valuation.recommendedPriceMax.toLocaleString()}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPrice(Math.round(valuation.netEstimatedValue * 0.9))}
              className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" /> ใช้ราคาประเมิน
            </button>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">หัวข้อประกาศ</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น บ้านไม้สักโบราณ 2 ชั้น เสา 16 ต้น ไม้คัดเกรดพร้อมรื้อถอน"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">อำเภอ</label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">ตำบล</label>
              <input
                type="text"
                required
                value={subdistrict}
                onChange={(e) => setSubdistrict(e.target.value)}
                placeholder="เช่น กาฬสินธุ์, โพนงาม"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">ชนิดไม้หลัก</label>
              <select
                value={woodType}
                onChange={(e) => setWoodType(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              >
                {Object.keys(WOOD_TYPES_PRICING).map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">ปริมาตรไม้ (ลบ.ม.)</label>
              <input
                type="number"
                min="1"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">จำนวนเสา (ต้น)</label>
              <input
                type="number"
                min="0"
                value={pillars}
                onChange={(e) => setPillars(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">ราคาตั้งขาย (บาท)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-orange-600"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">ความสมบูรณ์ของเนื้อไม้ (%)</label>
              <input
                type="number"
                min="10"
                max="100"
                value={condition}
                onChange={(e) => setCondition(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">ชื่อผู้ติดต่อ</label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="เช่น ช่างสมหมาย"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">เบอร์โทรติดต่อ</label>
              <input
                type="text"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="เช่น 081-234-5678"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl"
            >
              บันทึกและขึ้นประกาศทันที
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
