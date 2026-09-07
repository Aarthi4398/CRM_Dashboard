import type { Deal } from "../types";
import { openDeals, sumDealValue, wonDeals } from "./deals";

/** Portfolio KPI copy kept as a demo constant so live won-deal count does not change the dashboard chrome. */
export const DEMO_CLOSED_DEALS_COUNT = "874";

export function dashboardHeadlineMetrics(deals: Deal[]) {
  return {
    activeDealValue: `$${sumDealValue(openDeals({ deals })).toLocaleString("en-US")}`,
    revenueTotal: `$${sumDealValue(wonDeals({ deals })).toLocaleString("en-US")}`,
    closedDeals: DEMO_CLOSED_DEALS_COUNT,
  };
}
