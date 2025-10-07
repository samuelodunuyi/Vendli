
import { Transaction } from "@/types";
import { sampleTransactions } from "./transactions/baseTransactions";
import { voidedTransactions, returnedTransactions } from "./transactions/specialTransactions";
import { highValueTransactions } from "./transactions/highValueTransactions";

export const mockTransactions: Transaction[] = [
  ...sampleTransactions,
  ...highValueTransactions,
  ...voidedTransactions,
  ...returnedTransactions,
];
