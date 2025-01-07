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
  transactionDate: Date | string; // Add string type to handle date strings
  type: 'withdrawal' | 'deposit'; // Changed from 'profit' to match your component
  status: 'completed' | 'pending' | 'failed'; // Add status field
  details?: string; // Make details optional
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
  selectedTransaction?: Transaction; // Optional: if you need to track selected transaction
  searchQuery?: string; // Optional: if you implement search
  statusFilter?: string; // Optional: if you implement filtering
}
export interface TransactionFilter {
  page?: number;
  limit?: number;
  status?: 'completed' | 'pending' | 'failed';
  type?: 'withdrawal' | 'deposit';
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
}