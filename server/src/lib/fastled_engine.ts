export const WOOD_TYPES_PRICING: Record<string, { pricePerCubicMeter: number; factor: number }> = {
  "ไม้สัก (Teak)": { pricePerCubicMeter: 45000, factor: 1.4 },
  "ไม้ประดู่ (Padauk)": { pricePerCubicMeter: 38000, factor: 1.25 },
  "ไม้แดง (Ironwood)": { pricePerCubicMeter: 32000, factor: 1.15 },
  "ไม้เต็ง (Balau)": { pricePerCubicMeter: 28000, factor: 1.0 },
  "ไม้รัง (Yellow Balau)": { pricePerCubicMeter: 25000, factor: 0.9 },
  "ไม้เนื้อแข็งรวม (Mixed Hardwood)": { pricePerCubicMeter: 22000, factor: 0.8 }
};

export const FastLEDCheckerEngine = {
  calculateMaxBid: function (params: {
    marketEstimate: number;
    targetProfitPercent?: number;
    mortgageDebt?: number;
    evictionCostEst?: number;
    renovationCostEst?: number;
  }) {
    const marketEstimate = Number(params.marketEstimate) || 0;
    const targetProfitPercent = Number(params.targetProfitPercent) || 15;
    const mortgageDebt = Number(params.mortgageDebt) || 0;
    const evictionCostEst = Number(params.evictionCostEst) || 0;
    const renovationCostEst = Number(params.renovationCostEst) || 0;

    const estimatedTransferFee = marketEstimate * 0.035;
    const targetProfitAmount = marketEstimate * (targetProfitPercent / 100);
    const totalDeductions =
      targetProfitAmount + mortgageDebt + evictionCostEst + renovationCostEst + estimatedTransferFee;

    let maxBid = marketEstimate - totalDeductions;
    if (maxBid < 0) maxBid = 0;

    const discountFromMarketPercent =
      marketEstimate > 0 ? (((marketEstimate - maxBid) / marketEstimate) * 100).toFixed(1) : "0";

    return {
      maxBid: Math.round(maxBid),
      marketEstimate,
      targetProfitAmount: Math.round(targetProfitAmount),
      mortgageDebt,
      evictionCostEst,
      renovationCostEst,
      estimatedTransferFee: Math.round(estimatedTransferFee),
      totalDeductions: Math.round(totalDeductions),
      discountFromMarketPercent
    };
  },

  calculateWoodValuation: function (params: {
    woodType: string;
    woodVolumeCuM: number;
    pillarCount: number;
    conditionPercent: number;
  }) {
    const woodTypeName = params.woodType || "ไม้สัก (Teak)";
    const woodVolumeCuM = Number(params.woodVolumeCuM) || 10;
    const pillarCount = Number(params.pillarCount) || 12;
    const conditionPercent = Number(params.conditionPercent) || 85;

    const woodMeta =
      WOOD_TYPES_PRICING[woodTypeName] || WOOD_TYPES_PRICING["ไม้เนื้อแข็งรวม (Mixed Hardwood)"];

    const baseMaterialValue = woodVolumeCuM * woodMeta.pricePerCubicMeter;
    const conditionMultiplier = Math.max(0.4, Math.min(1.0, conditionPercent / 100));
    const pillarBonusValue = pillarCount * 5000 * woodMeta.factor;
    const netEstimatedValue = baseMaterialValue * conditionMultiplier + pillarBonusValue;
    const estimatedDismantlingCost = woodVolumeCuM * 4500;
    const priceMin = netEstimatedValue * 0.85;
    const priceMax = netEstimatedValue * 1.15;

    return {
      woodType: woodTypeName,
      woodVolumeCuM,
      pillarCount,
      conditionPercent,
      baseMaterialValue: Math.round(baseMaterialValue),
      pillarBonusValue: Math.round(pillarBonusValue),
      netEstimatedValue: Math.round(netEstimatedValue),
      estimatedDismantlingCost: Math.round(estimatedDismantlingCost),
      recommendedPriceMin: Math.round(priceMin),
      recommendedPriceMax: Math.round(priceMax)
    };
  }
};
