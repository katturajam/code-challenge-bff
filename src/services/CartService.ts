import { Product } from '../models/Product';
import { PricingRuleInterface } from '../models/PricingRule';

export class CartService {
  private cart = new Map<string, number>();

  constructor(
    private productCatalog: Map<string, Product>,
    private pricingRules: PricingRuleInterface[]
  ) {}

  scan(sku: string): void {
    // Check if the SKU exists in the product catalog
    if (!this.productCatalog.has(sku)) {
      throw new Error(`Product with SKU ${sku} not found`);
    }

    if (this.cart.has(sku)) {
      this.cart.set(sku, this.cart.get(sku)! + 1);
    } else {
      this.cart.set(sku, 1);
    }
  }

  total(): number {
    let total = 0;

    // Apply pricing rules
    this.pricingRules.forEach((rule) => {
      total += rule.apply(this.cart, this.productCatalog);
    });

    // Calculate remaining items not covered by pricing rules
    this.cart.forEach((quantity, sku) => {
      const product = this.productCatalog.get(sku);
      if (product && quantity > 0) {
        total += product.price * quantity;
      }
    });

    return total;
  }
}
