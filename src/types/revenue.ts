/**
 * Revenue and financial telemetry types for Waypoint Admin & Courier operations
 */

export interface AdminOverviewRevenue {
  totalRevenue: number;
  earningsFromCard: number;
  earningsFromCod: number;
  grossCodCollected: number;
  courierCashInHand: number;
  remittedToHubs: number;
  pendingMerchantPayables?: number;
}

export interface RevenueSummary {
  totalRevenue: number;
  cardEarnings: number;
  codEarnings: number;
  cardPercentage: number;
  codPercentage: number;
  gatewayFees: number;
  netMargin: number;
}

export interface CodCashFlow {
  grossCodCollected: number;
  courierCashInHand: number;
  remittedToHubs: number;
  pendingMerchantPayables: number;
  settledToMerchants: number;
}

export interface UnitEconomics {
  averageRevenuePerShipment: number;
  averageDeliveryFee: number;
  averageCodCommission: number;
  deliveredShipmentCount: number;
}

export interface RouteYield {
  volume: number;
  earnings: number;
  averageYield: number;
}

export interface BreakdownByDeliveryType {
  local: RouteYield;
  interDistrict: RouteYield;
}

export interface AdminRevenueDetail {
  summary: RevenueSummary;
  codCashFlow: CodCashFlow;
  unitEconomics: UnitEconomics;
  breakdownByDeliveryType: BreakdownByDeliveryType;
}

export type TrendInterval = "day" | "week" | "month";

export interface RevenueTrendPoint {
  date: string;
  totalEarnings: number;
  cardEarnings: number;
  codEarnings: number;
  grossCodCollected: number;
  shipmentCount: number;
}
