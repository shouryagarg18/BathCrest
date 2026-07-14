require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Coupon = require('../models/Coupon');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://shouryagarg1808_db_user:FO2uKXmmYDGl4bK4@ac-qi0zfhq-shard-00-00.pvdhewc.mongodb.net:27017,ac-qi0zfhq-shard-00-01.pvdhewc.mongodb.net:27017,ac-qi0zfhq-shard-00-02.pvdhewc.mongodb.net:27017/bathcrest?ssl=true&authSource=admin&retryWrites=true&w=majority';

// Premium, realistic Unsplash & Pexels images for bathroom hardware
const IMAGE_LIBRARY = {
  'Bathroom Faucets': [
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
  ],
  'Rain Showers': [
    'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=800&q=80',
  ],
  'Wash Basins': [
    'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80',
  ],
  'Kitchen Faucets': [
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
  ],
  'Vanity Units': [
    'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80',
  ],
  'Bathroom Mirrors': [
    'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80',
  ],
  'default': [
    'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=800&q=80',
  ]
};

// Generates a realistic image based on the product ID string
const img = (id, _w, _h) => {
  let images = IMAGE_LIBRARY['default'];
  const keyword = id.toLowerCase();
  
  if (keyword.includes('faucet') || keyword.includes('tap') || keyword.includes('hf')) {
    images = IMAGE_LIBRARY['Bathroom Faucets'];
  } else if (keyword.includes('shower')) {
    images = IMAGE_LIBRARY['Rain Showers'];
  } else if (keyword.includes('basin') || keyword.includes('sink')) {
    images = IMAGE_LIBRARY['Wash Basins'];
  }
  
  // Use a pseudo-random hash of the ID to consistently pick an image from the array
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return images[hash % images.length];
};

const categories = [
  { name: 'Bathroom Faucets', icon: '🚿', sortOrder: 1, description: 'Premium chrome and matte finish faucets' },
  { name: 'Rain Showers', icon: '🌧️', sortOrder: 2, description: 'Luxury overhead rain shower systems' },
  { name: 'Health Faucets', icon: '💧', sortOrder: 3, description: 'Hygienic health faucet solutions' },
  { name: 'Wash Basins', icon: '🪣', sortOrder: 4, description: 'Designer wash basins and countertop sinks' },
  { name: 'Bathroom Sinks', icon: '🪥', sortOrder: 5, description: 'Under-mount and vessel sinks' },
  { name: 'Kitchen Faucets', icon: '🍳', sortOrder: 6, description: 'Functional and stylish kitchen faucets' },
  { name: 'Soap Dispensers', icon: '🧴', sortOrder: 7, description: 'Touch-free and manual soap dispensers' },
  { name: 'Mirror Cabinets', icon: '🪞', sortOrder: 8, description: 'Illuminated mirror cabinets with storage' },
  { name: 'Shower Panels', icon: '🚿', sortOrder: 9, description: 'Multi-function shower panel systems' },
  { name: 'Towel Holders', icon: '🛁', sortOrder: 10, description: 'Wall-mounted and free-standing towel holders' },
  { name: 'Toilet Seats', icon: '🚽', sortOrder: 11, description: 'Premium soft-close toilet seats' },
  { name: 'Flush Systems', icon: '🔧', sortOrder: 12, description: 'Concealed and exposed flush systems' },
  { name: 'PVC Accessories', icon: '⚙️', sortOrder: 13, description: 'Durable PVC fittings and accessories' },
  { name: 'Angle Valves', icon: '🔩', sortOrder: 14, description: 'Precision angle valves and shut-offs' },
  { name: 'Bathroom Mirrors', icon: '🪞', sortOrder: 15, description: 'LED and frameless bathroom mirrors' },
  { name: 'Vanity Units', icon: '🛁', sortOrder: 16, description: 'Complete vanity units with storage' },
  { name: 'Shower Enclosures', icon: '🚿', sortOrder: 17, description: 'Frameless glass shower enclosures' },
  { name: 'Accessories', icon: '✨', sortOrder: 18, description: 'Bathroom accessories and hardware sets' },
];

