"use client";

import { PropertyItem, FastLEDCheckerEngine } from "../lib/fastled_engine";
import { X, ExternalLink, Scale, CheckCircle2, AlertCircle } from "lucide-react";

interface PropertyModalProps {
  property: PropertyItem | null;
  onClose: () => void;
  onToggleCompare: (property: PropertyItem) => void;
  isCompared: boolean;
}

export default function PropertyModal({
  property,
  onClose,
  onToggleCompare,
  isCompared
}: PropertyModalProps) {
  if (!property) return null;

  const implicitCosts = FastLEDCheckerEngine.calculateImplicitCosts({
    appraisedPrice: property.priceAppraised || property.priceStarting,
    bidPrice: property.priceStarting,
    evictionRisk: property.evictionRisk || "low",
    isWoodenStructure: property.type === "wooden_building",
    woodVolumeCuM: property.woodVolumeCuM || 0
  });

  const maxBidRes = FastLEDCheckerEngine.calculateMaxBid({
    marketEstimate: property.marketEstimate || property.priceAppraised,
    targetProfitPercent: 15,
    mortgageDebt: property.mortgageDebt || 0,
    evictionCostEst: property.evictionCostEst || 0,
    renovationCostEst: property.renovationCostEst || 0
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                property.type === "led_asset"
                  ? "badge-led"
                  : property.type === "wooden_building"
                  ? "badge-wood"
                  : "badge-normal"
              }`}
            >
              {property.type === "led_asset"
                ? "⚡ ทรัพย์บังคับคดี LED"
                : property.type === "wooden_building"
                ? "🪵 สิ่งปลูกสร้างไม้เก่า"
                : "อสังหาฯ ทั่วไป"}
            </span>
            <span className="text-xs text-slate-500">
              อ.{property.district} ต.{property.subdistrict} จ.กาฬสินธุ์
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Images */}
          <div>
            <img
              src={property.images[0] || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb"}
              alt={property.title}
              className="w-full h-64 object-cover rounded-xl shadow-sm border border-slate-100 mb-3"
            />
            {property.images.length > 1 && (
              <div className="grid grid-cols-2 gap-2">
                {property.images.slice(1, 3).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt=""
                    className="w-full h-24 object-cover rounded-lg border border-slate-100"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-snug mb-2">{property.title}</h2>
            <p className="text-xs text-slate-500 mb-4">{property.address}</p>

            {/* Price Box */}
            <div className="bg-slate-50 p-4 rounded-xl mb-4 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">ราคาเคาะเริ่มต้น:</span>
                <span className="text-base font-bold text-orange-600">
                  ฿{property.priceStarting.toLocaleString()} บาท
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>ราคาประเมินเจ้าพนักงาน:</span>
                <span>฿{(property.priceAppraised || property.priceStarting).toLocaleString()} บาท</span>
              </div>
              {property.mortgageDebt > 0 ? (
                <div className="flex justify-between text-red-600 font-semibold border-t border-slate-200 pt-1.5">
                  <span className="flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> ภาระจำนองติดไป:
                  </span>
                  <span>+฿{property.mortgageDebt.toLocaleString()} บาท</span>
                </div>
              ) : (
                <div className="flex justify-between text-emerald-600 font-semibold border-t border-slate-200 pt-1.5">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> สถานะทางกฎหมาย:
                  </span>
                  <span>ปลอดภาระจำนอง</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-slate-900 border-t border-slate-200 pt-1.5">
                <span>💰 ยอดที่ต้องจ่ายจริง:</span>
                <span className="text-sm text-red-600">
                  ฿{(property.priceStarting + (property.mortgageDebt || 0)).toLocaleString()} บาท
                </span>
              </div>
              <div className="flex justify-between text-slate-500 pt-1 border-t border-slate-200">
                <span>เลขที่โฉนด / คดี:</span>
                <span className="font-semibold text-slate-700">
                  {property.deedNo} ({property.ledCaseNo})
                </span>
              </div>
            </div>

            {/* FastLED Analytics Summary Box */}
            <div className="bg-slate-900 text-white p-4 rounded-xl mb-4 shadow-sm">
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-amber-400 tracking-wider flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5" /> FASTLEDCHECKER ANALYTICS
                </span>
                {property.dataSourceUrl && (
                  <a
                    href={property.dataSourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-amber-300 underline flex items-center gap-0.5 hover:text-white"
                  >
                    ดูต้นทาง LED <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400">เพดานประมูลสูงสุด (Max Bid):</span>
                  <p className="text-lg font-bold text-amber-400">
                    ฿{maxBidRes.maxBid.toLocaleString()} บาท
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">ประมาณการต้นทุนแฝง:</span>
                  <p className="text-lg font-bold text-red-400">
                    ฿{implicitCosts.totalImplicitCost.toLocaleString()} บาท
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              {property.dataSourceUrl ? (
                <a
                  href={property.dataSourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-center py-2.5 px-4 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>🌐 เปิดดูบน FastLEDChecker.com</span>
                </a>
              ) : (
                <a
                  href="https://www.fastledchecker.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-center py-2.5 px-4 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>🌐 ตรวจสอบบน FastLEDChecker.com</span>
                </a>
              )}
              <button
                onClick={() => onToggleCompare(property)}
                className={`py-2.5 px-4 text-xs font-semibold rounded-xl border transition flex items-center justify-center gap-1.5 ${
                  isCompared
                    ? "bg-orange-50 border-orange-500 text-orange-600"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"
                }`}
              >
                {isCompared ? "✓ เทียบแล้ว" : "+ เปรียบเทียบ"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
