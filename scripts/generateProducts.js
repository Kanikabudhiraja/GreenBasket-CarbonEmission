const fs = require('fs');
const path = require('path');

// Base directory for product images
const baseDir = path.join(process.cwd(), 'public/images/products');

// Product categories and their mapping to product types
const categoryMapping = {
  'Accessories': 'accessories',
  'Clothing': 'clothing',
  'Furniture': 'furniture',
  'Home goods': 'home',
  'Personal Care': 'personal-care',
  'Stationery': 'stationery'
};

// Sample product details to be used as templates
const productTemplates = {
  'accessories': {
    price: () => Math.floor(Math.random() * 2000) + 499, // 499 to 2499
    carbonFootprint: () => (Math.random() * 0.8 + 0.2).toFixed(1), // 0.2 to 1.0
    description: (name) => `Premium eco-friendly ${name.toLowerCase()} crafted from sustainable materials, reducing environmental impact without compromising performance.`,
    details: (name) => `This thoughtfully designed ${name.toLowerCase()} combines sustainability with cutting-edge functionality. Made from recycled and bio-based materials, it significantly reduces carbon emissions during manufacturing. Each unit is built for durability and longevity, extending its lifecycle and minimizing waste. The packaging is 100% recyclable and plastic-free, reflecting our commitment to a circular economy.`,
    rating: () => (Math.random() * 1 + 4).toFixed(1), // 4.0 to 5.0
    reviewCount: () => Math.floor(Math.random() * 100) + 20, // 20 to 120
    inStock: true,
    deliveryTime: "2-4 days",
    features: [
      "Made with recycled and sustainable materials",
      "Carbon-neutral manufacturing process",
      "Plastic-free, biodegradable packaging",
      "Extended lifespan design",
      "Energy-efficient operation"
    ]
  },
  'clothing': {
    price: () => Math.floor(Math.random() * 4000) + 999, // 999 to 4999
    carbonFootprint: () => (Math.random() * 1.5 + 0.5).toFixed(1), // 0.5 to 2.0
    description: (name) => `Premium ${name.toLowerCase()} made from organic and recycled fabrics, combining style with sustainability.`,
    details: (name) => `This ${name.toLowerCase()} represents the future of sustainable fashion. Crafted from GOTS-certified organic cotton and recycled materials, it uses 90% less water than conventional alternatives. The production process employs renewable energy and zero-waste techniques, while natural, non-toxic dyes preserve water quality. Each garment is designed for longevity, reducing the need for frequent replacements and minimizing fashion's environmental footprint.`,
    rating: () => (Math.random() * 1 + 4).toFixed(1), // 4.0 to 5.0
    reviewCount: () => Math.floor(Math.random() * 150) + 50, // 50 to 200
    inStock: true,
    deliveryTime: "2-3 days",
    features: [
      "GOTS-certified organic cotton",
      "Water-saving manufacturing (90% reduction)",
      "Natural, non-toxic dyes",
      "Fair labor certified production",
      "Carbon-neutral shipping"
    ]
  },
  'furniture': {
    price: () => Math.floor(Math.random() * 15000) + 4999, // 4999 to 19999
    carbonFootprint: () => (Math.random() * 2 + 1).toFixed(1), // 1.0 to 3.0
    description: (name) => `Elegant ${name.toLowerCase()} handcrafted from reclaimed wood and sustainable materials, combining timeless design with environmental responsibility.`,
    details: (name) => `This beautiful ${name.toLowerCase()} represents the perfect balance of sustainability and craftsmanship. Made from 100% reclaimed wood sourced from old buildings and FSC-certified sustainable forestry, each piece prevents deforestation and diverts materials from landfills. Hand-finished with natural, VOC-free oils that are safe for your home and the environment. The timeless design ensures this piece will remain stylish for generations, reducing the need for replacement and further minimizing environmental impact.`,
    rating: () => (Math.random() * 1 + 4).toFixed(1), // 4.0 to 5.0
    reviewCount: () => Math.floor(Math.random() * 80) + 20, // 20 to 100
    inStock: true,
    deliveryTime: "7-10 days",
    features: [
      "100% reclaimed or FSC-certified wood",
      "Natural, VOC-free finishes",
      "Handcrafted by skilled artisans",
      "Carbon-neutral manufacturing",
      "Modular design for easy repair"
    ]
  },
  'home': {
    price: () => Math.floor(Math.random() * 3000) + 999, // 999 to 3999
    carbonFootprint: () => (Math.random() * 1 + 0.5).toFixed(1), // 0.5 to 1.5
    description: (name) => `Premium ${name.toLowerCase()} crafted from eco-friendly materials, designed to enhance your home sustainably.`,
    details: (name) => `This innovative ${name.toLowerCase()} combines aesthetic appeal with environmental responsibility. Created from recycled and renewable materials, it significantly reduces resource consumption compared to conventional alternatives. The production process prioritizes water conservation and minimizes carbon emissions. Built to last with replaceable components, this product extends its lifecycle and reduces waste. Every detail, from materials to packaging, reflects our commitment to sustainable living.`,
    rating: () => (Math.random() * 1 + 4).toFixed(1), // 4.0 to 5.0
    reviewCount: () => Math.floor(Math.random() * 100) + 30, // 30 to 130
    inStock: true,
    deliveryTime: "2-5 days",
    features: [
      "Made from recycled and renewable materials",
      "Water and energy-efficient production",
      "Zero-waste packaging",
      "Replaceable parts for extended life",
      "Non-toxic materials safe for home use"
    ]
  },
  'personal-care': {
    price: () => Math.floor(Math.random() * 800) + 199, // 199 to 999
    carbonFootprint: () => (Math.random() * 0.5 + 0.2).toFixed(1), // 0.2 to 0.7
    description: (name) => `Premium ${name.toLowerCase()} formulated with organic and plant-based ingredients for effective, eco-conscious personal care.`,
    details: (name) => `This exceptional ${name.toLowerCase()} is formulated with carefully selected organic and plant-based ingredients that work in harmony with your body and the planet. Free from harmful chemicals, parabens, and synthetic fragrances, it provides effective care without environmental compromise. The packaging is made from post-consumer recycled materials and is fully biodegradable or refillable. Our production practices prioritize water conservation and renewable energy, while supporting fair trade partnerships with ingredient suppliers.`,
    rating: () => (Math.random() * 1 + 4).toFixed(1), // 4.0 to 5.0
    reviewCount: () => Math.floor(Math.random() * 100) + 40, // 40 to 140
    inStock: true,
    deliveryTime: "1-3 days",
    features: [
      "100% natural and organic ingredients",
      "Free from parabens, sulfates, and synthetic fragrances",
      "Biodegradable or recyclable packaging",
      "Cruelty-free and vegan certified",
      "Fair trade sourcing"
    ]
  },
  'stationery': {
    price: () => Math.floor(Math.random() * 500) + 99, // 99 to 599
    carbonFootprint: () => (Math.random() * 0.4 + 0.1).toFixed(1), // 0.1 to 0.5
    description: (name) => `Premium ${name.toLowerCase()} crafted from recycled and tree-free materials, combining functionality with environmental responsibility.`,
    details: (name) => `This innovative ${name.toLowerCase()} reimagines conventional stationery with sustainability at its core. Made from recycled paper or tree-free alternatives like bamboo, sugarcane, or agricultural waste, it significantly reduces deforestation impact. The production process uses 60% less water and energy than traditional methods, while plant-based inks eliminate toxic chemicals. Designed for optimal functionality without environmental compromise, this product demonstrates how everyday items can contribute to a more sustainable future.`,
    rating: () => (Math.random() * 1 + 4).toFixed(1), // 4.0 to 5.0
    reviewCount: () => Math.floor(Math.random() * 80) + 20, // 20 to 100
    inStock: true,
    deliveryTime: "1-2 days",
    features: [
      "Made from 100% recycled or tree-free materials",
      "Plant-based, non-toxic inks and adhesives",
      "Plastic-free packaging",
      "Carbon-neutral manufacturing",
      "Designed for biodegradability"
    ]
  }
};

