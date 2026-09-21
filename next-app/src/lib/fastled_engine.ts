/**
 * FastLEDChecker Analytics Engine & Types
 */

export interface PropertyItem {
  id: string;
  title: string;
  type: "led_asset" | "wooden_building" | "normal";
  assetCategory: string;
  district: string;
  subdistrict: string;
  address: string;
  deedNo: string;
  priceStarting: number;
  priceAppraised: number;
  marketEstimate: number;
  mortgageDebt: number;
  realTotalPayment: number;
  auctionDate: string;
  competitorStatus: string;
  isMortgageAttached: boolean;
  evictionRisk: "low" | "medium" | "high" | "none";
  evictionCostEst: number;
  renovationCostEst: number;
  areaSqW: number;
  usableAreaSqM: number;
  lat: number;
  lng: number;
  status: string;
  ledCourt: string;
  ledCaseNo: string;
  reserveFund: number;
  saleLocation: string;
  dataSourceUrl: string;
  images: string[];
  features: string[];
  contactName?: string;
  contactPhone?: string;
  hasExistingStructure?: boolean;
  woodDetails?: {
    woodType: string;
    woodVolumeCubicM: number;
    woodPillars: number;
    woodConditionPercent: number;
    woodValueEstimate: number;
    salvageFeasibility: string;
  };
  woodType?: string;
  woodVolumeCuM?: number;
  isUserSubmitted?: boolean;
  fastLedId?: string;
  [key: string]: any;
}

export interface ContractorItem {
  id: string;
  name: string;
  district: string;
  phone: string;
  experienceYears: number;
  specialty: string;
  rating?: number;
  reviewsCount?: number;
  completedJobs?: number;
  [key: string]: any;
}

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
      marketEstimate: marketEstimate,
      targetProfitAmount: Math.round(targetProfitAmount),
      mortgageDebt: mortgageDebt,
      evictionCostEst: evictionCostEst,
      renovationCostEst: renovationCostEst,
      estimatedTransferFee: Math.round(estimatedTransferFee),
      totalDeductions: Math.round(totalDeductions),
      discountFromMarketPercent: discountFromMarketPercent
    };
  },

  calculateImplicitCosts: function (params: {
    appraisedPrice: number;
    bidPrice: number;
    evictionRisk?: string;
    isWoodenStructure?: boolean;
    woodVolumeCuM?: number;
  }) {
    const appraisedPrice = Number(params.appraisedPrice) || 0;
    const bidPrice = Number(params.bidPrice) || 0;
    const evictionRisk = params.evictionRisk || "medium";
    const isWoodenStructure = params.isWoodenStructure || false;
    const woodVolumeCuM = Number(params.woodVolumeCuM) || 0;

    const transferFee = appraisedPrice * 0.02;
    const withholdingTax = appraisedPrice * 0.01;
    const stampDuty = bidPrice * 0.005;

    let evictionFee = 0;
    if (evictionRisk === "high") evictionFee = 120000;
    else if (evictionRisk === "medium") evictionFee = 60000;
    else if (evictionRisk === "low") evictionFee = 25000;

    let dismantlingFee = 0;
    if (isWoodenStructure && woodVolumeCuM > 0) {
      dismantlingFee = woodVolumeCuM * 4500;
    }

    const totalImplicitCost = transferFee + withholdingTax + stampDuty + evictionFee + dismantlingFee;

    return {
      transferFee: Math.round(transferFee),
      withholdingTax: Math.round(withholdingTax),
      stampDuty: Math.round(stampDuty),
      evictionFee: Math.round(evictionFee),
      dismantlingFee: Math.round(dismantlingFee),
      totalImplicitCost: Math.round(totalImplicitCost),
      implicitCostRatioPercent: bidPrice > 0 ? ((totalImplicitCost / bidPrice) * 100).toFixed(1) : "0"
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
      woodVolumeCuM: woodVolumeCuM,
      pillarCount: pillarCount,
      conditionPercent: conditionPercent,
      baseMaterialValue: Math.round(baseMaterialValue),
      pillarBonusValue: Math.round(pillarBonusValue),
      netEstimatedValue: Math.round(netEstimatedValue),
      estimatedDismantlingCost: Math.round(estimatedDismantlingCost),
      recommendedPriceMin: Math.round(priceMin),
      recommendedPriceMax: Math.round(priceMax)
    };
  }
};
