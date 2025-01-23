import { Product } from './models/Product';
import { CartService } from './services/CartService';
import { pricingRules } from './services/PricingRulesService';

// Initialize the product catalog
const productCatalog = new Map<string, Product>([
  ['ipd', new Product('ipd', 'Super iPad', 549.99)],
  ['mbp', new Product('mbp', 'MacBook Pro', 1399.99)],
  ['atv', new Product('atv', 'Apple TV', 109.50)],
  ['vga', new Product('vga', 'VGA adapter', 30.0)],
]);

// Initialize CartService with product catalog and pricing rules
const cart = new CartService(productCatalog, pricingRules);

// Test Case 1
cart.scan('atv');
cart.scan('atv');
cart.scan('atv');
cart.scan('vga');
console.log('Total expected: $249.00, Actual:', cart.total().toFixed(2));

// Test Case 2
const cart2 = new CartService(productCatalog, pricingRules);
cart2.scan('atv');
cart2.scan('ipd');
cart2.scan('ipd');
cart2.scan('atv');
cart2.scan('ipd');
cart2.scan('ipd');
cart2.scan('ipd');
console.log('Total expected: $2718.95, Actual:', cart2.total().toFixed(2));
