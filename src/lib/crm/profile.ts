import type { CRMState, Profile } from "../types";

export function updateProfile(state: CRMState, profile: Profile): CRMState {
  return { ...state, profile };
}
