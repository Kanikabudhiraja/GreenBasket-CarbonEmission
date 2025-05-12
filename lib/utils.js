import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price) {
  // Determine if price is in paise (from Stripe) or already in rupees
  // If price is a large number (>1000), assume it's in paise and divide by 100
  const amount = price > 1000 ? price / 100 : price;
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}
