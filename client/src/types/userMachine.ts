import { User } from "./user";

export interface UserMachine {
  _id: string;
  user: string | User;
  machine: string;
  assignedDate: Date;
  monthlyProfitAccumulated: number;
  status: "active" | "inactive";
}



export interface AssignMachinePayload {
  userId: string;
  machineId: string;
}

export interface UpdateProfitPayload {
  userMachineId: string;
  profitAmount: number;
}

export interface ProfitUpdateStatus {
  userMachineId: string;
  userName: string;
  machineName: string;
  lastUpdateDate: Date;
  daysSinceLastUpdate: number;
  daysUntilNextUpdate: number;
  currentAccumulatedProfit: number;
  status: string;
}
export interface Transaction {
  _id: string;
  user: string;
  amount: number;
  transactionDate: Date;
  type: 'withdrawal' | 'profit';
  details: string;
}

export interface WithdrawalResponse {
  message: string;
  transaction: Transaction;
  withdrawnAmount: number;
  remainingProfit: number;
  userEmail: string;
}
export interface WithdrawalPayload {
  email: string;
  amount: number;
}

export interface UserProfitSummary {
  userId: string;
  userEmail: string;
  userName: string;
  totalMachines: number;
  totalProfit: number;
  machines: {
    machineId: string;
    machineName: string;
    profit: number;
    assignedDate: string;
    lastProfitUpdate: string;
  }[];
}


export interface TransactionResponse {
  transactions: Transaction[];
  totalPages: number;
  currentPage: number;
  totalTransactions: number;
}

 export interface UserMachineState {
  userMachines: UserMachine[];
  allUserMachines: UserMachine[];
  transactionData: {
    transactions: Transaction[];
    totalPages: number;
    currentPage: number;
    totalTransactions: number;
    
  };
  userProfit: UserProfitSummary | null;
  isLoading: boolean;
  error: string | null;
  
}
