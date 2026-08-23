/**
 * FastLEDChecker Analytics Engine
 * Core algorithms for Legal Execution Department (LED) Foreclosed Asset Valuation,
 * Maximum Bid calculation, Implicit Cost Estimation, and Old Wood Valuation Engine.
 */

const FastLEDCheckerEngine = {
  /**
   * Calculate Maximum Bid Price (เพดานราคาประมูลสูงสุด)
   * Formula:
   * Max Bid = Target Asset Value - (Target Profit + Mortgage Debt + Eviction Cost + Renovation Cost + Transfer Tax & Fees)
   */
  calculateMaxBid: function(params) {
    const marketEstimate = parseFloat(params.marketEstimate) || 0;
    const targetProfitPercent = parseFloat(params.targetProfitPercent) || 15; // default 15% ROI
    const mortgageDebt = parseFloat(params.mortgageDebt) || 0;
    const evictionCostEst = parseFloat(params.evictionCostEst) || 0;
    const renovationCostEst = parseFloat(params.renovationCostEst) || 0;
    
    // Transfer Tax & Fees Estimation (approx 3.5% of appraisal or transaction value)
    const estimatedTransferFee = marketEstimate * 0.035;

    // Target Profit amount in THB
    const targetProfitAmount = marketEstimate * (targetProfitPercent / 100);

    // Total deductions
    const totalDeductions = targetProfitAmount + mortgageDebt + evictionCostEst + renovationCostEst + estimatedTransferFee;

    // Maximum Safe Bid
    let maxBid = marketEstimate - totalDeductions;
    if (maxBid < 0) maxBid = 0;

    // Discount percentage compared to market value
    const discountFromMarketPercent = marketEstimate > 0 
      ? (((marketEstimate - maxBid) / marketEstimate) * 100).toFixed(1)
      : 0;

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

  /**
   * Calculate Implicit Costs (ประเมินต้นทุนแฝง)
   * Includes Government Taxes (โอน/ภาษี/อากร), Litigation Costs, Repairs, and Wood Dismantling Fees
   */
  calculateImplicitCosts: function(params) {
    const appraisedPrice = parseFloat(params.appraisedPrice) || 0;
    const bidPrice = parseFloat(params.bidPrice) || 0;
    const evictionRisk = params.evictionRisk || "medium"; // low, medium, high
    const isWoodenStructure = params.isWoodenStructure || false;
    const woodVolumeCuM = parseFloat(params.woodVolumeCuM) || 0;

    // 1. Government Transfer Fee (2% split or full, LED buyer often pays 2% of appraised price)
    const transferFee = appraisedPrice * 0.02;

    // 2. Withholding Tax (approx 1% for legal execution)
    const withholdingTax = appraisedPrice * 0.01;

    // 3. Stamp Duty (0.5%)
    const stampDuty = bidPrice * 0.005;

    // 4. Eviction Litigation Risk Fee
    let evictionFee = 0;
    if (evictionRisk === "high") evictionFee = 120000;
    else if (evictionRisk === "medium") evictionFee = 60000;
    else if (evictionRisk === "low") evictionFee = 25000;

    // 5. Wood Dismantling & Transport Fee (if wooden structure)
    let dismantlingFee = 0;
    if (isWoodenStructure && woodVolumeCuM > 0) {
      // average 4,500 THB per cubic meter for careful dismantling & transport
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
      implicitCostRatioPercent: bidPrice > 0 ? ((totalImplicitCost / bidPrice) * 100).toFixed(1) : 0
    };
  },

  /**
   * Wood Valuation Engine (ประเมินมูลค่าสิ่งปลูกสร้างไม้เก่า)
   * Calculates market value based on wood type, cubic meters, pillar count, and condition
   */
  calculateWoodValuation: function(params) {
    const woodTypeName = params.woodType || "ไม้สัก (Teak)";
    const woodVolumeCuM = parseFloat(params.woodVolumeCuM) || 10;
    const pillarCount = parseInt(params.pillarCount) || 12;
    const conditionPercent = parseFloat(params.conditionPercent) || 85; // 0-100%

    const woodMeta = WOOD_TYPES_PRICING[woodTypeName] || WOOD_TYPES_PRICING["ไม้เนื้อแข็งรวม (Mixed Hardwood)"];
    
    // Base wood material value
    const baseMaterialValue = woodVolumeCuM * woodMeta.pricePerCubicMeter;

    // Condition multiplier (e.g. 85% condition = 0.85 multiplier)
    const conditionMultiplier = Math.max(0.4, Math.min(1.0, conditionPercent / 100));

    // Pillar bonus value (hardwood pillars are premium assets, approx 5,000 THB per pillar)
    const pillarBonusValue = pillarCount * 5000 * woodMeta.factor;

    // Net Estimated Wood Valuation
    const netEstimatedValue = (baseMaterialValue * conditionMultiplier) + pillarBonusValue;

    // Estimated Dismantling & Transport Cost
    const estimatedDismantlingCost = woodVolumeCuM * 4500;

    // Recommended Selling Price Range
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
  },

  /**
   * Calculate ROI & Payback Period
   */
  calculateRoiAndPayback: function(params) {
    const totalInvestment = parseFloat(params.totalInvestment) || 1000000;
    const expectedMonthlyRent = parseFloat(params.expectedMonthlyRent) || 8000;
    const annualMaintenanceCost = parseFloat(params.annualMaintenanceCost) || 10000;

    const annualGrossRent = expectedMonthlyRent * 12;
    const annualNetIncome = annualGrossRent - annualMaintenanceCost;

    const grossYieldPercent = totalInvestment > 0 ? ((annualGrossRent / totalInvestment) * 100).toFixed(2) : 0;
    const netRoiPercent = totalInvestment > 0 ? ((annualNetIncome / totalInvestment) * 100).toFixed(2) : 0;
    const paybackPeriodYears = annualNetIncome > 0 ? (totalInvestment / annualNetIncome).toFixed(1) : "N/A";

    return {
      totalInvestment: totalInvestment,
      annualGrossRent: Math.round(annualGrossRent),
      annualNetIncome: Math.round(annualNetIncome),
      grossYieldPercent: grossYieldPercent,
      netRoiPercent: netRoiPercent,
      paybackPeriodYears: paybackPeriodYears
    };
  }
};
