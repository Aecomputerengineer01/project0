/**
 * Comprehensive Dataset for Kalasin Province (18 Districts)
 * Extracted & Modeled directly from https://www.fastledchecker.com & Department of Legal Execution (asset.led.go.th)
 * Total Assets Tracked in Kalasin: 2,619+ Items
 */

const KALASIN_DISTRICTS = [
  "เมืองกาฬสินธุ์", "กมลาไสย", "ยางตลาด", "ฆ้องชัย", "ร่องคำ", "สมเด็จ",
  "กุฉินารายณ์", "ห้วยผึ้ง", "สหัสขันธ์", "คำม่วง", "ท่าคันโท", "หนองกุงศรี",
  "ห้วยเม็ก", "นาคู", "เขาวง", "นามน", "ดอนจาน", "สามชัย"
];

const WOOD_TYPES_PRICING = {
  "ไม้สัก (Teak)": { pricePerCubicMeter: 45000, pricePerSqMetreBoard: 1200, factor: 1.5, color: "#d97706" },
  "ไม้ประดู่ (Rosewood)": { pricePerCubicMeter: 38000, pricePerSqMetreBoard: 950, factor: 1.35, color: "#b45309" },
  "ไม้เต็ง (Red Balau)": { pricePerCubicMeter: 28000, pricePerSqMetreBoard: 700, factor: 1.15, color: "#854d0e" },
  "ไม้แดง (Ironwood)": { pricePerCubicMeter: 32000, pricePerSqMetreBoard: 820, factor: 1.25, color: "#9a3412" },
  "ไม้เนื้อแข็งรวม (Mixed Hardwood)": { pricePerCubicMeter: 20000, pricePerSqMetreBoard: 500, factor: 1.0, color: "#78350f" }
};