// Get all directories for each product category
function getProductDirectories() {
  const productDirs = {};
  
  // Get all top-level category directories
  const categoryDirs = fs.readdirSync(baseDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  categoryDirs.forEach(categoryDir => {
    const categoryPath = path.join(baseDir, categoryDir);
    
    // Get all product subdirectories in each category
    try {
      const productSubDirs = fs.readdirSync(categoryPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => {
          return {
            name: dirent.name,
            path: path.join(categoryDir, dirent.name)
          };
        });
      
      productDirs[categoryDir] = productSubDirs;
      
      // For categories with further nesting (like Clothing/clothing men/tees)
      productSubDirs.forEach(subDir => {
        const subDirPath = path.join(categoryPath, subDir.name);
        try {
          const nestedDirs = fs.readdirSync(subDirPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => {
              return {
                name: dirent.name,
                path: path.join(categoryDir, subDir.name, dirent.name)
              };
            });
          
          if (nestedDirs.length > 0) {
            productDirs[`${categoryDir}/${subDir.name}`] = nestedDirs;
          }
        } catch (err) {
          console.error(`Error reading nested directory ${subDirPath}:`, err);
        }
      });
    } catch (err) {
      console.error(`Error reading category directory ${categoryPath}:`, err);
    }
  });
  
  return productDirs;
}

// Get images for a product directory
function getProductImages(productPath) {
  const fullPath = path.join(baseDir, productPath);
  
  try {
    return fs.readdirSync(fullPath)
      .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
      .map(file => `/images/products/${productPath}/${file}`);
  } catch (err) {
    console.error(`Error reading images from ${fullPath}:`, err);
    return [];
  }
}

// Generate a name for the product based on directory name
function generateProductName(dirName, categoryType) {
  // Clean up directory names like "product 22" or "White Strip Error"
  const cleanName = dirName
    .replace(/^product\s+\d+$/i, (match) => {
      // Map generic product names to more descriptive ones based on category
      const num = parseInt(match.replace(/^product\s+/i, ''));
      
      // Define category-specific product names for electronic devices
      const electronicsMapping = {
        'accessories': [
          'Eco-Friendly Solar Power Bank',
          'Sustainable Wireless Charger',
          'Recycled Material Phone Case',
          'Biodegradable Earbuds',
          'Solar-Powered Bluetooth Speaker',
          'Bamboo Wireless Mouse',
          'Recycled Plastic Keyboard',
          'Sustainable Laptop Stand',
          'Eco-Friendly Phone Stand',
          'Solar-Powered Calculator',
          'Energy-Efficient USB Hub',
          'Recyclable Tablet Cover',
          'Sustainable Memory Card',
          'Eco-Friendly Camera Strap',
          'Solar-Powered Watch',
          'Recycled USB Drive',
          'Sustainable Smart Watch',
          'Eco-Friendly Headphones',
          'Energy-Saving USB Light',
          'Bamboo Tablet Stylus',
          'Recycled Plastic Webcam Cover',
          'Sustainable Laptop Bag',
          'Solar Charging Portable Light',
          'Eco-Friendly Cable Organizer'
        ],
        'personal-care': [
          'Energy-Efficient Hair Dryer',
          'Sustainable Electric Toothbrush',
          'Eco-Friendly Facial Cleansing Device',
          'Recyclable Electric Razor',
          'Solar-Powered Massager',
          'Biodegradable Electric Nail File',
          'Sustainable Water Flosser',
          'Eco-Friendly Skin Care Device',
          'Energy-Saving Aromatherapy Diffuser',
          'Sustainable UV Sanitizer'
        ],
        'home': [
          'Energy-Efficient LED Lamp',
          'Sustainable Smart Thermostat',
          'Eco-Friendly Air Purifier',
          'Water-Saving Smart Sprinkler',
          'Recycled Material Space Heater',
          'Solar-Powered Garden Light',
          'Energy-Efficient Small Blender',
          'Sustainable Coffee Grinder',
          'Eco-Friendly Electric Kettle',
          'Water-Conserving Humidifier'
        ],
        'furniture': [
          'Energy-Efficient Standing Desk',
          'Sustainable Smart Cabinet',
          'Eco-Friendly Adjustable Bed Frame',
          'Solar-Powered Outdoor Table',
          'Smart Recycling Bin',
          'Energy-Saving Desk Lamp',
          'Sustainable Heated Footrest',
          'Eco-Friendly Charging Side Table'
        ]
      };
      
      // If we have specific mappings for this category, use them
      if (electronicsMapping[categoryType]) {
        const deviceNames = electronicsMapping[categoryType];
        const index = num % deviceNames.length;
        return deviceNames[index];
      }
      
      // Fallback to generic accessories names if no specific mapping
      const accessories = [
        'Sustainable Watch', 'Eco-friendly Wallet', 'Bamboo Sunglasses', 
        'Recycled Fabric Backpack', 'Hemp Tote Bag', 'Upcycled Jewelry Set'
      ];
      const index = num % accessories.length;
      return accessories[index];
    })
    .replace(/(\w)(\w*)/g, (g0, g1, g2) => {
      return g1.toUpperCase() + g2.toLowerCase();
    })
    .replace(/[-_]/g, ' ');
  
  // Add eco-friendly prefixes to some names
  const prefixes = ['Eco-Friendly', 'Sustainable', 'Recycled', 'Organic', 'Bamboo'];
  const shouldAddPrefix = Math.random() > 0.5;
  
  if (shouldAddPrefix && !cleanName.includes('Eco') && 
      !cleanName.includes('Sustainable') && 
      !cleanName.includes('Recycled') && 
      !cleanName.includes('Solar')) {
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    return `${prefix} ${cleanName}`;
  }
  
  return cleanName;
}

// Update product details for electronic devices
function getElectronicDetails(categoryType, productName) {
  const electronicsDetails = {
    'accessories': {
      description: (name) => `Energy-efficient ${name.toLowerCase()} crafted with sustainable materials and cutting-edge green technology.`,
      details: (name) => `This revolutionary ${name.toLowerCase()} sets a new standard for eco-friendly electronics. The exterior is constructed from recycled plastics and bio-based polymers, while internal components utilize conflict-free minerals and metals. Advanced energy management systems reduce power consumption by up to 40% compared to conventional models. The modular design enables easy repairs and component upgrades, extending the product lifecycle and reducing electronic waste. Each unit is manufactured in facilities powered by renewable energy, further reducing its carbon footprint.`,
      features: [
        "Made with 70% recycled and renewable materials",
        "Energy-efficient design (40% less power consumption)",
        "Modular construction for easy repair and upgrading",
        "Plastic-free, recyclable packaging",
        "Carbon-neutral manufacturing and shipping"
      ]
    },
    'personal-care': {
      description: (name) => `Advanced ${name.toLowerCase()} that combines premium performance with eco-friendly design and materials.`,
      details: (name) => `This innovative ${name.toLowerCase()} harmonizes cutting-edge technology with environmental responsibility. Featuring ultra-efficient motors and advanced power management, it consumes 50% less energy than standard models while delivering superior performance. The housing is made from recycled and plant-based plastics, reducing petroleum dependency. User-replaceable parts extend product lifespan, while the energy-recovery system maximizes efficiency. Manufactured in zero-waste facilities powered by renewable energy, this device represents the future of sustainable personal care technology.`,
      features: [
        "Ultra-efficient motor with 50% energy reduction",
        "Housing made from 80% recycled materials",
        "User-replaceable parts for extended lifespan",
        "Energy-recovery system for maximum efficiency",
        "Zero-waste manufacturing process"
      ]
    },
    'home': {
      description: (name) => `Smart ${name.toLowerCase()} that combines energy efficiency with sustainable materials for eco-conscious homes.`,
      details: (name) => `This state-of-the-art ${name.toLowerCase()} represents the pinnacle of sustainable home technology. Its intelligent power management system reduces energy consumption by up to 60% compared to conventional models. Constructed primarily from recycled and renewable materials, it minimizes resource depletion while maintaining premium quality. The advanced sleep mode consumes near-zero standby power, while smart sensors optimize operation based on usage patterns. Designed for longevity with easily replaceable components, this product dramatically reduces electronic waste while enhancing your home environment.`,
      features: [
        "Intelligent power management (60% energy reduction)",
        "Constructed from 85% recycled materials",
        "Near-zero standby power consumption",
        "Smart sensors for usage optimization",
        "10-year lifespan design with replaceable components"
      ]
    },
    'furniture': {
      description: (name) => `Innovative ${name.toLowerCase()} that seamlessly integrates sustainable materials with smart, energy-efficient technology.`,
      details: (name) => `This groundbreaking ${name.toLowerCase()} reimagines furniture for the sustainable future. The structure is crafted from reclaimed wood and recycled metals, while the integrated technology utilizes ultra-efficient components that consume 70% less power than standard alternatives. Solar-augmented charging capabilities reduce grid dependency, and advanced sleep modes minimize standby consumption. The modular design allows for component upgrades and replacements, extending the product's useful life and reducing waste. Each piece is handcrafted in renewable-powered facilities, combining artisanal quality with environmental responsibility.`,
      features: [
        "Ultra-low power electronic components (70% reduction)",
        "Reclaimed and sustainable structural materials",
        "Solar-augmented charging capabilities",
        "Modular design for easy technology upgrades",
        "Zero electronic waste manufacturing protocol"
      ]
    }
  };

  // Check if product name contains electronic keywords
  const isElectronic = /solar|power|energy|smart|electric|charger|usb|digital|speaker|calculator|watch|headphone|dryer|thermostat|purifier|led|lamp|gaming|console|controller|laptop|tablet|camera|phone|mic|computer/i.test(productName);

  if (isElectronic && electronicsDetails[categoryType]) {
    return {
      description: electronicsDetails[categoryType].description(productName),
      details: electronicsDetails[categoryType].details(productName),
      features: electronicsDetails[categoryType].features
    };
  }
  
  return null;
}

// Generate products.json file
function generateProductsJson() {
  const productDirs = getProductDirectories();
  let productId = 1;
  const products = [];
  
  // Flatten the nested directory structure and create product entries
  Object.entries(productDirs).forEach(([categoryPath, subDirs]) => {
    // Get the top-level category
    const topCategory = categoryPath.split('/')[0];
    const categoryType = categoryMapping[topCategory] || 'accessories';
    
    subDirs.forEach(subDir => {
      const images = getProductImages(subDir.path);
      
      // Only create products for directories with images
      if (images.length > 0) {
        const template = productTemplates[categoryType];
        const productName = generateProductName(subDir.name, categoryType);
        
        // Get electronic-specific details if applicable
        const electronicDetails = getElectronicDetails(categoryType, productName);
        
        // Create description and details based on product name
        const productDescription = electronicDetails?.description || template.description(productName);
        const productDetails = electronicDetails?.details || template.details(productName);
        
        const product = {
          id: productId++,
          name: productName,
          price: template.price(),
          carbonFootprint: parseFloat(template.carbonFootprint()),
          images: images,
          category: categoryType,
          description: productDescription,
          details: productDetails,
          rating: parseFloat(template.rating()),
          reviewCount: template.reviewCount(),
          inStock: true,
          deliveryTime: template.deliveryTime,
          features: electronicDetails?.features || template.features
        };
        
        products.push(product);
      }
    });
  });
  
  // Sort products by ID
  products.sort((a, b) => a.id - b.id);
  
  // Add or keep the existing special products with IDs 101-103
  const existingSpecialProducts = [
    {
      id: 101,
      name: "Eco-Friendly Correction Pen",
      price: 399,
      carbonFootprint: 0.2,
      images: [
        "/images/products/Stationery/White Strip Error/714+-YEhZYL._SX522_.jpg",
        "/images/products/Stationery/White Strip Error/71AIg4DrzJL._SX522_.jpg",
        "/images/products/Stationery/White Strip Error/7121MutBSCL._SX522_.jpg"
      ],
      category: "stationery",
      description: "Revolutionary correction pen made from 85% recycled materials with non-toxic, water-based formula.",
      details: "Our innovative correction pen reimagines everyday stationery with sustainability at its core. The barrel is crafted from post-consumer recycled plastics, while the precision tip ensures accurate application with minimal waste. The correction fluid uses a water-based, non-toxic formula free from harmful solvents and chemicals. It dries three times faster than conventional products while providing superior coverage. The manufacturing process uses 70% less energy than standard methods, and each pen diverts plastic equivalent to five water bottles from landfills.",
      rating: 4.6,
      reviewCount: 45,
      inStock: true,
      deliveryTime: "1-2 days",
      features: [
        "Barrel made from 85% post-consumer recycled plastic",
        "Non-toxic, solvent-free, water-based formula",
        "Quick-drying technology (3x faster than standard)",
        "Precision application tip reduces waste",
        "70% less energy used in manufacturing"
      ]
    },
    {
      id: 102,
      name: "Organic Body Lotion",
      price: 799,
      carbonFootprint: 0.3,
      images: [
        "/images/products/Personal Care/Body Lotion/612ctEDavpL._SX522_.jpg",
        "/images/products/Personal Care/Body Lotion/71LL5gkaPEL._SX522_.jpg",
        "/images/products/Personal Care/Body Lotion/713CMzfgStL._SL1500_.jpg"
      ],
      category: "personal-care",
      description: "Luxurious body lotion formulated with 100% organic, plant-based ingredients for effective hydration and skin nourishment.",
      details: "This premium body lotion represents the pinnacle of sustainable skincare. Formulated with 100% certified organic ingredients including cold-pressed oils, plant extracts, and botanical butters, it delivers exceptional hydration while supporting skin health. The advanced formula penetrates deeply without leaving residue, providing 24-hour moisture retention with clinical efficacy. Free from parabens, sulfates, silicones, and synthetic fragrances, it's gentle enough for sensitive skin. The bottle is made from 100% post-consumer recycled materials and is fully recyclable, while the manufacturing process uses renewable energy and water-conservation techniques.",
      rating: 4.8,
      reviewCount: 67,
      inStock: true,
      deliveryTime: "2-3 days",
      features: [
        "100% certified organic, plant-based ingredients",
        "Clinically proven 24-hour hydration",
        "Free from parabens, sulfates, and synthetic fragrances",
        "100% recycled and recyclable packaging",
        "Fair trade certified ingredient sourcing"
      ]
    },
    {
      id: 103,
      name: "Sustainable Solar Power Bank",
      price: 2499,
      carbonFootprint: 0.4,
      images: [
        "/images/products/Accessories/product 22/81eG1PLn6TL._SX522_.jpg",
        "/images/products/Accessories/product 22/717yotBLXaL._SX522_.jpg",
        "/images/products/Accessories/product 22/61DKsll9yDL._SX522_.jpg"
      ],
      category: "accessories",
      description: "High-capacity solar power bank with rapid charging technology, made from 90% recycled materials.",
      details: "This revolutionary solar power bank represents the future of sustainable portable energy. The exterior is constructed from ocean-bound recycled plastics, while the high-efficiency monocrystalline solar panel delivers clean energy even in low-light conditions. The advanced lithium-polymer battery provides 20,000mAh capacity with smart power management that optimizes charging based on connected devices. Quick-charge technology delivers power 3x faster than conventional banks, while the modular design allows for battery replacement, extending the product's life cycle. Each unit saves approximately 20kg of CO₂ emissions compared to standard power banks over its lifetime.",
      rating: 4.7,
      reviewCount: 32,
      inStock: true,
      deliveryTime: "3-5 days",
      features: [
        "High-efficiency solar charging in various light conditions",
        "20,000mAh capacity with smart power management",
        "Housing made from 90% ocean-bound recycled plastics",
        "Quick-charge technology (3x faster than standard)",
        "Replaceable battery system for extended product life"
      ]
    }
  ];
  
  // Keep the special products
  const finalProducts = [
    ...products.filter(p => p.id <= 100),
    ...existingSpecialProducts
  ];
  
  // Write the products to products.json
  fs.writeFileSync(
    path.join(process.cwd(), 'lib/products.json'),
    JSON.stringify(finalProducts, null, 2)
  );
  
  console.log(`Generated products.json with ${finalProducts.length} products`);
}

// Run the generator
generateProductsJson(); 