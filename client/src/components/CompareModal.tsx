"use client";

import { PropertyItem, FastLEDCheckerEngine } from "../lib/fastled_engine";
import { X, Trash2 } from "lucide-react";

interface CompareModalProps {
  compareList: PropertyItem[];
  onClose: () => void;
  onRemove: (id: string) => void;
}

export default function CompareModal({ compareList, onClose, onRemove }: CompareModalProps) {
  if (compareList.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <h3 className="text-base font-bold text-slate-900">
            📊 เปรียบเทียบทรัพย์สินและตัวชี้วัด FastLED ({compareList.length}/3 รายการ)
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-3 font-semibold text-slate-600 w-1/4">คุณสมบัติ / รายการ</th>
                {compareList.map((item) => (
                  <th key={item.id} className="p-3 font-bold text-slate-900">
                    <div className="flex items-center justify-between mb-1">
                      <span className="line-clamp-1">{item.title}</span>
                      <button
                        onClick={() => onRemove(item.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="ลบออก"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3 font-semibold text-slate-500">ประเภท</td>
                {compareList.map((item) => (
                  <td key={item.id} className="p-3">
                    {item.type === "led_asset"
                      ? "⚡ ทรัพย์บังคับคดี LED"
                      : item.type === "wooden_building"
                      ? "🪵 สิ่งปลูกสร้างไม้เก่า"
                      : "🏡 อสังหาฯ ทั่วไป"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-500">พื้นที่ตั้ง</td>
                {compareList.map((item) => (
                  <td key={item.id} className="p-3">
                    ต.{item.subdistrict} อ.{item.district}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-500">ราคาเคาะเริ่มต้น / เสนอขาย</td>
                {compareList.map((item) => (
                  <td key={item.id} className="p-3 font-bold text-orange-600 text-sm">
                    ฿{item.priceStarting.toLocaleString()} บาท
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-500">ภาระจำนองติดไป</td>
                {compareList.map((item) => (
                  <td key={item.id} className="p-3 font-semibold text-red-600">
                    {item.mortgageDebt > 0 ? `+฿${item.mortgageDebt.toLocaleString()} บาท` : "ปลอดจำนอง"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-500">เพดานราคาประมูลสูงสุด (Max Bid)</td>
                {compareList.map((item) => {
                  const res = FastLEDCheckerEngine.calculateMaxBid({
                    marketEstimate: item.marketEstimate || item.priceAppraised,
                    targetProfitPercent: 15,
                    mortgageDebt: item.mortgageDebt || 0,
                    evictionCostEst: item.evictionCostEst || 0,
                    renovationCostEst: item.renovationCostEst || 0
                  });
                  return (
                    <td key={item.id} className="p-3 font-bold text-amber-600 text-sm">
                      ฿{res.maxBid.toLocaleString()} บาท
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-500">คดีหมายเลข / โฉนด</td>
                {compareList.map((item) => (
                  <td key={item.id} className="p-3 text-slate-600">
                    {item.ledCaseNo} / {item.deedNo}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
