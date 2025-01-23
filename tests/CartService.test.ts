import { Product } from '../src/models/Product';
import { CartService } from '../src/services/CartService';
import { pricingRules } from '../src/services/PricingRulesService';

describe('CartService', () => {
  let productCatalog: Map<string, Product>;

  beforeEach(() => {
    productCatalog = new Map<string, Product>([
      ['ipd', new Product('ipd', 'Super iPad', 549.99)],
      ['mbp', new Product('mbp', 'MacBook Pro', 1399.99)],
      ['atv', new Product('atv', 'Apple TV', 109.50)],
      ['vga', new Product('vga', 'VGA adapter', 30.0)],
    ]);
  });

  it('should calculate total for Test Case 1 (3 Apple TVs and 1 VGA adapter)', () => {
    const cart = new CartService(productCatalog, pricingRules);
    cart.scan('atv');
    cart.scan('atv');
    cart.scan('atv');
    cart.scan('vga');
    const total = cart.total();
    expect(total).toBe(249.0); // 3-for-2 deal on Apple TV
  });

  it('should calculate total for Test Case 2 (mixed products with rules applied)', () => {
    const cart = new CartService(productCatalog, pricingRules);
    cart.scan('atv');
    cart.scan('ipd');
    cart.scan('ipd');
    cart.scan('atv');
    cart.scan('ipd');
    cart.scan('ipd');
    cart.scan('ipd');
    const total = cart.total();
    expect(total).toBeCloseTo(2718.95, 2); // Bulk discount on Super iPad and 3-for-2 deal on Apple TV
  });

  it('should handle an empty cart', () => {
    const cart = new CartService(productCatalog, pricingRules);
    const total = cart.total();
    expect(total).toBe(0.0); // Empty cart total
  });

  it('should handle items with no applicable pricing rules', () => {
    const cart = new CartService(productCatalog, pricingRules);
    cart.scan('vga');
    cart.scan('vga');
    const total = cart.total();
    expect(total).toBe(60.0); // 2 VGA adapters, no pricing rules
  });

  it('should throw an error for invalid product SKU', () => {
    const cart = new CartService(productCatalog, pricingRules);
    expect(() => cart.scan('invalidSKU')).toThrow('Product with SKU invalidSKU not found');
  });
});
