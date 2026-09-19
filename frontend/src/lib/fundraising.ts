export type FundCategory = "MEDICAL" | "FLOOD_RELIEF" | "NATURAL_DISASTER" | "EDUCATION" | "COMMUNITY" | "OTHER";
export type FundStatus = "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "CLOSED";

export type FundComment = { id: string; author: string; body: string; createdAt: string; replyTo?: string };
export type Contribution = { id: string; donor: string; amount: number; method: string; reference: string; createdAt: string };
export type Fund = {
  id: string; title: string; category: FundCategory; description: string; location: string;
  beneficiary: string; contact: string; goalAmount: number; raisedAmount: number; status: FundStatus;
  authorId: number; author: string; createdAt: string; reactions: number; reactedBy: number[];
  comments: FundComment[]; contributions: Contribution[];
};

const KEY = "ecoknot-funds";
export const categoryLabels: Record<FundCategory, string> = {
  MEDICAL: "Medical emergency", FLOOD_RELIEF: "Flood relief", NATURAL_DISASTER: "Natural disaster",
  EDUCATION: "Education", COMMUNITY: "Community support", OTHER: "Other"
};
export const getFunds = (): Fund[] => typeof window === "undefined" ? [] : JSON.parse(localStorage.getItem(KEY) || "[]");
export const saveFunds = (funds: Fund[]) => localStorage.setItem(KEY, JSON.stringify(funds));
export const currency = (amount: number) => new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(amount);