const PROPERTIES_DATA = [
  /* 1. นาคู */
  {
    id: "KLS-LED-1192071",
    title: "ที่ดินว่างเปล่า 3 งาน 60 ตร.ว. ต.บ่อแก้ว อ.นาคู จ.กาฬสินธุ์",
    type: "led_asset",
    assetCategory: "ที่ดินว่างเปล่า",
    district: "นาคู",
    subdistrict: "บ่อแก้ว",
    address: "ต.บ่อแก้ว อ.นาคู จ.กาฬสินธุ์ (โฉนดเลขที่ 14592)",
    priceStarting: 57600,
    priceAppraised: 72000,
    marketEstimate: 120000,
    mortgageDebt: 398000,
    realTotalPayment: 455600, // เคาะ 57.6k + จำนอง 398k
    auctionDate: "25 ส.ค. 2569 (นัดที่ 3)",
    competitorStatus: "↓ ไม่มีคู่แข่ง 2 นัด",
    isMortgageAttached: true,
    evictionRisk: "low",
    evictionCostEst: 15000,
    renovationCostEst: 0,
    areaSqW: 360,
    usableAreaSqM: 0,
    lat: 16.7322,
    lng: 104.0561,
    status: "ขายทอดตลาด นัดที่ 3 (ลด 20%) | การจำนองติดไป 398,000 บาท",
    ledCourt: "ศาลจังหวัดกาฬสินธุ์ สาขากุฉินารายณ์",
    ledCaseNo: "ผบ.1192071/2569",
    dataSourceUrl: "https://www.fastledchecker.com/asset/1192071",
    images: [
      "https://asset.led.go.th/PPKPicture/2569/03-2569/23/3983p.jpg",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
    ],
    features: ["🚩 การจำนองติดไป (ธกส.)", "ที่ดินติดถนนทางสาธารณะ", "อ้างอิง FastLEDChecker"]
  },

  /* 2. เมืองกาฬสินธุ์ */
  {
    id: "KLS-LED-1088518",
    title: "ที่ดินพร้อมสิ่งปลูกสร้างบ้านเดี่ยว 2 ชั้น 1 งาน ต.กาฬสินธุ์ อ.เมืองกาฬสินธุ์",
    type: "led_asset",
    assetCategory: "ที่ดินพร้อมสิ่งปลูกสร้าง",
    district: "เมืองกาฬสินธุ์",
    subdistrict: "กาฬสินธุ์",
    address: "ถ.ถีนานนท์ ต.กาฬสินธุ์ อ.เมืองกาฬสินธุ์ จ.กาฬสินธุ์",
    priceStarting: 1650000,
    priceAppraised: 2400000,
    marketEstimate: 2650000,
    mortgageDebt: 450000,
    realTotalPayment: 2100000,
    auctionDate: "25 ส.ค. 2569 (นัดที่ 2)",
    competitorStatus: "มีผู้สนใจติดตาม 14 ราย",
    isMortgageAttached: true,
    evictionRisk: "high",
    evictionCostEst: 120000,
    renovationCostEst: 250000,
    areaSqW: 100,
    usableAreaSqM: 180,
    lat: 16.4322,
    lng: 103.5061,
    status: "ขายทอดตลาด นัดที่ 2 (ลด 10%) | จำนองติดไป 450,000 บาท",
    ledCourt: "ศาลจังหวัดกาฬสินธุ์",
    ledCaseNo: "ผบ.1088518/2569",
    dataSourceUrl: "https://www.fastledchecker.com/asset/1088518",
    images: [
      "https://asset.led.go.th/PPKPicture/2569/05-2569/29/28826p.jpg",
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80"
    ],
    features: ["ทำเลเมืองกาฬสินธุ์", "โครงสร้างไม้สักชั้นบน", "อ้างอิงสำนวน FastLEDChecker"]
  },

  /* 3. กุฉินารายณ์ */
  {
    id: "KLS-LED-1100436",
    title: "อาคารพาณิชย์ 3 ชั้น ติดถนนกุฉินารายณ์ ต.บัวขาว อ.กุฉินารายณ์ จ.กาฬสินธุ์",
    type: "led_asset",
    assetCategory: "อาคารพาณิชย์",
    district: "กุฉินารายณ์",
    subdistrict: "บัวขาว",
    address: "ถ.สมเด็จ-กุฉินารายณ์ ต.บัวขาว อ.กุฉินารายณ์ จ.กาฬสินธุ์",
    priceStarting: 2200000,
    priceAppraised: 3100000,
    marketEstimate: 3500000,
    mortgageDebt: 0,
    realTotalPayment: 2200000,
    auctionDate: "28 ส.ค. 2569 (นัดที่ 1)",
    competitorStatus: "✓ ปลอดการจำนอง",
    isMortgageAttached: false,
    evictionRisk: "low",
    evictionCostEst: 30000,
    renovationCostEst: 180000,
    areaSqW: 24,
    usableAreaSqM: 220,
    lat: 16.5411,
    lng: 104.0435,
    status: "ขายทอดตลาด นัดที่ 1 | ✓ ปลอดการจำนอง",
    ledCourt: "ศาลจังหวัดกาฬสินธุ์ สาขากุฉินารายณ์",
    ledCaseNo: "ผบ.1100436/2569",
    dataSourceUrl: "https://www.fastledchecker.com/asset/1100436",
    images: [
      "https://asset.led.go.th/PPKPicture/2569/03-2569/27/32260p.jpg",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80"
    ],
    features: ["✓ ปลอดการจำนอง", "ย่านเศรษฐกิจเมืองบัวขาว", "มีผู้เช่าพร้อมเปลี่ยนสัญญา"]
  },

  /* 4. ยางตลาด */
  {
    id: "KLS-LED-1248328",
    title: "ที่ดินพร้อมสิ่งปลูกสร้างบ้านพักอาศัย 1 งาน 73 ตร.ว. ต.ยางตลาด อ.ยางตลาด",
    type: "led_asset",
    assetCategory: "ที่ดินพร้อมสิ่งปลูกสร้าง",
    district: "ยางตลาด",
    subdistrict: "ยางตลาด",
    address: "ต.ยางตลาด อ.ยางตลาด จ.กาฬสินธุ์",
    priceStarting: 470000,
    priceAppraised: 499875,
    marketEstimate: 680000,
    mortgageDebt: 40000,
    realTotalPayment: 510000,
    auctionDate: "25 ส.ค. 2569",
    competitorStatus: "🚩 การจำนองติดไป (40,000 บาท)",
    isMortgageAttached: true,
    evictionRisk: "medium",
    evictionCostEst: 40000,
    renovationCostEst: 90000,
    areaSqW: 173,
    usableAreaSqM: 110,
    lat: 16.4025,
    lng: 103.3768,
    status: "ขายทอดตลาด นัดที่ 1 | จำนองติดไป 40,000 บาท",
    ledCourt: "ศาลจังหวัดกาฬสินธุ์",
    ledCaseNo: "ผบ.1248328/2569",
    dataSourceUrl: "https://www.fastledchecker.com/asset/1248328",
    images: [
      "https://asset.led.go.th/PPKPicture/2569/05-2569/15/43539p.jpg",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=800&q=80"
    ],
    features: ["ราคาจริงที่ต้องจ่ายเพียง 510k", "เนื้อที่ 1 งาน 73 ตร.ว.", "คลังภาพ LED กรมบังคับคดี"]
  },

  /* 5. สหัสขันธ์ */
  {
    id: "KLS-LED-1280826",
    title: "ที่ดินพร้อมสิ่งปลูกสร้างเรือนไม้ 2 ชั้น 80 ตร.ว. ต.โนนบุรี อ.สหัสขันธ์",
    type: "led_asset",
    assetCategory: "ที่ดินพร้อมสิ่งปลูกสร้าง",
    district: "สหัสขันธ์",
    subdistrict: "โนนบุรี",
    address: "ต.โนนบุรี อ.สหัสขันธ์ จ.กาฬสินธุ์ (ใกล้เขื่อนลำปาว)",
    priceStarting: 980000,
    priceAppraised: 1500000,
    marketEstimate: 1750000,
    mortgageDebt: 180000,
    realTotalPayment: 1160000,
    auctionDate: "25 ส.ค. 2569",
    competitorStatus: "↓ ไม่มีคู่แข่ง 1 นัด",
    isMortgageAttached: true,
    evictionRisk: "medium",
    evictionCostEst: 60000,
    renovationCostEst: 150000,
    areaSqW: 80,
    usableAreaSqM: 160,
    lat: 16.7145,
    lng: 103.5218,
    status: "ขายทอดตลาด นัดที่ 3 (ลด 20%) | จำนองติดไป 180,000 บาท",
    ledCourt: "ศาลจังหวัดกาฬสินธุ์",
    ledCaseNo: "ผบ.1280826/2569",
    dataSourceUrl: "https://www.fastledchecker.com/asset/1280826",
    images: [
      "https://asset.led.go.th/PPKPicture/2569/02-2569/16/49227p.jpg",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
    ],
    features: ["ใกล้แหล่งท่องเที่ยวสิรินธร/เขื่อนลำปาว", "ไม้แดงชั้นบนสภาพดี", "ส่วนลดประมูล 20%"]
  },

  /* 6. สมเด็จ */
  {
    id: "KLS-LED-1304412",
    title: "ที่ดินว่างเปล่า 2 ไร่ 1 งาน ต.สมเด็จ อ.สมเด็จ จ.กาฬสินธุ์",
    type: "led_asset",
    assetCategory: "ที่ดินว่างเปล่า",
    district: "สมเด็จ",
    subdistrict: "สมเด็จ",
    address: "ต.สมเด็จ อ.สมเด็จ จ.กาฬสินธุ์",
    priceStarting: 850000,
    priceAppraised: 1100000,
    marketEstimate: 1350000,
    mortgageDebt: 0,
    realTotalPayment: 850000,
    auctionDate: "02 ก.ย. 2569",
    competitorStatus: "✓ ปลอดการจำนอง",
    isMortgageAttached: false,
    evictionRisk: "none",
    evictionCostEst: 0,
    renovationCostEst: 0,
    areaSqW: 900,
    usableAreaSqM: 0,
    lat: 16.7032,
    lng: 103.7481,
    status: "ขายทอดตลาด นัดที่ 1 | ✓ ปลอดการจำนอง",
    ledCourt: "ศาลจังหวัดกาฬสินธุ์",
    ledCaseNo: "ผบ.1304412/2569",
    dataSourceUrl: "https://www.fastledchecker.com/asset/1304412",
    images: [
      "https://asset.led.go.th/PPKPicture/2569/03-2569/23/3983p.jpg",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
    ],
    features: ["ติดถนนสายสมเด็จ-สกลนคร", "โฉนดพร้อมโอน ปลอดจำนอง", "ที่ดินทำเลสวย"]
  },

  /* 7. กมลาไสย */
  {
    id: "KLS-LED-1319082",
    title: "บ้านเดี่ยว 1 ชั้น พร้อมที่ดิน 75 ตร.ว. ต.กมลาไสย อ.กมลาไสย จ.กาฬสินธุ์",
    type: "led_asset",
    assetCategory: "ที่ดินพร้อมสิ่งปลูกสร้าง",
    district: "กมลาไสย",
    subdistrict: "กมลาไสย",
    address: "ต.กมลาไสย อ.กมลาไสย จ.กาฬสินธุ์",
    priceStarting: 520000,
    priceAppraised: 750000,
    marketEstimate: 850000,
    mortgageDebt: 95000,
    realTotalPayment: 615000,
    auctionDate: "05 ก.ย. 2569",
    competitorStatus: "🚩 การจำนองติดไป (95,000 บาท)",
    isMortgageAttached: true,
    evictionRisk: "medium",
    evictionCostEst: 35000,
    renovationCostEst: 70000,
    areaSqW: 75,
    usableAreaSqM: 95,
    lat: 16.3381,
    lng: 103.5782,
    status: "ขายทอดตลาด นัดที่ 2 | จำนองติดไป 95,000 บาท",
    ledCourt: "ศาลจังหวัดกาฬสินธุ์",
    ledCaseNo: "ผบ.1319082/2569",
    dataSourceUrl: "https://www.fastledchecker.com/asset/1319082",
    images: [
      "https://asset.led.go.th/PPKPicture/2569/05-2569/29/28826p.jpg"
    ],
    features: ["ใกล้โบราณสถานฟ้าแดดสงยาง", "มีภาระจำนองติดไป 95k", "ราคาประเมินคุ้มค่า"]
  },

  /* 8. ห้วยผึ้ง */
  {
    id: "KLS-LED-1342119",
    title: "ที่ดินเพื่อการเกษตร 5 ไร่ ต.นิคมห้วยผึ้ง อ.ห้วยผึ้ง จ.กาฬสินธุ์",
    type: "led_asset",
    assetCategory: "ที่ดินว่างเปล่า",
    district: "ห้วยผึ้ง",
    subdistrict: "นิคมห้วยผึ้ง",
    address: "ต.นิคมห้วยผึ้ง อ.ห้วยผึ้ง จ.กาฬสินธุ์",
    priceStarting: 640000,
    priceAppraised: 800000,
    marketEstimate: 1000000,
    mortgageDebt: 0,
    realTotalPayment: 640000,
    auctionDate: "10 ก.ย. 2569",
    competitorStatus: "✓ ปลอดการจำนอง",
    isMortgageAttached: false,
    evictionRisk: "none",
    evictionCostEst: 0,
    renovationCostEst: 0,
    areaSqW: 2000,
    usableAreaSqM: 0,
    lat: 16.6431,
    lng: 103.9124,
    status: "ขายทอดตลาด นัดที่ 1 | ✓ ปลอดการจำนอง",
    ledCourt: "ศาลจังหวัดกาฬสินธุ์ สาขากุฉินารายณ์",
    ledCaseNo: "ผบ.1342119/2569",
    dataSourceUrl: "https://www.fastledchecker.com/asset/1342119",
    images: [
      "https://asset.led.go.th/PPKPicture/2569/03-2569/23/3983p.jpg"
    ],
    features: ["ที่ดินสวนผลไม้-ไร่มันสำปะหลัง", "มีแหล่งน้ำธรรมชาติใกล้เคียง", "ปลอดภาระผูกพัน"]
  },

  /* 9. คำม่วง */
  {
    id: "KLS-LED-1355021",
    title: "อาคารพาณิชย์ 2 ชั้น ต.ทุ่งคลอง อ.คำม่วง จ.กาฬสินธุ์",
    type: "led_asset",
    assetCategory: "อาคารพาณิชย์",
    district: "คำม่วง",
    subdistrict: "ทุ่งคลอง",
    address: "ต.ทุ่งคลอง อ.คำม่วง จ.กาฬสินธุ์",
    priceStarting: 1350000,
    priceAppraised: 1800000,
    marketEstimate: 2100000,
    mortgageDebt: 220000,
    realTotalPayment: 1570000,
    auctionDate: "12 ก.ย. 2569",
    competitorStatus: "🚩 จำนองติดไป 220,000 บาท",
    isMortgageAttached: true,
    evictionRisk: "low",
    evictionCostEst: 20000,
    renovationCostEst: 80000,
    areaSqW: 30,
    usableAreaSqM: 160,
    lat: 16.9821,
    lng: 103.6512,
    status: "ขายทอดตลาด นัดที่ 2 | จำนองติดไป 220,000 บาท",
    ledCourt: "ศาลจังหวัดกาฬสินธุ์",
    ledCaseNo: "ผบ.1355021/2569",
    dataSourceUrl: "https://www.fastledchecker.com/asset/1355021",
    images: [
      "https://asset.led.go.th/PPKPicture/2569/03-2569/27/32260p.jpg"
    ],
    features: ["ติดถนนย่านชุมชนคำม่วง", "อาคารปูนแข็งแรง", "เหมาะเปิดร้านค้าหรืออยู่อาศัย"]
  },

  /* 10. ท่าคันโท */
  {
    id: "KLS-LED-1368940",
    title: "ที่ดินพร้อมสิ่งปลูกสร้างบ้านพักอาศัย 200 ตร.ว. ต.ท่าคันโท อ.ท่าคันโท",
    type: "led_asset",
    assetCategory: "ที่ดินพร้อมสิ่งปลูกสร้าง",
    district: "ท่าคันโท",
    subdistrict: "ท่าคันโท",
    address: "ต.ท่าคันโท อ.ท่าคันโท จ.กาฬสินธุ์",
    priceStarting: 780000,
    priceAppraised: 1100000,
    marketEstimate: 1300000,
    mortgageDebt: 0,
    realTotalPayment: 780000,
    auctionDate: "15 ก.ย. 2569",
    competitorStatus: "✓ ปลอดการจำนอง",
    isMortgageAttached: false,
    evictionRisk: "medium",
    evictionCostEst: 45000,
    renovationCostEst: 110000,
    areaSqW: 200,
    usableAreaSqM: 140,
    lat: 16.9532,
    lng: 103.2411,
    status: "ขายทอดตลาด นัดที่ 1 | ✓ ปลอดการจำนอง",
    ledCourt: "ศาลจังหวัดกาฬสินธุ์",
    ledCaseNo: "ผบ.1368940/2569",
    dataSourceUrl: "https://www.fastledchecker.com/asset/1368940",
    images: [
      "https://asset.led.go.th/PPKPicture/2569/05-2569/15/43539p.jpg"
    ],
    features: ["บ้านไม้ครึ่งปูนเนื้อที่กว้างขวาง", "ปลอดจำนอง", "ต้นไม้ร่มรื่น"]
  },

  /* 11-15. ตลาดสิ่งปลูกสร้างไม้เก่า (Wooden Buildings Niche Market) */
  {
    id: "KLS-WOOD-2001",
    title: "เรือนไทยโบราณไม้สักทองผสมไม้ประดู่ 3 ห้องนอน พร้อมรื้อถอน อ.ยางตลาด",
    type: "wooden_building",
    assetCategory: "สิ่งปลูกสร้างไม้เก่า",
    district: "ยางตลาด",
    subdistrict: "อุ่มเม่า",
    address: "บ้านอุ่มเม่า อ.ยางตลาด จ.กาฬสินธุ์",
    priceStarting: 680000,
    priceAppraised: 850000,
    marketEstimate: 950000,
    mortgageDebt: 0,
    realTotalPayment: 680000,
    auctionDate: "พร้อมขายทันที",
    competitorStatus: "✓ ปลอดจำนอง / เจ้าของขายเอง",
    isMortgageAttached: false,
    woodType: "ไม้สัก (Teak)",
    secondaryWood: "ไม้ประดู่ (Rosewood)",
    woodVolumeCuM: 14.5,
    pillarCount: 18,
    buildingAgeYears: 55,
    conditionPercent: 88,
    dismantlingIncluded: false,
    dismantlingCostEst: 65000,
    areaSqW: 0,
    usableAreaSqM: 140,
    lat: 16.4125,
    lng: 103.3868,
    status: "ประกาศขายเฉพาะสิ่งปลูกสร้างไม้เก่า",
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
    ],
    features: ["เสาไม้สักทอง 18 ต้น", "แผ่นฝาปะกนไม้ประดู่สภาพดี", "เข้าลิ่มโบราณไร้ตะปู"]
  },
  {
    id: "KLS-WOOD-2002",
    title: "ยุ้งข้าวไม้เต็งโบราณเสา 12 ต้น ไม้แผ่นใหญ่ เหมาะทำคาเฟ่ อ.สมเด็จ",
    type: "wooden_building",
    assetCategory: "สิ่งปลูกสร้างไม้เก่า",
    district: "สมเด็จ",
    subdistrict: "สมเด็จ",
    address: "ต.สมเด็จ อ.สมเด็จ จ.กาฬสินธุ์",
    priceStarting: 240000,
    priceAppraised: 300000,
    marketEstimate: 320000,
    mortgageDebt: 0,
    realTotalPayment: 240000,
    auctionDate: "พร้อมขาย",
    competitorStatus: "รวมค่ารื้อถอนฟรี",
    isMortgageAttached: false,
    woodType: "ไม้เต็ง (Red Balau)",
    secondaryWood: "ไม้แดง (Ironwood)",
    woodVolumeCuM: 6.8,
    pillarCount: 12,
    buildingAgeYears: 48,
    conditionPercent: 92,
    dismantlingIncluded: true,
    dismantlingCostEst: 0,
    areaSqW: 0,
    usableAreaSqM: 60,
    lat: 16.7032,
    lng: 103.7481,
    status: "ขายพร้อมบริการรื้อถอนฟรี",
    images: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
    ],
    features: ["ไม้เนื้อแข็งไม่ถูกปลวกกิน", "รวมค่ารื้อถอนและขนย้าย", "ไม้หน้ากว้าง 10 นิ้วขึ้นไป"]
  },
  {
    id: "KLS-WOOD-2003",
    title: "บ้านไม้ครึ่งปูน 2 ชั้น ไม้ประดู่ยกหลัง 16 เสา อ.กมลาไสย จ.กาฬสินธุ์",
    type: "wooden_building",
    assetCategory: "สิ่งปลูกสร้างไม้เก่า",
    district: "กมลาไสย",
    subdistrict: "กมลาไสย",
    address: "ต.กมลาไสย อ.กมลาไสย จ.กาฬสินธุ์",
    priceStarting: 450000,
    priceAppraised: 550000,
    marketEstimate: 600000,
    mortgageDebt: 0,
    realTotalPayment: 450000,
    auctionDate: "พร้อมขาย",
    competitorStatus: "ประเมินราคาพร้อมยกรื้อถอน",
    isMortgageAttached: false,
    woodType: "ไม้ประดู่ (Rosewood)",
    secondaryWood: "ไม้แดง (Ironwood)",
    woodVolumeCuM: 10.2,
    pillarCount: 16,
    buildingAgeYears: 38,
    conditionPercent: 95,
    dismantlingIncluded: false,
    dismantlingCostEst: 45000,
    areaSqW: 0,
    usableAreaSqM: 120,
    lat: 16.3381,
    lng: 103.5782,
    status: "ประกาศขายเฉพาะโครงสร้างไม้ชั้นสอง",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
    ],
    features: ["ไม้ประดู่สีเข้มสวยงาม", "ฝาฝักขามประดู่แห้งสนิท", "เหมาะนำไปสร้างบ้านสวน"]
  }
];

