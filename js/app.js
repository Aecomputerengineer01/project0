/**
 * Main Application Logic for Kalasin Real Estate, LED Foreclosed Assets & Old Wooden Buildings Marketplace
 */

let mapInstance = null;
let mapMarkers = [];
let maxBidChartInstance = null;
let woodValChartInstance = null;
let compareList = [];
let currentRole = "investor"; // guest, investor, vendor, admin

document.addEventListener("DOMContentLoaded", () => {
  initRoleSwitcher();
  initDistrictDropdown();
  initMap();
  renderPropertyList(PROPERTIES_DATA);
  renderContractorsList(CONTRACTORS_DATA);
  setupTabNavigation();
  setupCalculatorForms();
  setupWoodValuationForm();
  setupCompareSystem();
});

/* Role Switcher */
function initRoleSwitcher() {
  const roleSelect = document.getElementById("roleSelect");
  if (roleSelect) {
    roleSelect.addEventListener("change", (e) => {
      currentRole = e.target.value;
      updateRoleUI();
    });
  }
  updateRoleUI();
}

function updateRoleUI() {
  const premiumBadges = document.querySelectorAll(".premium-feature-badge");
  const premiumContent = document.querySelectorAll(".premium-only-content");
  
  if (currentRole === "guest") {
    premiumBadges.forEach(el => el.classList.remove("hidden"));
    premiumContent.forEach(el => el.classList.add("opacity-50", "pointer-events-none"));
  } else {
    premiumBadges.forEach(el => el.classList.add("hidden"));
    premiumContent.forEach(el => el.classList.remove("opacity-50", "pointer-events-none"));
  }
}

/* District Dropdown Initialization */
function initDistrictDropdown() {
  const districtFilter = document.getElementById("districtFilter");
  if (districtFilter) {
    districtFilter.innerHTML = `<option value="all">-- ทุกอำเภอ (18 อำเภอ) --</option>`;
    KALASIN_DISTRICTS.forEach(d => {
      districtFilter.innerHTML += `<option value="${d}">${d}</option>`;
    });
  }
}

/* Setup Tab Navigation */
function setupTabNavigation() {
  const tabs = document.querySelectorAll(".nav-tab");
  const tabContents = document.querySelectorAll(".tab-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const targetId = tab.getAttribute("data-tab");
      tabContents.forEach(content => {
        if (content.id === targetId) {
          content.classList.remove("hidden");
        } else {
          content.classList.add("hidden");
        }
      });

      if (targetId === "tab-map" && mapInstance) {
        setTimeout(() => {
          mapInstance.invalidateSize();
        }, 200);
      }
    });
  });
}

/* Leaflet GIS Map Initialization */
function initMap() {
  const mapElement = document.getElementById("leaflet-map");
  if (!mapElement) return;

  // Center on Kalasin City Center
  mapInstance = L.map("leaflet-map").setView([16.4322, 103.5061], 10);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors | กาฬสินธุ์ Real Estate GIS'
  }).addTo(mapInstance);

  updateMapMarkers(PROPERTIES_DATA);
}

