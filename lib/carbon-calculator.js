"use client"

/**
 * Carbon footprint calculator utility
 * This module handles API calls to calculate carbon footprint for products
 */

// Keep the calculation functions for possible client-side use
// Baseline carbon emissions by product category (kg CO2e)
const CATEGORY_BASELINES = {
  clothing: 10,
  furniture: 25,
  home: 8,
  electronics: 15,
  food: 5,
  default: 12
};

// Material sustainability factors (lower is better)
const MATERIAL_FACTORS = {
  "organic cotton": 0.6,
  "recycled polyester": 0.4,
  "reclaimed wood": 0.3,
  "recycled glass": 0.2,
  "recycled plastic": 0.5,
  "bamboo": 0.35,
  "conventional cotton": 1.0,
  "virgin polyester": 1.2,
  "new wood": 1.0,
  "conventional materials": 1.0
};

// Production method factors (lower is better)
const PRODUCTION_FACTORS = {
  "handmade": 0.7,
  "artisanal": 0.8,
  "small batch": 0.85,
  "local": 0.75,
  "mass production": 1.1,
  "conventional": 1.0
};

// Transportation distance factors (lower is better)
const DISTANCE_FACTORS = {
  "local": 0.5,
  "domestic": 0.8,
  "international": 1.2,
  "unknown": 1.0
};

/**
 * Calculate the carbon footprint of a product based on its attributes
 * This is kept for possible client-side calculations
 * 
 * @param {Object} product - Product data
 * @param {string} product.category - Product category
 * @param {string} product.material - Primary material used
 * @param {string} product.productionMethod - How the product was made
 * @param {string} product.transportDistance - Where the product was shipped from
 * @param {number} product.weight - Product weight in kg
 * @returns {number} - Estimated carbon footprint in kg CO2e
 */
export async function calculateCarbonFootprint(product) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  try {
    const {
      category = "default",
      material = "conventional materials",
      productionMethod = "conventional",
      transportDistance = "unknown",
      weight = 1
    } = product;
    
    // Get baseline for category
    const baseline = CATEGORY_BASELINES[category.toLowerCase()] || CATEGORY_BASELINES.default;
    
    // Get factors for product attributes
    const materialFactor = MATERIAL_FACTORS[material.toLowerCase()] || MATERIAL_FACTORS["conventional materials"];
    const productionFactor = PRODUCTION_FACTORS[productionMethod.toLowerCase()] || PRODUCTION_FACTORS["conventional"];
    const distanceFactor = DISTANCE_FACTORS[transportDistance.toLowerCase()] || DISTANCE_FACTORS["unknown"];
    
    // Calculate carbon footprint
    let footprint = baseline * materialFactor * productionFactor * distanceFactor;
    
    // Adjust for weight
    footprint = footprint * (weight || 1);
    
    return parseFloat(footprint.toFixed(2));
  } catch (error) {
    console.error("Error calculating carbon footprint:", error);
    // If calculation fails, return a default value
    return 5.0;
  }
}

/**
 * Get conventional product footprint for comparison
 * 
 * @param {Object} product - Product data 
 * @returns {number} - Conventional product footprint
 */
export async function getConventionalFootprint(product) {
  const conventionalProduct = {
    ...product,
    material: "conventional materials",
    productionMethod: "conventional",
    transportDistance: "international"
  };
  
  return calculateCarbonFootprint(conventionalProduct);
}

/**
 * Calculate carbon savings compared to conventional products
 * 
 * @param {number} sustainableFootprint - Carbon footprint of sustainable product
 * @param {number} conventionalFootprint - Carbon footprint of conventional product
 * @returns {Object} - Carbon savings data
 */
export function calculateCarbonSavings(sustainableFootprint, conventionalFootprint) {
  const savings = conventionalFootprint - sustainableFootprint;
  const percentage = (savings / conventionalFootprint) * 100;
  
  return {
    savings: savings.toFixed(2),
    percentage: percentage.toFixed(0)
  };
}

/**
 * API call to get carbon footprint from the server
 * This calls the database API endpoint instead of using mock data
 */
export async function fetchCarbonFootprint(productId) {
  try {
    // Call the API endpoint with cache: 'no-store' to make it visible in Network tab
    const response = await fetch(`/api/carbon/${productId}`, {
      cache: 'no-store',
      headers: {
        'x-request-source': 'carbon-calculator'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch carbon data');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching carbon footprint data:", error);
    
    // Return default values if API call fails
    return {
      footprint: 5.0,
      conventionalFootprint: 15.0,
      savings: {
        savings: "10.00",
        percentage: "67"
      }
    };
  }
} 