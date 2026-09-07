import type { CRMState, DealStage } from "../types";

export function moveDeal(state: CRMState, id: string, stage: DealStage): CRMState {
  return {
    ...state,
    deals: state.deals.map((deal) => deal.id === id
      ? { ...deal, stage, probability: stage === "Won" ? 100 : stage === "Lost" ? 0 : deal.probability }
      : deal),
  };
}

export function openDeals(state: Pick<CRMState, "deals">) {
  return state.deals.filter((deal) => deal.stage !== "Won" && deal.stage !== "Lost");
}

export function wonDeals(state: Pick<CRMState, "deals">) {
  return state.deals.filter((deal) => deal.stage === "Won");
}

export function sumDealValue(deals: { value: number }[]): number {
  return deals.reduce((sum, deal) => sum + deal.value, 0);
}