function updateMapMarkers(properties) {
  if (!mapInstance) return;

  // Clear existing markers
  mapMarkers.forEach(m => mapInstance.removeLayer(m));
  mapMarkers = [];

  properties.forEach(item => {
    let iconColor = item.type === "led_asset" ? "#d97706" : (item.type === "wooden_building" ? "#8b5a2b" : "#0284c7");
    
    // Custom Marker Icon
    const customIcon = L.divIcon({
      className: "custom-div-icon",
      html: `<div style="background-color: ${iconColor}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const marker = L.marker([item.lat, item.lng], { icon: customIcon }).addTo(mapInstance);
    
    const popupContent = `
      <div class="p-2 text-sm" style="min-width: 200px;">
        <span class="inline-block px-2 py-0.5 text-xs font-semibold rounded ${item.type === 'led_asset' ? 'badge-led' : (item.type === 'wooden_building' ? 'badge-wood' : 'badge-normal')} mb-1">
          ${item.type === 'led_asset' ? 'ทรัพย์บังคับคดี LED' : (item.type === 'wooden_building' ? 'สิ่งปลูกสร้างไม้เก่า' : 'อสังหาฯ ทั่วไป')}
        </span>
        <h4 class="font-bold text-gray-900 leading-tight mb-1">${item.title}</h4>
        <p class="text-xs text-gray-600 mb-1"><i class="lucide-map-pin text-orange-600"></i> อ.${item.district} จ.กาฬสินธุ์</p>
        <p class="text-sm font-bold text-orange-700">฿${item.priceStarting.toLocaleString()} บาท</p>
        <button onclick="openPropertyDetailModal('${item.id}')" class="mt-2 w-full bg-orange-600 hover:bg-orange-700 text-white text-xs py-1 px-2 rounded transition">
          ดูรายละเอียดเชิงลึก
        </button>
      </div>
    `;

    marker.bindPopup(popupContent);
    mapMarkers.push(marker);
  });
}

/* Render Property Cards */
function renderPropertyList(properties) {
  const container = document.getElementById("propertyGrid");
  if (!container) return;

  if (properties.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12 text-gray-500">
        <i class="lucide-search-x text-4xl mb-2 text-gray-400"></i>
        <p class="text-lg">ไม่พบข้อมูลรายการทรัพย์สินตามเงื่อนไขที่ระบุ</p>
      </div>
    `;
    return;
  }

  container.innerHTML = properties.map(item => {
    const isLed = item.type === "led_asset";
    const isWood = item.type === "wooden_building";
    const isCompared = compareList.some(c => c.id === item.id);

    return `
      <div class="property-card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div class="relative h-48 bg-gray-100 overflow-hidden">
          <img src="${item.images[0]}" alt="${item.title}" class="w-full h-full object-cover">
          <span class="absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-medium shadow-sm ${isLed ? 'badge-led' : (isWood ? 'badge-wood' : 'badge-normal')}">
            ${isLed ? '⚡ ทรัพย์บังคับคดี' : (isWood ? '🪵 สิ่งปลูกสร้างไม้เก่า' : '🏡 อสังหาฯ ทั่วไป')}
          </span>
          <span class="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
            อ.${item.district}
          </span>
        </div>

        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 class="font-bold text-gray-900 text-base leading-snug line-clamp-2 mb-2 hover:text-orange-600 transition">
              ${item.title}
            </h3>
            
            <p class="text-xs text-gray-500 mb-3 flex items-center gap-1">
              <span class="inline-block w-2 h-2 rounded-full ${isLed ? 'bg-amber-500' : 'bg-green-500'}"></span>
              ${item.status}
            </p>

            ${isLed ? `
              <div class="bg-amber-50 rounded-lg p-3 mb-3 text-xs border border-amber-200/80 space-y-1.5">
                <div class="flex justify-between text-gray-500">
                  <span>ราคาประเมิน:</span>
                  <span class="line-through">฿${item.priceAppraised.toLocaleString()}</span>
                </div>
                <div class="flex justify-between font-bold text-amber-900">
                  <span>ราคาเคาะเริ่มต้น:</span>
                  <span class="text-sm text-amber-700">฿${item.priceStarting.toLocaleString()}</span>
                </div>
                ${item.mortgageDebt > 0 ? `
                  <div class="flex justify-between text-xs text-red-600 font-semibold pt-1 border-t border-amber-200/60">
                    <span>🚩 การจำนองติดไป:</span>
                    <span>+฿${item.mortgageDebt.toLocaleString()}</span>
                  </div>
                  <div class="flex justify-between font-extrabold text-slate-900 pt-1 border-t border-amber-200">
                    <span>💰 ราคาจริงที่ต้องจ่าย:</span>
                    <span class="text-sm text-red-600">฿${(item.priceStarting + item.mortgageDebt).toLocaleString()}</span>
                  </div>
                ` : `
                  <div class="flex justify-between text-xs text-emerald-600 font-semibold pt-1 border-t border-amber-200/60">
                    <span>✓ สถานะทางกฎหมาย:</span>
                    <span>ปลอดการจำนอง</span>
                  </div>
                `}
                <div class="text-[11px] text-gray-500 pt-1 flex justify-between">
                  <span>📅 นัดประมูล: ${item.auctionDate || 'ตามรอบศาล'}</span>
                </div>
              </div>
            ` : ''}

            ${item.woodDetails ? `
              <div class="bg-amber-900/5 rounded-lg p-2.5 mb-3 text-xs border border-amber-800/10">
                <div class="flex justify-between text-gray-700 mb-1">
                  <span>โครงสร้างไม้เก่า:</span>
                  <span class="font-semibold text-amber-900">${item.woodDetails.woodType}</span>
                </div>
                <div class="flex justify-between text-gray-700">
                  <span>ปริมาตรไม้ / เสา:</span>
                  <span class="font-semibold">${item.woodDetails.woodVolumeCubicM} ลบ.ม. (${item.woodDetails.woodPillars} เสา)</span>
                </div>
                <div class="flex justify-between text-emerald-700 font-semibold pt-1 border-t border-amber-800/10 mt-1">
                  <span>ประเมินมูลค่าไม้เก่า:</span>
                  <span>฿${item.woodDetails.woodValueEstimate.toLocaleString()}</span>
                </div>
              </div>
            ` : (isWood ? `
              <div class="bg-amber-900/5 rounded-lg p-2.5 mb-3 text-xs border border-amber-800/10">
                <div class="flex justify-between text-gray-700 mb-1">
                  <span>ประเภทไม้หลัก:</span>
                  <span class="font-semibold text-amber-900">${item.woodType || 'ไม้เนื้อแข็ง'}</span>
                </div>
                <div class="flex justify-between text-gray-700">
                  <span>ปริมาตรไม้ประมาณ:</span>
                  <span class="font-semibold">${item.woodVolumeCuM || 0} ลบ.ม.</span>
                </div>
              </div>
            ` : '')}

            ${!isLed && !isWood && !item.woodDetails ? `
              <div class="mb-3">
                <span class="text-xs text-gray-500">ราคาเสนอขาย</span>
                <p class="text-xl font-bold text-orange-600">฿${item.priceStarting.toLocaleString()}</p>
              </div>
            ` : ''}
          </div>

          <div class="pt-3 border-t border-gray-100 flex gap-2">
            <button onclick="openPropertyDetailModal('${item.id}')" class="flex-1 bg-slate-900 hover:bg-orange-600 text-white text-xs py-2 px-3 rounded-lg font-medium transition flex items-center justify-center gap-1">
              <span>รายละเอียด & Analytics</span>
            </button>
            <button onclick="toggleCompareProperty('${item.id}')" class="px-2.5 py-2 rounded-lg text-xs font-medium border ${isCompared ? 'bg-orange-50 border-orange-500 text-orange-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'} transition">
              ${isCompared ? '✓ เทียบแล้ว' : '+ เทียบ'}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

/* Filter Function */
function filterProperties() {
  const districtVal = document.getElementById("districtFilter").value;
  const typeVal = document.getElementById("typeFilter").value;
  const priceVal = document.getElementById("priceFilter").value;
  const searchKeyword = document.getElementById("searchKeyword").value.trim().toLowerCase();

  let filtered = PROPERTIES_DATA.filter(item => {
    if (districtVal !== "all" && item.district !== districtVal) return false;
    if (typeVal !== "all" && item.type !== typeVal) return false;
    
    if (priceVal !== "all") {
      const price = item.priceStarting;
      if (priceVal === "under_500k" && price > 500000) return false;
      if (priceVal === "500k_1m" && (price < 500000 || price > 1000000)) return false;
      if (priceVal === "1m_2m" && (price < 1000000 || price > 2000000)) return false;
      if (priceVal === "over_2m" && price < 2000000) return false;
    }

    if (searchKeyword) {
      const matchTitle = item.title.toLowerCase().includes(searchKeyword);
      const matchAddress = item.address.toLowerCase().includes(searchKeyword);
      const matchWood = item.woodType ? item.woodType.toLowerCase().includes(searchKeyword) : false;
      if (!matchTitle && !matchAddress && !matchWood) return false;
    }

    return true;
  });

  renderPropertyList(filtered);
  updateMapMarkers(filtered);
}

/* Setup Calculator Forms & Chart.js */
function setupCalculatorForms() {
  const form = document.getElementById("fastLedCalcForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    runFastLedCalculation();
  });

  // Auto calculate on input change
  const inputs = form.querySelectorAll("input, select");
  inputs.forEach(input => {
    input.addEventListener("input", runFastLedCalculation);
  });

  runFastLedCalculation();
}

function runFastLedCalculation() {
  const marketVal = parseFloat(document.getElementById("calcMarketVal").value) || 0;
  const roiVal = parseFloat(document.getElementById("calcTargetRoi").value) || 15;
  const debtVal = parseFloat(document.getElementById("calcDebt").value) || 0;
  const evictionVal = parseFloat(document.getElementById("calcEviction").value) || 0;
  const renoVal = parseFloat(document.getElementById("calcReno").value) || 0;

  const result = FastLEDCheckerEngine.calculateMaxBid({
    marketEstimate: marketVal,
    targetProfitPercent: roiVal,
    mortgageDebt: debtVal,
    evictionCostEst: evictionVal,
    renovationCostEst: renoVal
  });

  // Render text outputs
  document.getElementById("outMaxBid").innerText = "฿" + result.maxBid.toLocaleString();
  document.getElementById("outTargetProfit").innerText = "฿" + result.targetProfitAmount.toLocaleString();
  document.getElementById("outDeductions").innerText = "฿" + result.totalDeductions.toLocaleString();
  document.getElementById("outDiscountPercent").innerText = result.discountFromMarketPercent + "%";

  renderMaxBidChart(result);
}

function renderMaxBidChart(res) {
  const ctx = document.getElementById("maxBidChart");
  if (!ctx) return;

  const dataValues = [
    res.maxBid,
    res.targetProfitAmount,
    res.mortgageDebt,
    res.evictionCostEst + res.renovationCostEst,
    res.estimatedTransferFee
  ];

  if (maxBidChartInstance) {
    maxBidChartInstance.destroy();
  }

  maxBidChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['เพดานราคาประมูลสูงสุด', 'กำไรคาดหวัง', 'ภาระจำนองติดไป', 'ค่าปรับปรุง/ฟ้องร้อง', 'ค่าโอนและอากร'],
      datasets: [{
        data: dataValues,
        backgroundColor: ['#d97706', '#10b981', '#ef4444', '#f97316', '#64748b']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom', labels: { font: { family: 'Kanit' } } }
      }
    }
  });
}

/* Wood Valuation Form Handler */
function setupWoodValuationForm() {
  const form = document.getElementById("woodValuationForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    runWoodValuation();
  });

  const inputs = form.querySelectorAll("input, select");
  inputs.forEach(i => i.addEventListener("input", runWoodValuation));

  runWoodValuation();
}

function runWoodValuation() {
  const woodType = document.getElementById("woodTypeSelect").value;
  const volume = parseFloat(document.getElementById("woodVolumeInput").value) || 10;
  const pillars = parseInt(document.getElementById("woodPillarInput").value) || 12;
  const condition = parseFloat(document.getElementById("woodConditionInput").value) || 85;

  const result = FastLEDCheckerEngine.calculateWoodValuation({
    woodType: woodType,
    woodVolumeCuM: volume,
    pillarCount: pillars,
    conditionPercent: condition
  });

  document.getElementById("outWoodValuation").innerText = "฿" + result.netEstimatedValue.toLocaleString();
  document.getElementById("outWoodRange").innerText = `฿${result.recommendedPriceMin.toLocaleString()} - ฿${result.recommendedPriceMax.toLocaleString()}`;
  document.getElementById("outWoodDismantling").innerText = "฿" + result.estimatedDismantlingCost.toLocaleString();
}

/* Render Contractor List */
function renderContractorsList(contractors) {
  const container = document.getElementById("contractorsGrid");
  if (!container) return;

  container.innerHTML = contractors.map(c => `
    <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold px-2 py-0.5 rounded bg-green-100 text-green-800 border border-green-200">
            ✓ ผ่านการรับรอง
          </span>
          <span class="text-xs text-gray-500">ประสบการณ์ ${c.experienceYears} ปี</span>
        </div>
        <h4 class="font-bold text-gray-900 text-base mb-1">${c.name}</h4>
        <p class="text-xs text-orange-600 mb-2"><i class="lucide-map-pin"></i> อ.${c.district} จ.กาฬสินธุ์</p>
        <p class="text-xs text-gray-600 mb-3 bg-gray-50 p-2 rounded">${c.specialty}</p>
      </div>

      <div class="pt-3 border-t border-gray-100 flex items-center justify-between">
        <div class="text-xs">
          <span class="text-amber-500 font-bold">★ ${c.rating}</span>
          <span class="text-gray-400">(${c.reviewsCount} รีวิว)</span>
        </div>
        <a href="tel:${c.phone}" class="bg-orange-600 hover:bg-orange-700 text-white text-xs py-1.5 px-3 rounded-lg font-medium transition flex items-center gap-1">
          📞 โทรติดต่อ
        </a>
      </div>
    </div>
  `).join("");
}

/* Modal and Property Comparison System */
function openPropertyDetailModal(propertyId) {
  const item = PROPERTIES_DATA.find(p => p.id === propertyId);
  if (!item) return;

  const modal = document.getElementById("propertyModal");
  const modalContent = document.getElementById("modalBodyContent");

  const implicitCosts = FastLEDCheckerEngine.calculateImplicitCosts({
    appraisedPrice: item.priceAppraised || item.priceStarting,
    bidPrice: item.priceStarting,
    evictionRisk: item.evictionRisk || "low",
    isWoodenStructure: item.type === "wooden_building",
    woodVolumeCuM: item.woodVolumeCuM || 0
  });

  const maxBidRes = FastLEDCheckerEngine.calculateMaxBid({
    marketEstimate: item.marketEstimate || item.priceAppraised,
    targetProfitPercent: 15,
    mortgageDebt: item.mortgageDebt || 0,
    evictionCostEst: item.evictionCostEst || 0,
    renovationCostEst: item.renovationCostEst || 0
  });

  modalContent.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <img src="${item.images[0]}" alt="${item.title}" class="w-full h-64 object-cover rounded-xl mb-3 shadow">
        <div class="grid grid-cols-2 gap-2">
          ${item.images.slice(1).map(img => `<img src="${img}" class="w-full h-24 object-cover rounded-lg">`).join('')}
        </div>
      </div>

      <div>
        <span class="text-xs font-semibold px-2.5 py-1 rounded ${item.type === 'led_asset' ? 'badge-led' : (item.type === 'wooden_building' ? 'badge-wood' : 'badge-normal')} mb-2 inline-block">
          ${item.type === 'led_asset' ? 'ทรัพย์บังคับคดี' : (item.type === 'wooden_building' ? 'สิ่งปลูกสร้างไม้เก่า' : 'อสังหาฯ ทั่วไป')}
        </span>
        <h2 class="text-xl font-bold text-gray-900 leading-tight mb-2">${item.title}</h2>
        <p class="text-xs text-gray-500 mb-4"><i class="lucide-map-pin"></i> ${item.address}</p>

        <div class="bg-gray-50 p-3.5 rounded-xl mb-3 text-sm space-y-1.5 border border-gray-200">
          <div class="flex justify-between"><span class="text-gray-600">ราคาเปิดประมูล / เริ่มต้น:</span> <span class="font-bold text-orange-600 text-base">฿${item.priceStarting.toLocaleString()}</span></div>
          <div class="flex justify-between text-xs text-gray-500"><span>ราคาประเมินเจ้าพนักงาน:</span> <span>฿${(item.priceAppraised || item.priceStarting).toLocaleString()}</span></div>
          ${item.mortgageDebt ? `<div class="flex justify-between text-xs text-red-600 font-semibold border-t border-gray-200 pt-1"><span>🚩 ภาระจำนองติดไป:</span> <span>+฿${item.mortgageDebt.toLocaleString()}</span></div>
          <div class="flex justify-between text-xs text-slate-900 font-bold border-t border-gray-200 pt-1"><span>💰 ยอดจ่ายจริง (เคาะ+จำนอง):</span> <span class="text-red-600">฿${(item.realTotalPayment || (item.priceStarting + item.mortgageDebt)).toLocaleString()}</span></div>` : '<div class="flex justify-between text-xs text-emerald-600 font-semibold"><span>สถานะทางกฎหมาย:</span> <span>✓ ปลอดภาระผูกพัน / ปลอดจำนอง</span></div>'}
          <div class="flex justify-between text-xs text-gray-500 pt-1 border-t border-gray-200"><span>หลักประกันเข้าประมูล:</span> <span class="font-semibold text-gray-800">฿${(item.reserveFund || 50000).toLocaleString()} บาท</span></div>
          <div class="flex justify-between text-xs text-gray-500"><span>เลขโฉนด / ระวาง:</span> <span class="font-semibold text-gray-800">${item.deedNo || 'ตามระวางศาล'}</span></div>
          <div class="flex justify-between text-xs text-gray-500"><span>สถานที่จัดประมูล:</span> <span class="text-right text-gray-700">${item.saleLocation || 'สำนักงานบังคับคดีจังหวัดกาฬสินธุ์'}</span></div>
        </div>

        ${item.woodDetails ? `
          <div class="bg-amber-950/10 p-3.5 rounded-xl mb-3 border border-amber-800/20 text-xs space-y-1">
            <h4 class="font-bold text-amber-900 text-sm mb-1">🪵 ข้อมูลการประเมินเนื้อไม้สิ่งปลูกสร้าง</h4>
            <div class="flex justify-between"><span>ประเภทไม้หลัก:</span> <span class="font-bold text-amber-900">${item.woodDetails.woodType}</span></div>
            <div class="flex justify-between"><span>ปริมาตรไม้ / จำนวนเสา:</span> <span>${item.woodDetails.woodVolumeCubicM} ลบ.ม. (${item.woodDetails.woodPillars} เสา)</span></div>
            <div class="flex justify-between"><span>สภาพความสมบูรณ์:</span> <span>${item.woodDetails.woodConditionPercent}%</span></div>
            <div class="flex justify-between font-bold text-emerald-700 pt-1 border-t border-amber-800/10"><span>มูลค่าไม้ประเมินสุทธิ:</span> <span>฿${item.woodDetails.woodValueEstimate.toLocaleString()} บาท</span></div>
          </div>
        ` : ''}

        <div class="calc-output-card p-4 rounded-xl mb-4">
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-bold text-xs uppercase tracking-wider text-amber-400">FastLEDChecker Analytics Summary</h4>
            ${item.dataSourceUrl ? `<a href="${item.dataSourceUrl}" target="_blank" rel="noopener noreferrer" class="text-[11px] text-amber-300 underline font-medium hover:text-white">🔗 ดูต้นทาง FastLEDChecker ↗</a>` : ''}
          </div>
          <div class="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span class="text-gray-400">เพดานราคาประมูลสูงสุด:</span>
              <p class="text-lg font-bold text-amber-400">฿${maxBidRes.maxBid.toLocaleString()}</p>
            </div>
            <div>
              <span class="text-gray-400">ประมาณการต้นทุนแฝง:</span>
              <p class="text-lg font-bold text-red-400">฿${implicitCosts.totalImplicitCost.toLocaleString()}</p>
            </div>
          </div>
          <div class="mt-2 pt-2 border-t border-slate-700/60 text-[11px] text-slate-300 flex justify-between">
            <span>คดีหมายเลข: ${item.ledCaseNo || 'N/A'}</span>
            <span>ศาล: ${item.ledCourt || 'ศาลจังหวัดกาฬสินธุ์'}</span>
          </div>
        </div>

        <div class="flex gap-2">
          ${item.dataSourceUrl ? `
            <a href="${item.dataSourceUrl}" target="_blank" rel="noopener noreferrer" class="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-center py-2.5 px-4 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1">
              <span>🌐 เปิดดูบน FastLEDChecker</span>
            </a>
          ` : `
            <a href="tel:043811481" class="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-center py-2.5 px-4 rounded-xl text-xs font-semibold transition">
              📞 บังคับคดีกาฬสินธุ์ (043-811481)
            </a>
          `}
          <button onclick="toggleCompareProperty('${item.id}')" class="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-xl transition">
            + เปรียบเทียบ
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
}

function closeModal() {
  document.getElementById("propertyModal").classList.add("hidden");
}

/* Compare System Drawer */
function setupCompareSystem() {
  updateCompareDrawer();
}

function toggleCompareProperty(id) {
  const index = compareList.findIndex(c => c.id === id);
  if (index >= 0) {
    compareList.splice(index, 1);
  } else {
    if (compareList.length >= 3) {
      alert("เปรียบเทียบได้สูงสุด 3 รายการพร้อมกัน");
      return;
    }
    const item = PROPERTIES_DATA.find(p => p.id === id);
    if (item) compareList.push(item);
  }

  updateCompareDrawer();
  renderPropertyList(PROPERTIES_DATA);
}

function updateCompareDrawer() {
  const drawer = document.getElementById("compareDrawer");
  if (!drawer) return;

  if (compareList.length > 0) {
    drawer.classList.remove("hidden");
    document.getElementById("compareCount").innerText = compareList.length;
  } else {
    drawer.classList.add("hidden");
  }
}

function openCompareModal() {
  if (compareList.length === 0) return;

  const container = document.getElementById("compareTableContainer");
  
  container.innerHTML = `
    <div class="overflow-x-auto">
      <table class="w-full text-sm text-left border-collapse">
        <thead>
          <tr class="bg-gray-100 border-b">
            <th class="p-3">คุณสมบัติ</th>
            ${compareList.map(item => `<th class="p-3 font-bold text-gray-900">${item.title}</th>`).join('')}
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr>
            <td class="p-3 font-semibold text-gray-600">ประเภท</td>
            ${compareList.map(item => `<td class="p-3">${item.type === 'led_asset' ? 'ทรัพย์บังคับคดี' : (item.type === 'wooden_building' ? 'สิ่งปลูกสร้างไม้เก่า' : 'อสังหาฯ ทั่วไป')}</td>`).join('')}
          </tr>
          <tr>
            <td class="p-3 font-semibold text-gray-600">อำเภอ</td>
            ${compareList.map(item => `<td class="p-3">อ.${item.district}</td>`).join('')}
          </tr>
          <tr>
            <td class="p-3 font-semibold text-gray-600">ราคาเปิดประมูล / ขาย</td>
            ${compareList.map(item => `<td class="p-3 font-bold text-orange-600">฿${item.priceStarting.toLocaleString()}</td>`).join('')}
          </tr>
          <tr>
            <td class="p-3 font-semibold text-gray-600">ภาระจำนองติดไป</td>
            ${compareList.map(item => `<td class="p-3 text-red-600">${item.mortgageDebt ? '฿' + item.mortgageDebt.toLocaleString() : 'ไม่มี'}</td>`).join('')}
          </tr>
          <tr>
            <td class="p-3 font-semibold text-gray-600">เพดานราคาประมูลสูงสุด (Max Bid)</td>
            ${compareList.map(item => {
              const res = FastLEDCheckerEngine.calculateMaxBid({ marketEstimate: item.marketEstimate || item.priceAppraised, targetProfitPercent: 15, mortgageDebt: item.mortgageDebt || 0, evictionCostEst: item.evictionCostEst || 0, renovationCostEst: item.renovationCostEst || 0 });
              return `<td class="p-3 font-bold text-amber-600">฿${res.maxBid.toLocaleString()}</td>`;
            }).join('')}
          </tr>
        </tbody>
      </table>
    </div>
  `;

  document.getElementById("compareModal").classList.remove("hidden");
}

function closeCompareModal() {
  document.getElementById("compareModal").classList.add("hidden");
}
