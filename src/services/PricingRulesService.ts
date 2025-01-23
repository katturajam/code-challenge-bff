import { PricingRuleInterface, MultiBuyRule, BulkDiscountRule } from '../models/PricingRule';

export class PricingRulesService {
  private pricingRules: PricingRuleInterface[] = [];

  constructor(private config: any[]) {
    this.initializeRules();
  }

  private initializeRules() {
    this.config.forEach((ruleConfig) => {
      switch (ruleConfig.type) {
        case 'MultiBuy':
          this.pricingRules.push(
            new MultiBuyRule(ruleConfig.sku, ruleConfig.requiredQuantity, ruleConfig.chargedQuantity)
          );
          break;
        case 'BulkDiscount':
          this.pricingRules.push(
            new BulkDiscountRule(ruleConfig.sku, ruleConfig.minQuantity, ruleConfig.discountedPrice)
          );
          break;
        default:
          throw new Error(`Unknown rule type: ${ruleConfig.type}`);
      }
    });
  }

  getRules(): PricingRuleInterface[] {
    return this.pricingRules;
  }
}

// Example pricing rules configuration
export const pricingRulesConfig = [
  {
    type: 'MultiBuy',
    sku: 'atv',
    requiredQuantity: 3,
    chargedQuantity: 2,
  },
  {
    type: 'BulkDiscount',
    sku: 'ipd',
    minQuantity: 5,
    discountedPrice: 499.99,
  },
];

// Usage
export const pricingRulesService = new PricingRulesService(pricingRulesConfig);
export const pricingRules = pricingRulesService.getRules();