const makeProducts = (cats) => {
  const catMap = {};
  cats.forEach(c => { catMap[c.name] = c; });

  return [
    // ---- BATHROOM FAUCETS ----
    {
      name: 'Cascada Premium Chrome Basin Faucet',
      categoryName: 'Bathroom Faucets', category: catMap['Bathroom Faucets']._id,
      price: 4999, discountPrice: 3799,
      description: 'Experience the pinnacle of bathroom elegance with the Cascada Premium Chrome Basin Faucet. Crafted from solid brass with a mirror-polished chrome finish, this faucet combines sleek aesthetics with superior performance. Features a ceramic disc cartridge for drip-free operation, single lever control for precise temperature and flow adjustment, and an aerator for water savings.',
      shortDescription: 'Solid brass single-lever basin faucet with mirror chrome finish',
      material: 'Solid Brass', finish: 'Mirror Chrome', warranty: '5 Years',
      sku: 'BC-BF-001', stock: 45, isFeatured: true, isBestSeller: true,
      images: [{ url: img('faucet1'), alt: 'Cascada Chrome Faucet' }, { url: img('faucet2'), alt: 'Side view' }],
      specifications: [{ key: 'Cartridge', value: 'Ceramic Disc' }, { key: 'Flow Rate', value: '6 L/min' }, { key: 'Pressure', value: '0.5-5 bar' }, { key: 'Connection', value: 'G 3/8"' }],
      dimensions: { height: '160mm', width: '150mm', weight: '680g' },
      tags: ['chrome', 'single-lever', 'basin', 'premium'],
    },
    {
      name: 'AquaLux Matte Black Basin Tap',
      categoryName: 'Bathroom Faucets', category: catMap['Bathroom Faucets']._id,
      price: 6499, discountPrice: 5199,
      description: 'The AquaLux Matte Black Basin Tap is a bold statement piece for the modern bathroom. Featuring a striking matte black powder-coated finish that resists fingerprints and water spots, this faucet is as practical as it is beautiful. Solid brass body with quarter-turn ceramic cartridge ensures years of reliable use.',
      shortDescription: 'Bold matte black single-hole basin faucet with anti-fingerprint coating',
      material: 'Solid Brass', finish: 'Matte Black', warranty: '5 Years',
      sku: 'BC-BF-002', stock: 32, isFeatured: true,
      images: [{ url: img('blacktap'), alt: 'Matte Black Faucet' }, { url: img('blacktap2'), alt: 'Detail view' }],
      specifications: [{ key: 'Cartridge', value: 'Ceramic Quarter-Turn' }, { key: 'Flow Rate', value: '5 L/min' }, { key: 'Finish', value: 'Anti-fingerprint Matte Black' }],
      dimensions: { height: '155mm', width: '145mm', weight: '720g' },
      tags: ['matte-black', 'modern', 'basin'],
    },
    {
      name: 'Velocity Dual Handle Wall Faucet',
      categoryName: 'Bathroom Faucets', category: catMap['Bathroom Faucets']._id,
      price: 5499, discountPrice: 4399,
      description: 'The Velocity Dual Handle Wall Faucet brings timeless design to your bathroom with its classic dual-handle configuration and wall-mounted installation. Constructed from high-grade brass with a polished chrome finish, it offers separate hot and cold water controls with ceramic cartridge technology.',
      shortDescription: 'Classic dual-handle wall-mounted basin faucet in polished chrome',
      material: 'Brass', finish: 'Polished Chrome', warranty: '3 Years',
      sku: 'BC-BF-003', stock: 28, isNewArrival: true,
      images: [{ url: img('wallfaucet'), alt: 'Dual Handle Wall Faucet' }],
      specifications: [{ key: 'Mount', value: 'Wall' }, { key: 'Handles', value: 'Dual' }, { key: 'Temperature', value: 'Hot & Cold' }],
      dimensions: { height: '120mm', width: '280mm', weight: '850g' },
      tags: ['wall-mount', 'dual-handle', 'classic'],
    },
    {
      name: 'Slimline Brushed Nickel Faucet',
      categoryName: 'Bathroom Faucets', category: catMap['Bathroom Faucets']._id,
      price: 5999, discountPrice: 4799,
      description: 'Ultra-slim design meets superior functionality in the Slimline Brushed Nickel Faucet. The elongated spout and brushed nickel finish complement minimalist bathroom aesthetics perfectly. Features a top-mounted single lever and 360° swivel capability.',
      shortDescription: 'Ultra-slim brushed nickel tall basin faucet with 360° swivel',
      material: 'Brass', finish: 'Brushed Nickel', warranty: '5 Years',
      sku: 'BC-BF-004', stock: 20, isFeatured: true,
      images: [{ url: img('nickel-faucet'), alt: 'Brushed Nickel Faucet' }],
      specifications: [{ key: 'Spout Height', value: '230mm' }, { key: 'Swivel', value: '360°' }, { key: 'Cartridge', value: 'Ceramic' }],
      dimensions: { height: '350mm', width: '120mm', weight: '590g' },
      tags: ['brushed-nickel', 'tall', 'swivel'],
    },
    // ---- RAIN SHOWERS ----
    {
      name: 'CloudBurst 300mm Overhead Rain Shower',
      categoryName: 'Rain Showers', category: catMap['Rain Showers']._id,
      price: 8999, discountPrice: 6999,
      description: 'Transform your shower into a luxurious spa retreat with the CloudBurst 300mm Overhead Rain Shower. The oversized 300mm square panel delivers an enveloping cascade of water through 120 precision nozzles, mimicking natural rainfall. Anti-calcium nozzles for easy cleaning. Includes ceiling-mount arm.',
      shortDescription: '300mm square rain shower head with 120 nozzles and anti-calcium technology',
      material: 'Stainless Steel 304', finish: 'Brushed Chrome', warranty: '3 Years',
      sku: 'BC-RS-001', stock: 35, isFeatured: true, isBestSeller: true,
      images: [{ url: img('rainshower1'), alt: 'CloudBurst Rain Shower' }, { url: img('rainshower2'), alt: 'Installation view' }],
      specifications: [{ key: 'Size', value: '300x300mm' }, { key: 'Nozzles', value: '120 silicone' }, { key: 'Flow Rate', value: '12 L/min' }, { key: 'Pressure', value: '1-3 bar' }],
      dimensions: { length: '300mm', width: '300mm', weight: '1.2kg' },
      tags: ['rain-shower', 'overhead', '300mm', 'spa'],
    },
    {
      name: 'Zephyr Round Chrome Rain Shower 250mm',
      categoryName: 'Rain Showers', category: catMap['Rain Showers']._id,
      price: 6499, discountPrice: 5199,
      description: 'The Zephyr Round Rain Shower offers a perfect blend of style and performance with its 250mm round head and polished chrome finish. Features self-cleaning rubber nozzles and a water-saving aerator that maintains the feel of a full shower while reducing consumption.',
      shortDescription: '250mm round rain shower with self-cleaning nozzles',
      material: 'ABS + Stainless Steel', finish: 'Polished Chrome', warranty: '2 Years',
      sku: 'BC-RS-002', stock: 42, isNewArrival: true,
      images: [{ url: img('round-shower'), alt: 'Zephyr Round Shower' }],
      specifications: [{ key: 'Diameter', value: '250mm' }, { key: 'Shape', value: 'Round' }, { key: 'Nozzles', value: '80 rubber' }],
      dimensions: { height: '15mm', weight: '650g' },
      tags: ['round', 'rain-shower', 'self-cleaning'],
    },
    {
      name: 'EcoRain Thermostatic Shower System',
      categoryName: 'Rain Showers', category: catMap['Rain Showers']._id,
      price: 24999, discountPrice: 19999,
      description: 'The EcoRain Thermostatic Shower System is a complete luxury shower solution that maintains your perfect water temperature with ±1°C precision. Includes 300mm rain head, handheld shower, thermostatic valve, and body jets. Intelligent water memory recalls your preferred temperature.',
      shortDescription: 'Complete thermostatic shower system with rain head, hand shower & body jets',
      material: 'Brass + Stainless Steel', finish: 'Brushed Gold', warranty: '5 Years',
      sku: 'BC-RS-003', stock: 15, isFeatured: true,
      images: [{ url: img('thermo-shower'), alt: 'EcoRain Thermostatic System' }],
      specifications: [{ key: 'Thermostat Precision', value: '±1°C' }, { key: 'Outlets', value: '3 (rain, hand, jets)' }, { key: 'Max Temp', value: '38°C safety lock' }],
      dimensions: { height: '400mm', width: '350mm', weight: '4.5kg' },
      tags: ['thermostatic', 'system', 'luxury', 'brushed-gold'],
    },
    // ---- HEALTH FAUCETS ----
    {
      name: 'HygiMax Health Faucet with Hose',
      categoryName: 'Health Faucets', category: catMap['Health Faucets']._id,
      price: 1299, discountPrice: 999,
      description: 'The HygiMax Health Faucet delivers superior hygiene with its powerful spray mechanism and ergonomic grip. Comes with a 1.5m stainless steel braided hose and wall bracket. The ABS body is resistant to corrosion and discoloration. Thumb-press trigger for easy one-hand operation.',
      shortDescription: 'Ergonomic health faucet with 1.5m braided hose and wall bracket',
      material: 'ABS + Stainless Steel', finish: 'Chrome', warranty: '1 Year',
      sku: 'BC-HF-001', stock: 150, isBestSeller: true,
      images: [{ url: img('health-faucet'), alt: 'HygiMax Health Faucet' }],
      specifications: [{ key: 'Hose Length', value: '1.5m' }, { key: 'Hose Material', value: 'SS Braided' }, { key: 'Trigger', value: 'Thumb-press' }],
      dimensions: { length: '180mm', weight: '320g' },
      tags: ['health-faucet', 'hygiene', 'hose'],
    },
    {
      name: 'PureFlow Premium Health Faucet Set',
      categoryName: 'Health Faucets', category: catMap['Health Faucets']._id,
      price: 2499, discountPrice: 1999,
      description: 'Premium health faucet set with solid brass body, 1.8m extra-long hose, and anti-drip technology. The ergonomic design reduces hand fatigue during extended use. Chrome-plated finish with a lifetime rust guarantee.',
      shortDescription: 'Premium brass health faucet with 1.8m hose and anti-drip system',
      material: 'Solid Brass', finish: 'Polished Chrome', warranty: '3 Years',
      sku: 'BC-HF-002', stock: 80,
      images: [{ url: img('premium-hf'), alt: 'PureFlow Health Faucet' }],
      specifications: [{ key: 'Body', value: 'Solid Brass' }, { key: 'Hose', value: '1.8m SS Braided' }, { key: 'Anti-drip', value: 'Yes' }],
      dimensions: { length: '200mm', weight: '450g' },
      tags: ['premium', 'brass', 'anti-drip'],
    },
    // ---- WASH BASINS ----
    {
      name: 'Oval Countertop Vessel Basin White',
      categoryName: 'Wash Basins', category: catMap['Wash Basins']._id,
      price: 12999, discountPrice: 9999,
      description: 'The Oval Countertop Vessel Basin is a sculptural centerpiece that elevates any bathroom vanity. Crafted from high-grade vitreous china with a brilliant white glaze that resists staining and scratching. The egg-shaped bowl design creates a sophisticated focal point. Compatible with all standard faucets.',
      shortDescription: 'Sculptural oval vessel basin in premium vitreous china',
      material: 'Vitreous China', finish: 'Gloss White', warranty: '10 Years',
      sku: 'BC-WB-001', stock: 22, isFeatured: true,
      images: [{ url: img('oval-basin'), alt: 'Oval Vessel Basin' }, { url: img('oval-basin2'), alt: 'Top view' }],
      specifications: [{ key: 'Material', value: 'Vitreous China' }, { key: 'Shape', value: 'Oval' }, { key: 'Overflow', value: 'No' }, { key: 'Water Absorption', value: '<0.5%' }],
      dimensions: { length: '500mm', width: '380mm', height: '150mm', weight: '7.5kg' },
      tags: ['vessel-basin', 'countertop', 'oval', 'white'],
    },
    {
      name: 'Square Under-Mount Basin 450mm',
      categoryName: 'Wash Basins', category: catMap['Wash Basins']._id,
      price: 9999, discountPrice: 7999,
      description: 'Clean, geometric lines define the Square Under-Mount Basin. Designed for seamless integration beneath solid surface or stone countertops, it creates an unbroken, luxurious expanse. Vitreous china construction with overflow protection.',
      shortDescription: '450mm square under-mount basin in vitreous china with overflow',
      material: 'Vitreous China', finish: 'Gloss White', warranty: '10 Years',
      sku: 'BC-WB-002', stock: 18, isNewArrival: true,
      images: [{ url: img('square-basin'), alt: 'Square Under-Mount Basin' }],
      specifications: [{ key: 'Size', value: '450x450mm' }, { key: 'Mount', value: 'Under-counter' }, { key: 'Overflow', value: 'Yes' }],
      dimensions: { length: '450mm', width: '450mm', height: '180mm', weight: '8.2kg' },
      tags: ['under-mount', 'square', 'geometric'],
    },
    {
      name: 'Slim Wall-Hung Basin 600mm',
      categoryName: 'Wash Basins', category: catMap['Wash Basins']._id,
      price: 15999, discountPrice: 12999,
      description: 'The Slim Wall-Hung Basin maximizes space with its floating design and ultra-thin rim. At just 100mm deep when wall-mounted, it brings spa-like minimalism to any bathroom. Semi-recessed design with rear overflow. Pre-drilled for single faucet hole.',
      shortDescription: '600mm ultra-slim wall-hung basin with semi-recessed design',
      material: 'Vitreous China', finish: 'Gloss White', warranty: '10 Years',
      sku: 'BC-WB-003', stock: 14, isFeatured: true, isBestSeller: true,
      images: [{ url: img('wallhung-basin'), alt: 'Wall-Hung Basin' }],
      specifications: [{ key: 'Width', value: '600mm' }, { key: 'Projection', value: '460mm' }, { key: 'Faucet Holes', value: '1' }, { key: 'Supports Required', value: 'Concealed wall frame' }],
      dimensions: { length: '600mm', width: '460mm', height: '170mm', weight: '12kg' },
      tags: ['wall-hung', 'floating', 'minimalist', '600mm'],
    },
    // ---- KITCHEN FAUCETS ----
    {
      name: 'PullDown Pro Kitchen Faucet',
      categoryName: 'Kitchen Faucets', category: catMap['Kitchen Faucets']._id,
      price: 8999, discountPrice: 6999,
      description: 'The PullDown Pro Kitchen Faucet revolutionizes kitchen workflow with its versatile pull-down spray head featuring three modes: stream, spray, and pause. The magnetic docking system snaps the head back into place with satisfying precision. Includes a soap dispenser and water-spot resistant finish.',
      shortDescription: 'Pull-down kitchen faucet with 3-mode spray, magnetic dock and soap dispenser',
      material: 'Brass + Zinc', finish: 'Stainless Steel', warranty: '5 Years',
      sku: 'BC-KF-001', stock: 38, isFeatured: true,
      images: [{ url: img('kitchen-faucet'), alt: 'PullDown Pro Kitchen Faucet' }],
      specifications: [{ key: 'Spray Modes', value: '3 (Stream, Spray, Pause)' }, { key: 'Hose Length', value: '1.7m' }, { key: 'Swivel', value: '120°' }, { key: 'Dock', value: 'Magnetic snap' }],
      dimensions: { height: '420mm', width: '220mm', weight: '1.8kg' },
      tags: ['pull-down', 'kitchen', '3-mode', 'magnetic'],
    },
    {
      name: 'GourmetFlow Deck Mount Kitchen Tap',
      categoryName: 'Kitchen Faucets', category: catMap['Kitchen Faucets']._id,
      price: 5999, discountPrice: 4799,
      description: 'Designed for the serious home cook, the GourmetFlow Deck Mount Kitchen Tap features a high-arc spout for maximum clearance and 360° rotation for full sink coverage. Professional chef styling with durable chrome finish.',
      shortDescription: 'High-arc 360° rotating kitchen faucet with professional chef styling',
      material: 'Brass', finish: 'Polished Chrome', warranty: '3 Years',
      sku: 'BC-KF-002', stock: 45,
      images: [{ url: img('kitchen-tap'), alt: 'GourmetFlow Kitchen Tap' }],
      specifications: [{ key: 'Spout Height', value: '330mm' }, { key: 'Rotation', value: '360°' }, { key: 'Flow Rate', value: '9 L/min' }],
      dimensions: { height: '450mm', width: '250mm', weight: '1.5kg' },
      tags: ['high-arc', 'chef', '360-rotation'],
    },
    {
      name: 'TouchSense Sensor Kitchen Faucet',
      categoryName: 'Kitchen Faucets', category: catMap['Kitchen Faucets']._id,
      price: 14999, discountPrice: 11999,
      description: 'Experience the future of kitchen convenience with the TouchSense Sensor Faucet. Wave your hand to activate hands-free operation — perfect for when your hands are messy. Falls back to manual mode instantly. Battery or AC powered with 2-year battery life.',
      shortDescription: 'Motion-sensing hands-free kitchen faucet with 2-year battery life',
      material: 'Brass + ABS', finish: 'Brushed Nickel', warranty: '5 Years',
      sku: 'BC-KF-003', stock: 20, isFeatured: true, isNewArrival: true,
      images: [{ url: img('sensor-faucet'), alt: 'TouchSense Sensor Faucet' }],
      specifications: [{ key: 'Sensor Range', value: '15cm' }, { key: 'Power', value: '4x AA batteries (2yr)' }, { key: 'Response Time', value: '<0.5s' }],
      dimensions: { height: '400mm', weight: '2.1kg' },
      tags: ['sensor', 'hands-free', 'smart', 'kitchen'],
    },
    // ---- SOAP DISPENSERS ----
    {
      name: 'AutoSense Touchless Soap Dispenser',
      categoryName: 'Soap Dispensers', category: catMap['Soap Dispensers']._id,
      price: 2999, discountPrice: 2399,
      description: 'Eliminate cross-contamination with the AutoSense Touchless Soap Dispenser. Infrared sensor detects your hand and dispenses the perfect 1ml dose instantly. 350ml transparent reservoir with low-soap indicator. Matte chrome finish complements any bathroom.',
      shortDescription: 'Infrared touchless soap dispenser with 350ml reservoir',
      material: 'ABS + Stainless Steel', finish: 'Matte Chrome', warranty: '1 Year',
      sku: 'BC-SD-001', stock: 90, isBestSeller: true,
      images: [{ url: img('soap-dispenser'), alt: 'AutoSense Soap Dispenser' }],
      specifications: [{ key: 'Capacity', value: '350ml' }, { key: 'Sensor Range', value: '8cm' }, { key: 'Dose', value: '1ml per trigger' }, { key: 'Battery', value: '4x AA' }],
      dimensions: { height: '200mm', width: '80mm', weight: '280g' },
      tags: ['touchless', 'sensor', 'soap-dispenser'],
    },
    {
      name: 'OpulentBrass Wall Soap Dispenser',
      categoryName: 'Soap Dispensers', category: catMap['Soap Dispensers']._id,
      price: 1999, discountPrice: 1599,
      description: 'Add a touch of luxury to your bathroom with the OpulentBrass Wall-Mounted Soap Dispenser. Hand-pumped operation with a smooth, precise pump mechanism. 300ml capacity with a removable top-fill reservoir. Pairs with matching BathCrest accessories.',
      shortDescription: 'Wall-mounted brass soap dispenser with 300ml reservoir and precision pump',
      material: 'Solid Brass', finish: 'Polished Gold', warranty: '2 Years',
      sku: 'BC-SD-002', stock: 65,
      images: [{ url: img('gold-dispenser'), alt: 'OpulentBrass Soap Dispenser' }],
      specifications: [{ key: 'Capacity', value: '300ml' }, { key: 'Mount', value: 'Wall-mounted' }, { key: 'Fill', value: 'Top-fill' }],
      dimensions: { height: '220mm', width: '75mm', weight: '380g' },
      tags: ['wall-mount', 'gold', 'brass', 'manual'],
    },
    // ---- MIRROR CABINETS ----
    {
      name: 'LuminaLED Illuminated Mirror Cabinet 800mm',
      categoryName: 'Mirror Cabinets', category: catMap['Mirror Cabinets']._id,
      price: 22999, discountPrice: 17999,
      description: 'The LuminaLED Illuminated Mirror Cabinet combines practical storage with stunning ambient lighting. Three interior shelves accommodate all bathroom essentials. LED lighting behind the mirror creates an elegant halo effect. Anti-fog heating pad, integrated USB charging port, and touch dimmer control.',
      shortDescription: '800mm LED halo mirror cabinet with anti-fog, USB charging & dimmable light',
      material: 'Aluminium + Glass', finish: 'Matt White', warranty: '3 Years',
      sku: 'BC-MC-001', stock: 18, isFeatured: true,
      images: [{ url: img('mirror-cabinet'), alt: 'LuminaLED Mirror Cabinet' }],
      specifications: [{ key: 'Width', value: '800mm' }, { key: 'Depth', value: '130mm' }, { key: 'LED Color', value: '4000K Neutral White' }, { key: 'Shelves', value: '3 adjustable' }, { key: 'Anti-fog', value: 'Heated pad' }],
      dimensions: { length: '800mm', height: '700mm', weight: '18kg' },
      tags: ['LED', 'mirror', 'cabinet', 'anti-fog', 'USB'],
    },
    {
      name: 'Mono Frameless LED Mirror 600mm',
      categoryName: 'Bathroom Mirrors', category: catMap['Bathroom Mirrors']._id,
      price: 11999, discountPrice: 8999,
      description: 'Ultra-slim 4mm frameless LED mirror with backlit illumination and smart touch sensor. The 600mm round mirror features 5000K daylight LEDs for true color accuracy. IP44 rated for bathroom use. Touch on/off with memory function.',
      shortDescription: '600mm round frameless LED backlit mirror with touch sensor',
      material: 'Safety Glass', finish: 'Frameless', warranty: '2 Years',
      sku: 'BC-BM-001', stock: 30, isNewArrival: true,
      images: [{ url: img('led-mirror'), alt: 'Mono LED Mirror' }],
      specifications: [{ key: 'Diameter', value: '600mm' }, { key: 'LED Color', value: '5000K Daylight' }, { key: 'IP Rating', value: 'IP44' }, { key: 'Touch Control', value: 'Yes with memory' }],
      dimensions: { height: '600mm', width: '600mm', weight: '8kg' },
      tags: ['LED', 'frameless', 'round', 'smart'],
    },
    // ---- SHOWER PANELS ----
    {
      name: 'SpaMax Multifunction Shower Panel',
      categoryName: 'Shower Panels', category: catMap['Shower Panels']._id,
      price: 32999, discountPrice: 24999,
      description: 'The SpaMax Multifunction Shower Panel delivers a complete spa experience within your existing shower space. Six body jets, an overhead rain shower, handheld shower, and waterfall cascade work in harmony. Digital temperature display and flow controls. Stainless steel 304 construction for durability.',
      shortDescription: 'Complete spa panel with 6 body jets, rain, handheld, waterfall & digital display',
      material: 'Stainless Steel 304', finish: 'Brushed Steel', warranty: '3 Years',
      sku: 'BC-SP-001', stock: 12, isFeatured: true,
      images: [{ url: img('shower-panel'), alt: 'SpaMax Shower Panel' }],
      specifications: [{ key: 'Body Jets', value: '6 adjustable' }, { key: 'Functions', value: 'Rain + Hand + Waterfall + Jets' }, { key: 'Material', value: 'SUS 304 Steel' }, { key: 'Display', value: 'Digital temperature' }],
      dimensions: { height: '1500mm', width: '220mm', weight: '12kg' },
      tags: ['spa', 'multifunction', 'panel', 'body-jets'],
    },
    {
      name: 'AquaColumn Shower Tower System',
      categoryName: 'Shower Panels', category: catMap['Shower Panels']._id,
      price: 18999, discountPrice: 14999,
      description: 'The AquaColumn Shower Tower combines an overhead rain shower, handheld shower, and dual body jets in a sleek column design. Easy single-wall installation. All-round adjustable angle for body jets. Pressure-balanced valve for consistent temperature.',
      shortDescription: 'Sleek shower column with overhead rain, handheld and dual body jets',
      material: 'Stainless Steel', finish: 'Chrome', warranty: '2 Years',
      sku: 'BC-SP-002', stock: 20,
      images: [{ url: img('aquacolumn'), alt: 'AquaColumn Shower Tower' }],
      specifications: [{ key: 'Body Jets', value: '2' }, { key: 'Valve', value: 'Pressure-balanced' }, { key: 'Installation', value: 'Single wall' }],
      dimensions: { height: '1200mm', width: '200mm', weight: '8.5kg' },
      tags: ['column', 'tower', 'shower-system'],
    },
    // ---- TOWEL HOLDERS ----
    {
      name: 'StraightLine Heated Towel Rail',
      categoryName: 'Towel Holders', category: catMap['Towel Holders']._id,
      price: 14999, discountPrice: 11999,
      description: 'Keep your towels warm and bathroom beautifully organized with the StraightLine Heated Towel Rail. Features 6 horizontal bars of polished chrome with an integrated electric heating element. IP44 rated. Low energy consumption at just 60W. On/off pull cord switch.',
      shortDescription: '6-bar electric heated towel rail in polished chrome, 60W, IP44',
      material: 'Mild Steel', finish: 'Polished Chrome', warranty: '2 Years',
      sku: 'BC-TH-001', stock: 25, isFeatured: true,
      images: [{ url: img('heated-towel'), alt: 'Heated Towel Rail' }],
      specifications: [{ key: 'Bars', value: '6' }, { key: 'Power', value: '60W' }, { key: 'IP Rating', value: 'IP44' }, { key: 'Switch', value: 'Pull cord' }],
      dimensions: { height: '800mm', width: '500mm', weight: '4.5kg' },
      tags: ['heated', 'electric', 'towel-rail', 'chrome'],
    },
    {
      name: 'Geo Double Towel Bar 600mm',
      categoryName: 'Towel Holders', category: catMap['Towel Holders']._id,
      price: 2999, discountPrice: 2299,
      description: 'The Geo Double Towel Bar delivers maximum capacity in minimum space. Dual rail design holds two towels flat for optimal drying. Solid brass construction with matte black powder coat finish. Wall anchors and all hardware included.',
      shortDescription: '600mm dual rail towel bar in matte black with all fixings',
      material: 'Solid Brass', finish: 'Matte Black', warranty: '5 Years',
      sku: 'BC-TH-002', stock: 55,
      images: [{ url: img('towel-bar'), alt: 'Geo Double Towel Bar' }],
      specifications: [{ key: 'Length', value: '600mm' }, { key: 'Rails', value: '2' }, { key: 'Fixings', value: 'Included' }],
      dimensions: { length: '640mm', height: '100mm', weight: '780g' },
      tags: ['double', 'matte-black', 'towel-bar', '600mm'],
    },
    {
      name: 'FreeStand Bamboo Towel Stand',
      categoryName: 'Towel Holders', category: catMap['Towel Holders']._id,
      price: 4999, discountPrice: 3999,
      description: 'Eco-conscious luxury with the FreeStand Bamboo Towel Stand. Natural bamboo construction with a water-resistant lacquer finish. Three-tier design accommodates multiple towels. No installation required — a stunning floor-standing design.',
      shortDescription: 'Eco-friendly bamboo 3-tier free-standing towel stand',
      material: 'Bamboo', finish: 'Natural Lacquered', warranty: '1 Year',
      sku: 'BC-TH-003', stock: 40, isNewArrival: true,
      images: [{ url: img('bamboo-towel'), alt: 'Bamboo Towel Stand' }],
      specifications: [{ key: 'Tiers', value: '3' }, { key: 'Material', value: 'Moso Bamboo' }, { key: 'Standing', value: 'Free-standing, no drill' }],
      dimensions: { height: '900mm', width: '450mm', weight: '2.8kg' },
      tags: ['bamboo', 'eco', 'free-standing', '3-tier'],
    },
    // ---- TOILET SEATS ----
    {
      name: 'SoftClose Ultra-Slim Toilet Seat White',
      categoryName: 'Toilet Seats', category: catMap['Toilet Seats']._id,
      price: 3999, discountPrice: 2999,
      description: 'The SoftClose Ultra-Slim Toilet Seat features a precision slow-close hinge mechanism that prevents seat slamming. Ultra-thin thermoset seat is scratch and stain resistant. Quick-release hinges allow for easy deep cleaning. Universal fit for most standard toilets.',
      shortDescription: 'Ultra-slim thermoset soft-close toilet seat with quick-release hinges',
      material: 'Thermoset', finish: 'Gloss White', warranty: '2 Years',
      sku: 'BC-TS-001', stock: 70, isBestSeller: true,
      images: [{ url: img('toilet-seat'), alt: 'SoftClose Toilet Seat' }],
      specifications: [{ key: 'Close Mechanism', value: 'Slow-close' }, { key: 'Material', value: 'Thermoset' }, { key: 'Quick Release', value: 'Yes' }, { key: 'Shape', value: 'D-shaped' }],
      dimensions: { length: '455mm', width: '365mm', weight: '1.8kg' },
      tags: ['soft-close', 'thermoset', 'universal-fit'],
    },
    {
      name: 'BidetSeat Pro Smart Toilet Seat',
      categoryName: 'Toilet Seats', category: catMap['Toilet Seats']._id,
      price: 24999, discountPrice: 19999,
      description: 'Experience personal hygiene at its finest with the BidetSeat Pro Smart Toilet Seat. Features front and rear wash functions, adjustable water temperature and pressure, warm air drying, heated seat, and automatic air deodorizer. Wireless remote control included.',
      shortDescription: 'Smart bidet toilet seat with heated seat, warm wash, dryer and deodorizer',
      material: 'PP + Electronics', finish: 'White', warranty: '2 Years',
      sku: 'BC-TS-002', stock: 18, isFeatured: true,
      images: [{ url: img('bidet-seat'), alt: 'BidetSeat Pro' }],
      specifications: [{ key: 'Wash Functions', value: 'Front + Rear' }, { key: 'Water Temp', value: '3 levels' }, { key: 'Seat Heat', value: '3 levels' }, { key: 'Dryer', value: 'Warm air' }, { key: 'Deodorizer', value: 'Automatic' }],
      dimensions: { length: '480mm', width: '390mm', weight: '5.5kg' },
      tags: ['smart', 'bidet', 'heated', 'remote-control'],
    },
    // ---- FLUSH SYSTEMS ----
    {
      name: 'Concealed Dual-Flush Cistern System',
      categoryName: 'Flush Systems', category: catMap['Flush Systems']._id,
      price: 11999, discountPrice: 8999,
      description: 'The Concealed Dual-Flush Cistern System delivers invisible plumbing with maximum hygiene. The in-wall cistern supports standard drywall or tile walls and includes a dual-flush plate (3L/6L). Robust steel frame with adjustable feet. Compatible with all wall-hung toilets.',
      shortDescription: 'In-wall concealed cistern with 3L/6L dual flush and adjustable frame',
      material: 'Steel + PP Cistern', finish: 'Chrome Flush Plate', warranty: '5 Years',
      sku: 'BC-FS-001', stock: 30, isFeatured: true,
      images: [{ url: img('cistern'), alt: 'Concealed Cistern System' }],
      specifications: [{ key: 'Flush Volume', value: '3L + 6L' }, { key: 'Frame Height', value: '820-1120mm adjustable' }, { key: 'Cistern Material', value: 'PP' }],
      dimensions: { height: '1120mm', width: '500mm', weight: '14kg' },
      tags: ['concealed', 'in-wall', 'dual-flush', 'frame'],
    },
    {
      name: 'Chrome Flush Valve for Cistern',
      categoryName: 'Flush Systems', category: catMap['Flush Systems']._id,
      price: 1499, discountPrice: 1199,
      description: 'High-performance chrome flush valve with anti-siphon protection and adjustable water level. Universal fit for most standard cisterns. Simple click-fit installation with no tools required.',
      shortDescription: 'Universal chrome flush valve with adjustable water level',
      material: 'ABS + Chrome', finish: 'Chrome', warranty: '1 Year',
      sku: 'BC-FS-002', stock: 120,
      images: [{ url: img('flush-valve'), alt: 'Chrome Flush Valve' }],
      specifications: [{ key: 'Type', value: 'Fill valve' }, { key: 'Inlet', value: 'Bottom / Side entry' }, { key: 'Anti-siphon', value: 'Yes' }],
      dimensions: { height: '230mm', weight: '180g' },
      tags: ['flush-valve', 'universal', 'cistern'],
    },
    // ---- ANGLE VALVES ----
    {
      name: 'Premium Brass Angle Valve 15mm',
      categoryName: 'Angle Valves', category: catMap['Angle Valves']._id,
      price: 599, discountPrice: 449,
      description: 'The Premium Brass Angle Valve provides reliable shut-off for bathroom and kitchen supply lines. Full-bore design for maximum flow. Chrome-plated brass body resists corrosion. Lever handle for easy quarter-turn operation.',
      shortDescription: '15mm full-bore brass angle valve with lever handle',
      material: 'Brass', finish: 'Chrome', warranty: '2 Years',
      sku: 'BC-AV-001', stock: 200, isBestSeller: true,
      images: [{ url: img('angle-valve'), alt: 'Brass Angle Valve' }],
      specifications: [{ key: 'Size', value: '15mm (1/2")' }, { key: 'Type', value: 'Quarter-turn' }, { key: 'Full Bore', value: 'Yes' }],
      dimensions: { length: '80mm', weight: '120g' },
      tags: ['angle-valve', 'brass', '15mm', 'quarter-turn'],
    },
    {
      name: 'Concealed Stop Cock 25mm Chrome',
      categoryName: 'Angle Valves', category: catMap['Angle Valves']._id,
      price: 899, discountPrice: 699,
      description: 'Concealed stop cock for recessed installation in walls. Flush-finish chrome plate with concealed body. Ideal for sanitaryware supply connections where exposed pipework is undesirable.',
      shortDescription: '25mm concealed stop cock with flush chrome plate',
      material: 'Brass', finish: 'Chrome', warranty: '2 Years',
      sku: 'BC-AV-002', stock: 85,
      images: [{ url: img('stop-cock'), alt: 'Concealed Stop Cock' }],
      specifications: [{ key: 'Size', value: '25mm (1")' }, { key: 'Installation', value: 'Recessed' }, { key: 'Plate', value: 'Flush chrome' }],
      dimensions: { length: '90mm', weight: '150g' },
      tags: ['concealed', 'stop-cock', '25mm'],
    },
    // ---- VANITY UNITS ----
    {
      name: 'FlatPack Floating Vanity Unit 900mm',
      categoryName: 'Vanity Units', category: catMap['Vanity Units']._id,
      price: 34999, discountPrice: 27999,
      description: 'The FlatPack Floating Vanity Unit transforms your bathroom into a designer space. Wall-hung design keeps the floor clear for easy cleaning. Includes two soft-close drawers, integrated LED under-lighting, and a 900mm double basin in white ceramic. Warm oak veneer finish with chrome handles.',
      shortDescription: '900mm wall-hung vanity with 2 soft-close drawers, LED lighting & ceramic basins',
      material: 'MDF + Oak Veneer', finish: 'Warm Oak / Chrome', warranty: '2 Years',
      sku: 'BC-VU-001', stock: 10, isFeatured: true,
      images: [{ url: img('vanity-unit'), alt: 'Floating Vanity Unit' }, { url: img('vanity-unit2'), alt: 'Open drawer view' }],
      specifications: [{ key: 'Width', value: '900mm' }, { key: 'Drawers', value: '2 soft-close' }, { key: 'LED', value: 'Warm white under-unit' }, { key: 'Basin', value: 'Double ceramic included' }],
      dimensions: { length: '900mm', height: '500mm', weight: '45kg' },
      tags: ['vanity', 'floating', 'oak', 'LED', 'drawers'],
    },
    {
      name: 'GlossWhite Freestanding Vanity 600mm',
      categoryName: 'Vanity Units', category: catMap['Vanity Units']._id,
      price: 18999, discountPrice: 14999,
      description: 'The GlossWhite Freestanding Vanity features a high-gloss white lacquer finish, two spacious drawers, and a ceramic top with integrated basin. The soft-close drawer system ensures gentle, quiet operation. Includes chrome handles and waste fittings.',
      shortDescription: '600mm gloss white freestanding vanity with integrated ceramic basin',
      material: 'MDF High Gloss', finish: 'Gloss White', warranty: '2 Years',
      sku: 'BC-VU-002', stock: 15,
      images: [{ url: img('gloss-vanity'), alt: 'GlossWhite Vanity Unit' }],
      specifications: [{ key: 'Width', value: '600mm' }, { key: 'Drawers', value: '2 soft-close' }, { key: 'Basin', value: 'Integrated ceramic' }],
      dimensions: { length: '600mm', height: '820mm', weight: '32kg' },
      tags: ['gloss-white', 'freestanding', 'integrated-basin'],
    },
    // ---- SHOWER ENCLOSURES ----
    {
      name: 'ClearView Frameless Walk-In Enclosure 900mm',
      categoryName: 'Shower Enclosures', category: catMap['Shower Enclosures']._id,
      price: 28999, discountPrice: 22999,
      description: 'Create a stunning open showering space with the ClearView Frameless Walk-In Enclosure. 8mm thick tempered safety glass with nano-coating repels water and soap scum for a streak-free clean. Silver profile with 180° stabilizer bar. Suitable for level access and wet room installations.',
      shortDescription: '900mm frameless walk-in glass panel with 8mm nano-coated glass',
      material: 'Tempered Safety Glass', finish: 'Chrome Profile', warranty: '5 Years',
      sku: 'BC-SE-001', stock: 12, isFeatured: true,
      images: [{ url: img('walkin-shower'), alt: 'ClearView Walk-In Enclosure' }],
      specifications: [{ key: 'Glass Thickness', value: '8mm' }, { key: 'Width', value: '900mm' }, { key: 'Height', value: '2000mm' }, { key: 'Nano Coating', value: 'Yes' }],
      dimensions: { length: '900mm', height: '2000mm', weight: '32kg' },
      tags: ['frameless', 'walk-in', '8mm-glass', 'nano-coating'],
    },
    {
      name: 'BiFold Shower Door 900mm Chrome',
      categoryName: 'Shower Enclosures', category: catMap['Shower Enclosures']._id,
      price: 18999, discountPrice: 14999,
      description: 'Maximize space with the BiFold Shower Door that folds inward to require minimal clearance when opening. 6mm tempered safety glass with easy-clean coating. Polished chrome frame with magnetic seal strip for a watertight close.',
      shortDescription: '900mm bi-fold shower door in 6mm glass with magnetic seal',
      material: 'Tempered Safety Glass', finish: 'Polished Chrome', warranty: '3 Years',
      sku: 'BC-SE-002', stock: 20,
      images: [{ url: img('bifold-door'), alt: 'BiFold Shower Door' }],
      specifications: [{ key: 'Glass', value: '6mm tempered' }, { key: 'Width', value: '900mm' }, { key: 'Height', value: '1850mm' }, { key: 'Seal', value: 'Magnetic' }],
      dimensions: { length: '900mm', height: '1850mm', weight: '24kg' },
      tags: ['bifold', 'space-saving', 'magnetic-seal'],
    },
    // ---- PVC ACCESSORIES ----
    {
      name: 'UPVC Concealed Pipe Bend 90° Set',
      categoryName: 'PVC Accessories', category: catMap['PVC Accessories']._id,
      price: 299, discountPrice: 239,
      description: 'High-quality UPVC 90° elbow set for concealed plumbing installations. Smooth interior for maximum flow, UV-stabilized for color permanence. Pack of 5 fittings. Compatible with standard 25mm pipe.',
      shortDescription: 'Pack of 5 UPVC 90° elbows for concealed plumbing, UV-stabilized',
      material: 'UPVC', finish: 'White', warranty: '5 Years',
      sku: 'BC-PVC-001', stock: 300,
      images: [{ url: img('pvc-bend'), alt: 'UPVC Pipe Bends' }],
      specifications: [{ key: 'Angle', value: '90°' }, { key: 'Size', value: '25mm' }, { key: 'Pack', value: '5 pieces' }, { key: 'Standard', value: 'IS:4985' }],
      dimensions: { weight: '450g (set)' },
      tags: ['pvc', 'elbow', '90-degree', 'concealed'],
    },
    {
      name: 'Flexible Braided Hose Set 500mm',
      categoryName: 'PVC Accessories', category: catMap['PVC Accessories']._id,
      price: 399, discountPrice: 299,
      description: 'Premium flexible braided hoses for connecting faucets, cisterns, and supply lines. 304 stainless steel braid over EPDM rubber core. 500mm length with standard 1/2" fittings. Burst-proof construction.',
      shortDescription: 'Set of 2 SS braided flexible hoses, 500mm, 1/2" fittings',
      material: 'SS Braid + EPDM', finish: 'Silver', warranty: '2 Years',
      sku: 'BC-PVC-002', stock: 250,
      images: [{ url: img('braided-hose'), alt: 'Braided Hose Set' }],
      specifications: [{ key: 'Length', value: '500mm' }, { key: 'Braid', value: 'SS 304' }, { key: 'Core', value: 'EPDM rubber' }, { key: 'Fitting', value: '1/2" BSP' }],
      dimensions: { length: '500mm', weight: '120g each' },
      tags: ['hose', 'flexible', 'braided', 'connection'],
    },
    // ---- ACCESSORIES ----
    {
      name: 'Luxe 6-Piece Bathroom Accessories Set',
      categoryName: 'Accessories', category: catMap['Accessories']._id,
      price: 9999, discountPrice: 7499,
      description: 'Complete your bathroom with the Luxe 6-Piece Accessories Set. Includes a toilet brush holder, soap dish, soap dispenser, toothbrush holder, tumbler, and robe hook — all in matching brushed nickel. Wall-mounted brackets and all fixings included.',
      shortDescription: '6-piece matching bathroom set: brush, soap dish, dispenser, toothbrush holder, tumbler, hook',
      material: 'Brass + Zinc', finish: 'Brushed Nickel', warranty: '3 Years',
      sku: 'BC-ACC-001', stock: 35, isFeatured: true, isBestSeller: true,
      images: [{ url: img('accessories-set'), alt: '6-Piece Accessories Set' }],
      specifications: [{ key: 'Pieces', value: '6' }, { key: 'Includes', value: 'Brush, Soap Dish, Dispenser, Toothbrush Holder, Tumbler, Hook' }, { key: 'Fixings', value: 'Included' }],
      dimensions: { weight: '2.8kg (set)' },
      tags: ['set', '6-piece', 'brushed-nickel', 'matching'],
    },
    {
      name: 'Corner Shower Shelf Chrome 2-Tier',
      categoryName: 'Accessories', category: catMap['Accessories']._id,
      price: 2499, discountPrice: 1999,
      description: 'Maximize shower storage with the Corner Shower Shelf. Two-tier design with wide shelves accommodates shampoo, conditioner, and body wash bottles. No-drill adhesive mount option or traditional screw mount. Solid brass with chrome plating.',
      shortDescription: '2-tier chrome corner shower shelf with no-drill adhesive mounting',
      material: 'Brass', finish: 'Chrome', warranty: '2 Years',
      sku: 'BC-ACC-002', stock: 75,
      images: [{ url: img('corner-shelf'), alt: 'Corner Shower Shelf' }],
      specifications: [{ key: 'Tiers', value: '2' }, { key: 'Mount', value: 'Adhesive or screw' }, { key: 'Max Load', value: '5kg per tier' }],
      dimensions: { width: '280mm', depth: '280mm', weight: '1.2kg' },
      tags: ['shower-shelf', 'corner', '2-tier', 'no-drill'],
    },
    {
      name: 'Robe Hook Double Matte Black',
      categoryName: 'Accessories', category: catMap['Accessories']._id,
      price: 899, discountPrice: 699,
      description: 'The Robe Hook Double features two hooks in a compact wall-mounted design. Matte black finish complements contemporary bathrooms. Solid brass construction ensures long-term durability. All fixings included.',
      shortDescription: 'Double robe hook in matte black with wall fixings',
      material: 'Solid Brass', finish: 'Matte Black', warranty: '5 Years',
      sku: 'BC-ACC-003', stock: 95,
      images: [{ url: img('robe-hook'), alt: 'Double Robe Hook' }],
      specifications: [{ key: 'Hooks', value: '2' }, { key: 'Load Capacity', value: '3kg each' }, { key: 'Fixings', value: 'Included' }],
      dimensions: { width: '120mm', depth: '60mm', weight: '280g' },
      tags: ['robe-hook', 'double', 'matte-black'],
    },
    {
      name: 'Toilet Paper Holder Brushed Gold',
      categoryName: 'Accessories', category: catMap['Accessories']._id,
      price: 1999, discountPrice: 1599,
      description: 'Add a touch of luxury to your bathroom with the Brushed Gold Toilet Paper Holder. Solid brass arm with a sleek rotating barrel for easy roll replacement. Pairs with the BathCrest Luxe Gold accessories range.',
      shortDescription: 'Wall-mounted brushed gold toilet paper holder in solid brass',
      material: 'Solid Brass', finish: 'Brushed Gold', warranty: '5 Years',
      sku: 'BC-ACC-004', stock: 60,
      images: [{ url: img('tp-holder'), alt: 'Brushed Gold TP Holder' }],
      specifications: [{ key: 'Rotation', value: '360°' }, { key: 'Projection', value: '120mm' }, { key: 'Fixings', value: 'Included' }],
      dimensions: { length: '155mm', depth: '120mm', weight: '350g' },
      tags: ['toilet-paper', 'brushed-gold', 'luxury'],
    },
    // ---- MORE PRODUCTS ----
    {
      name: 'Velocity 200mm Shower Arm Chrome',
      categoryName: 'Rain Showers', category: catMap['Rain Showers']._id,
      price: 1299, discountPrice: 999,
      description: 'Wall-mounted 200mm shower arm in polished chrome. Solid brass with ½" BSP connections. Designed to position any overhead shower head perfectly. Includes wall flange cover.',
      shortDescription: '200mm polished chrome solid brass shower arm with flange',
      material: 'Brass', finish: 'Chrome', warranty: '2 Years',
      sku: 'BC-RS-004', stock: 100,
      images: [{ url: img('shower-arm'), alt: 'Shower Arm Chrome' }],
      specifications: [{ key: 'Length', value: '200mm' }, { key: 'Thread', value: '½" BSP' }],
      dimensions: { length: '200mm', weight: '280g' },
      tags: ['shower-arm', 'chrome', 'wall-mount'],
    },
    {
      name: 'AquaWave 400mm Square Rain Shower',
      categoryName: 'Rain Showers', category: catMap['Rain Showers']._id,
      price: 12999, discountPrice: 9999,
      description: 'The premium 400mm square rain shower head with ultra-thin profile delivers an immersive rainfall experience. 200 silicone self-cleaning nozzles ensure even water distribution. Compatible with ceiling or arm mounting.',
      shortDescription: '400mm square ultra-thin rain shower with 200 self-cleaning nozzles',
      material: 'Stainless Steel 304', finish: 'Chrome', warranty: '3 Years',
      sku: 'BC-RS-005', stock: 25, isFeatured: true, isNewArrival: true,
      images: [{ url: img('square-shower'), alt: 'AquaWave 400mm Shower' }],
      specifications: [{ key: 'Size', value: '400x400mm' }, { key: 'Nozzles', value: '200 self-cleaning' }, { key: 'Profile', value: 'Ultra-thin 3mm' }],
      dimensions: { length: '400mm', width: '400mm', weight: '1.8kg' },
      tags: ['400mm', 'square', 'ultra-thin', 'premium'],
    },
    {
      name: 'HydroLux Thermostatic Bar Shower',
      categoryName: 'Rain Showers', category: catMap['Rain Showers']._id,
      price: 16999, discountPrice: 12999,
      description: 'Bar shower system with thermostatic control and a slider rail kit. Maintains your chosen temperature even when other taps are used. Includes 200mm overhead shower, slider rail, and handheld shower with 1.5m hose.',
      shortDescription: 'Thermostatic bar shower kit with 200mm overhead, rail, and hand shower',
      material: 'Brass + ABS', finish: 'Chrome', warranty: '3 Years',
      sku: 'BC-RS-006', stock: 22,
      images: [{ url: img('bar-shower'), alt: 'HydroLux Bar Shower' }],
      specifications: [{ key: 'Valve', value: 'Thermostatic' }, { key: 'Overhead', value: '200mm' }, { key: 'Rail', value: '600mm slider' }],
      dimensions: { height: '700mm', width: '180mm', weight: '3.2kg' },
      tags: ['thermostatic', 'bar-shower', 'slider-rail'],
    },
    {
      name: 'NanoCoat Handheld Shower 3-Mode',
      categoryName: 'Rain Showers', category: catMap['Rain Showers']._id,
      price: 2999, discountPrice: 2299,
      description: 'Versatile handheld shower with 3 spray modes: rainfall, massage, and mist. Anti-scale silicon nozzles for easy cleaning. 1.5m stainless steel hose included. Ergonomic handle with anti-slip grip.',
      shortDescription: '3-mode handheld shower with anti-scale nozzles and 1.5m hose',
      material: 'ABS + Stainless Steel', finish: 'Chrome', warranty: '1 Year',
      sku: 'BC-RS-007', stock: 85,
      images: [{ url: img('handheld-shower'), alt: 'Handheld Shower' }],
      specifications: [{ key: 'Modes', value: '3 (Rain, Massage, Mist)' }, { key: 'Hose', value: '1.5m SS' }, { key: 'Nozzles', value: 'Anti-scale silicone' }],
      dimensions: { length: '220mm', weight: '280g' },
      tags: ['handheld', '3-mode', 'anti-scale'],
    },
    {
      name: 'Basin Waste with Overflow Chrome',
      categoryName: 'Accessories', category: catMap['Accessories']._id,
      price: 799, discountPrice: 599,
      description: 'Click-clack basin waste with overflow kit in polished chrome. Push-to-open mechanism for simple one-touch operation. Includes all washers and fittings for standard installations.',
      shortDescription: 'Chrome click-clack basin waste with overflow kit',
      material: 'Brass + ABS', finish: 'Chrome', warranty: '1 Year',
      sku: 'BC-ACC-005', stock: 150,
      images: [{ url: img('basin-waste'), alt: 'Basin Waste Chrome' }],
      specifications: [{ key: 'Type', value: 'Click-clack' }, { key: 'Overflow', value: 'Included' }, { key: 'Size', value: '32mm' }],
      dimensions: { weight: '220g' },
      tags: ['basin-waste', 'click-clack', 'overflow'],
    },
    {
      name: 'Mirror Demister Pad 350x250mm',
      categoryName: 'Bathroom Mirrors', category: catMap['Bathroom Mirrors']._id,
      price: 1499, discountPrice: 1199,
      description: 'Keep your mirror crystal clear with the Mirror Demister Pad. Thin self-adhesive heating pad attaches to the back of any mirror up to 350x250mm. 60W element heats the glass surface above dew point. IP rated for bathroom use.',
      shortDescription: '350x250mm mirror demister pad, self-adhesive, 60W',
      material: 'Heating Element', finish: 'N/A', warranty: '1 Year',
      sku: 'BC-BM-002', stock: 80,
      images: [{ url: img('demister'), alt: 'Mirror Demister Pad' }],
      specifications: [{ key: 'Size', value: '350x250mm' }, { key: 'Power', value: '60W' }, { key: 'Adhesive', value: 'Self-adhesive' }, { key: 'IP Rating', value: 'IP44' }],
      dimensions: { length: '350mm', width: '250mm', weight: '180g' },
      tags: ['demister', 'anti-fog', 'mirror', 'heating'],
    },
    {
      name: 'Rectangular LED Backlit Mirror 1200x600',
      categoryName: 'Bathroom Mirrors', category: catMap['Bathroom Mirrors']._id,
      price: 18999, discountPrice: 14999,
      description: 'Large format LED backlit mirror with three-zone lighting: cool, neutral, and warm. Full perimeter LED strip creates a stunning luminous glow. Anti-fog, magnifying spot, digital clock, and Bluetooth speaker integrated.',
      shortDescription: '1200x600mm LED mirror with 3-color lighting, anti-fog, clock & Bluetooth',
      material: 'Safety Glass + Aluminium', finish: 'Frameless', warranty: '3 Years',
      sku: 'BC-BM-003', stock: 15, isFeatured: true, isNewArrival: true,
      images: [{ url: img('large-mirror'), alt: 'Large LED Mirror' }],
      specifications: [{ key: 'Size', value: '1200x600mm' }, { key: 'Lighting', value: '3 color zones' }, { key: 'Bluetooth', value: 'Yes' }, { key: 'Clock', value: 'Digital display' }],
      dimensions: { length: '1200mm', height: '600mm', weight: '18kg' },
      tags: ['LED', 'large', 'bluetooth', 'clock', '3-zone'],
    },
    {
      name: 'SmartFlow Digital Shower Controller',
      categoryName: 'Shower Panels', category: catMap['Shower Panels']._id,
      price: 21999, discountPrice: 17999,
      description: 'Control your entire shower ecosystem from a sleek digital touchscreen. The SmartFlow Controller manages temperature, flow, and multiple outlets with precision. Memory presets for up to 4 users. Wi-Fi enabled for voice control via Alexa and Google Home.',
      shortDescription: 'Wi-Fi shower controller with touchscreen, 4 user presets, Alexa/Google support',
      material: 'Stainless Steel + Glass', finish: 'Black Mirror', warranty: '2 Years',
      sku: 'BC-SP-003', stock: 14, isFeatured: true, isNewArrival: true,
      images: [{ url: img('smart-shower'), alt: 'SmartFlow Digital Controller' }],
      specifications: [{ key: 'Display', value: 'Touchscreen' }, { key: 'User Presets', value: '4' }, { key: 'Connectivity', value: 'Wi-Fi, Alexa, Google' }],
      dimensions: { height: '160mm', width: '120mm', weight: '1.2kg' },
      tags: ['smart', 'wifi', 'alexa', 'touchscreen', 'digital'],
    },
    {
      name: 'CleanLift Toilet Brush Set Chrome',
      categoryName: 'Accessories', category: catMap['Accessories']._id,
      price: 1299, discountPrice: 999,
      description: 'Hygienic toilet brush with a hidden storage container. The brush lifts cleanly from its holder with a drip-free mechanism. Chrome canister with weighted base prevents tipping.',
      shortDescription: 'Chrome toilet brush with drip-free hidden storage canister',
      material: 'Stainless Steel + PP', finish: 'Chrome', warranty: '1 Year',
      sku: 'BC-ACC-006', stock: 110,
      images: [{ url: img('toilet-brush'), alt: 'Chrome Toilet Brush' }],
      specifications: [{ key: 'Brush Material', value: 'Nylon' }, { key: 'Base', value: 'Weighted' }, { key: 'Mechanism', value: 'Drip-free lid' }],
      dimensions: { height: '380mm', diameter: '115mm', weight: '600g' },
      tags: ['toilet-brush', 'chrome', 'hygienic'],
    },
    {
      name: 'SteamPro Aroma Shower Head',
      categoryName: 'Rain Showers', category: catMap['Rain Showers']._id,
      price: 7999, discountPrice: 5999,
      description: 'Elevate your shower to a spa experience with the SteamPro Aroma Shower Head. Integrated aromatherapy pod holds essential oil tablets that release fragrance with each shower. LED chromotherapy lighting cycles through 7 colors.',
      shortDescription: 'Aromatherapy shower head with essential oil pod and 7-color LED chromotherapy',
      material: 'ABS', finish: 'Chrome', warranty: '1 Year',
      sku: 'BC-RS-008', stock: 40, isNewArrival: true,
      images: [{ url: img('aroma-shower'), alt: 'Aroma Shower Head' }],
      specifications: [{ key: 'LED Colors', value: '7' }, { key: 'Aroma Pod', value: 'Replaceable tablet' }, { key: 'Modes', value: '3' }],
      dimensions: { diameter: '180mm', height: '90mm', weight: '380g' },
      tags: ['aromatherapy', 'LED', 'chromotherapy', 'spa'],
    },
    {
      name: 'WrapAround Heated Mirror 600x800mm',
      categoryName: 'Bathroom Mirrors', category: catMap['Bathroom Mirrors']._id,
      price: 14999, discountPrice: 11999,
      description: 'Full-perimeter LED mirror with heated demist pad, 600x800mm. Color temperature adjustable from warm 2700K to daylight 6500K with touch control. Integrated shaver socket and USB port.',
      shortDescription: '600x800mm LED mirror with adjustable color temperature, shaver socket & USB',
      material: 'Safety Glass', finish: 'Chrome Frame', warranty: '3 Years',
      sku: 'BC-BM-004', stock: 22,
      images: [{ url: '/images/products/mirror.jpg', alt: 'WrapAround LED Mirror' }],
      specifications: [{ key: 'Size', value: '600x800mm' }, { key: 'Color Temp', value: '2700K-6500K' }, { key: 'Shaver Socket', value: 'Yes' }, { key: 'USB Port', value: 'Yes' }],
      dimensions: { length: '800mm', height: '600mm', weight: '10kg' },
      tags: ['LED', 'adjustable', 'shaver-socket', 'USB'],
    },
    {
      name: 'Waterfall Spout Deck Faucet Gold',
      categoryName: 'Bathroom Faucets', category: catMap['Bathroom Faucets']._id,
      price: 9999, discountPrice: 7999,
      description: 'Make a dramatic statement with the Waterfall Spout Deck Faucet in brushed gold. The wide rectangular spout creates a theatrical cascading water effect. Single lever control for intuitive temperature adjustment.',
      shortDescription: 'Brushed gold waterfall spout deck faucet with dramatic cascade effect',
      material: 'Solid Brass', finish: 'Brushed Gold', warranty: '3 Years',
      sku: 'BC-BF-005', stock: 25, isFeatured: true,
      images: [{ url: '/images/products/faucet.jpg', alt: 'Waterfall Spout Faucet Gold' }],
      specifications: [{ key: 'Spout Type', value: 'Waterfall' }, { key: 'Lever', value: 'Single' }, { key: 'Flow Rate', value: '7 L/min' }],
      dimensions: { height: '130mm', width: '160mm', weight: '780g' },
      tags: ['waterfall', 'gold', 'dramatic', 'deck-mount'],
    },
  ];
};

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Category.deleteMany({}),
      Coupon.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // Create categories
    const cats = categories.map(c => ({...c, slug: c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}));
    const createdCategories = await Category.insertMany(cats);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin BathCrest',
      email: 'admin@bathcrest.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '7838382868',
    });
    console.log('✅ Admin user created: admin@bathcrest.com / Admin@123');

    // Create sample customer
    await User.create({
      name: 'Shourya Garg',
      email: 'shouryagarg1808@gmail.com',
      password: 'User@123',
      role: 'customer',
      phone: '7838382868',
    });
    console.log('✅ Sample customer created');

    // Create products
    const products = makeProducts(createdCategories);
    const createdProducts = await Product.insertMany(products.map(p => ({
      ...p,
      slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.random().toString(36).substr(2, 4),
    })));
    console.log(`✅ Created ${createdProducts.length} products`);

    // Create sample coupons
    const coupons = [
      { code: 'WELCOME10', description: '10% off for new customers', discountType: 'percentage', discountValue: 10, minOrderValue: 999, maxDiscount: 500, validTill: new Date('2027-12-31'), usageLimit: 1000 },
      { code: 'BATH20', description: '20% off on bathroom accessories', discountType: 'percentage', discountValue: 20, minOrderValue: 2999, maxDiscount: 1000, validTill: new Date('2027-06-30') },
      { code: 'FLAT500', description: 'Flat ₹500 off on orders above ₹5000', discountType: 'fixed', discountValue: 500, minOrderValue: 5000, validTill: new Date('2027-12-31') },
      { code: 'LUXURY15', description: '15% off on premium products', discountType: 'percentage', discountValue: 15, minOrderValue: 9999, maxDiscount: 2000, validTill: new Date('2027-09-30') },
      { code: 'FREESHIP', description: 'Free shipping on all orders', discountType: 'fixed', discountValue: 299, minOrderValue: 1999, validTill: new Date('2027-12-31') },
    ];
    await Coupon.insertMany(coupons);
    console.log('✅ Created sample coupons: WELCOME10, BATH20, FLAT500, LUXURY15, FREESHIP');

    console.log('\n🎉 Database seeded successfully!');
    console.log('🔑 Admin login: admin@bathcrest.com / Admin@123');
    console.log('👤 Customer login: shouryagarg1808@gmail.com / User@123');
    if (require.main === module) process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    if (require.main === module) process.exit(1);
  }
}

