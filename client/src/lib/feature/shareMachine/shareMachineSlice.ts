// src/lib/features/shareMachine/shareMachineSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axiosInstance';
import { RootState } from '@/lib/store/store';

// Types
interface ShareMachine {
  _id: string;
  machineName: string;
  sharePrice: number;
  totalShares: number;
  availableShares: number;
  profitPerShare: number;
  hashrate: string;
  powerConsumption: number;
  description: string;
  images: string[];
  isShareBased: boolean;
  priceRange: number;
  coinsMined: string;
  monthlyProfit: number;
}

interface UserShare {
  id: string;
  machineName: string;
  numberOfShares: number;
  pricePerShare: number;
  profitPerShare: number;
  totalInvestment: number;
  expectedMonthlyProfit: number;
  purchaseDate: string;
  lastProfitUpdate: string;
  nextProfitUpdate: string;
}

interface SharePurchasePayload {
  userId: string;
  numberOfShares: number;
}

interface ShareSummary {
  shares: UserShare[];
  summary: {
    totalShares: number;
    totalInvestment: number;
    expectedMonthlyProfit: number;
  }
}

interface PurchaseResponse {
  success: boolean;
  message: string;
  data: {
    purchase: any;
    transaction: any;
    newBalance: number;
    expectedMonthlyProfit: number;
  }
}

// Async Thunks
export const getSpecialShareMachine = createAsyncThunk<
  { success: boolean; data: ShareMachine },
  void, 
  { state: RootState; rejectValue: string }
>('shareMachine/getSpecialMachine', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/api/v1/special-machine');
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch special share machine');
  }
});

export const getUserShareDetails = createAsyncThunk<
  { success: boolean; data: ShareSummary },
  string,
  { state: RootState; rejectValue: string }
>('shareMachine/getUserShareDetails', async (userId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/api/v1/user-shares/${userId}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch user shares');
  }
});

export const purchaseSpecialShares = createAsyncThunk<
  PurchaseResponse,
  SharePurchasePayload,
  { state: RootState; rejectValue: string }
>('shareMachine/purchaseShares', async (purchaseData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/api/v1/purchase', purchaseData);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to purchase shares');
  }
});

export const updateAllShareProfits = createAsyncThunk<
  { success: boolean; message: string; updatedCount: number; updates: any[] },
  void,
  { state: RootState; rejectValue: string }
>('shareMachine/updateAllProfits', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/api/v1/update-profits');
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update share profits');
  }
});

// Slice interface
interface ShareMachineState {
  specialMachine: ShareMachine | null;
  userShares: ShareSummary | null;
  loading: boolean;
  error: string | null;
  lastPurchase: PurchaseResponse | null;
  lastProfitUpdate: {
    timestamp: string | null;
    count: number;
    details: any[] | null;
  };
}

const initialState: ShareMachineState = {
  specialMachine: null,
  userShares: null,
  loading: false,
  error: null,
  lastPurchase: null,
  lastProfitUpdate: {
    timestamp: null,
    count: 0,
    details: null
  }
};

// Create the slice
const shareMachineSlice = createSlice({
  name: 'shareMachine',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearPurchaseData: (state) => {
      state.lastPurchase = null;
    }
  },
  extraReducers: (builder) => {
    // Get Special Share Machine
    builder.addCase(getSpecialShareMachine.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getSpecialShareMachine.fulfilled, (state, action) => {
      state.loading = false;
      state.specialMachine = action.payload.data;
    });
    builder.addCase(getSpecialShareMachine.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Get User Share Details
    builder.addCase(getUserShareDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getUserShareDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.userShares = action.payload.data;
    });
    builder.addCase(getUserShareDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Purchase Special Shares
    builder.addCase(purchaseSpecialShares.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(purchaseSpecialShares.fulfilled, (state, action) => {
      state.loading = false;
      state.lastPurchase = action.payload;
    });
    builder.addCase(purchaseSpecialShares.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update All Share Profits
    builder.addCase(updateAllShareProfits.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateAllShareProfits.fulfilled, (state, action) => {
      state.loading = false;
      state.lastProfitUpdate = {
        timestamp: new Date().toISOString(),
        count: action.payload.updatedCount,
        details: action.payload.updates
      };
    });
    builder.addCase(updateAllShareProfits.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  }
});

export const { clearErrors, clearPurchaseData } = shareMachineSlice.actions;
export default shareMachineSlice.reducer;