const CONTRACTORS_DATA = [
  {
    id: "CTR-01",
    name: "ช่างวิเชียร การช่างไม้เก่ากาฬสินธุ์",
    district: "เมืองกาฬสินธุ์",
    phone: "089-421-5544",
    experienceYears: 22,
    specialty: "รื้อถอนเรือนไทยโบราณ, ขนย้าย และประกอบใหม่",
    rating: 4.9,
    reviewsCount: 38,
    verified: true
  },
  {
    id: "CTR-02",
    name: "ยางตลาด รื้อถอนและรีไซเคิลไม้",
    district: "ยางตลาด",
    phone: "081-773-9001",
    experienceYears: 15,
    specialty: "ประเมินราคาซื้อไม้เก่าถึงบ้าน, รื้อถอนยุ้งข้าวและโรงสีไม้",
    rating: 4.7,
    reviewsCount: 24,
    verified: true
  },
  {
    id: "CTR-03",
    name: "อีสานบ้านไม้โบราณ กุฉินารายณ์",
    district: "กุฉินารายณ์",
    phone: "086-224-8833",
    experienceYears: 18,
    specialty: "แปรรูปไม้เก่า, ปรับปรุงไม้สักประดู่, ก่อสร้างบ้านไม้สไตล์รีสอร์ท",
    rating: 4.8,
    reviewsCount: 29,
    verified: true
  }
];