// Auto-seed function for in-memory mode (doesn't connect/disconnect)
const slugify = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const seedDatabase = async () => {
  try {
    const User = require('../models/User');
    const Product = require('../models/Product');
    const Category = require('../models/Category');
    const Coupon = require('../models/Coupon');

    // Check if already seeded
    const existing = await Category.countDocuments();
    if (existing > 0) { console.log('✅ Database already seeded'); return; }

    // Seed categories — add slug manually (insertMany bypasses pre-save hooks)
    const categoriesWithSlugs = categories.map(cat => ({
      ...cat,
      slug: slugify(cat.name),
    }));
    const createdCategories = await Category.insertMany(categoriesWithSlugs);
    console.log(`✅ Seeded ${createdCategories.length} categories`);

    // Seed users
    await User.create({ name: 'BathCrest Admin', email: 'admin@bathcrest.com', password: 'Admin@123', role: 'admin', phone: '7838382868' });
    await User.create({ name: 'Shourya Garg', email: 'shouryagarg1808@gmail.com', password: 'User@123', role: 'customer', phone: '7838382868' });
    console.log('✅ Seeded sample users');

    // Seed products — add slug + ensure categoryName
    const products = makeProducts(createdCategories);
    const usedSlugs = new Set();
    const productsWithSlugs = products.map(p => {
      let base = slugify(p.name);
      let slug = base;
      let i = 1;
      while (usedSlugs.has(slug)) { slug = `${base}-${i++}`; }
      usedSlugs.add(slug);
      return { ...p, slug };
    });
    const createdProducts = await Product.insertMany(productsWithSlugs);
    console.log(`✅ Seeded ${createdProducts.length} products`);

    // Seed coupons
    await Coupon.insertMany([
      { code: 'WELCOME10', description: '10% off for new customers', discountType: 'percentage', discountValue: 10, minOrderValue: 999, maxDiscount: 500, validTill: new Date('2027-12-31'), usageLimit: 1000 },
      { code: 'BATH20', description: '20% off on bathroom accessories', discountType: 'percentage', discountValue: 20, minOrderValue: 2999, maxDiscount: 1000, validTill: new Date('2027-06-30') },
      { code: 'FLAT500', description: 'Flat ₹500 off on orders above ₹5000', discountType: 'fixed', discountValue: 500, minOrderValue: 5000, validTill: new Date('2027-12-31') },
      { code: 'LUXURY15', description: '15% off on premium products', discountType: 'percentage', discountValue: 15, minOrderValue: 9999, maxDiscount: 2000, validTill: new Date('2027-09-30') },
      { code: 'FREESHIP', description: 'Free shipping on all orders', discountType: 'fixed', discountValue: 299, minOrderValue: 1999, validTill: new Date('2027-12-31') },
    ]);
    console.log('✅ Seeded sample coupons');
    console.log('🎉 Auto-seed complete! Admin: admin@bathcrest.com / Admin@123');
  } catch (err) {
    console.error('⚠️ Auto-seed error:', err.message);
    console.error(err.stack);
  }
};

// Only run seed() if this file is executed directly
if (require.main === module) {
  seed();
}

module.exports = { seedDatabase };
