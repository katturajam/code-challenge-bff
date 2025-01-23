import { Product } from './Product';

export interface PricingRuleInterface {
  apply(cart: Map<string, number>, productCatalog: Map<string, Product>): number;
}

export class MultiBuyRule implements PricingRuleInterface {
  constructor(
    private sku: string,
    private requiredQuantity: number,
    private chargedQuantity: number
  ) {}

  apply(cart: Map<string, number>, productCatalog: Map<string, Product>): number {
    const quantity = cart.get(this.sku) || 0;
    if (quantity === 0) return 0;

    const product = productCatalog.get(this.sku);
    if (!product) return 0;

    const ruleSets = Math.floor(quantity / this.requiredQuantity);
    const remainingItems = quantity % this.requiredQuantity;

    const total = ruleSets * this.chargedQuantity * product.price + remainingItems * product.price;
    cart.set(this.sku, 0); // Mark as processed
    return total;
  }
}

export class BulkDiscountRule implements PricingRuleInterface {
  constructor(private sku: string, private minQuantity: number, private discountedPrice: number) {}

  apply(cart: Map<string, number>, productCatalog: Map<string, Product>): number {
    const quantity = cart.get(this.sku) || 0;
    if (quantity === 0) return 0;

    const product = productCatalog.get(this.sku);
    if (!product) return 0;

    const price = quantity >= this.minQuantity ? this.discountedPrice : product.price;
    const total = quantity * price;

    cart.set(this.sku, 0); // Mark as processed
    return total;
  }
}
