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
}

interface UserShare {
  _id: string;
  machine: ShareMachine;
  numberOfShares: number;
  pricePerShare: number;
  profitPerShare: number;
  totalInvestment: number;
  purchaseDate: string;
  lastProfitUpdate: string;
  status: 'active' | 'inactive';
}

interface SharePurchasePayload {
  machineId: string;
  numberOfShares: number;
}

interface ShareSummary {
  totalInvestment: number;
  totalShares: number;
  totalMonthlyProfit: number;
  shares: UserShare[];
}

// Async Thunks
export const fetchAllShareMachines = createAsyncThunk<
  ShareMachine[],
  void,
  { state: RootState; rejectValue: string }
>('shareMachine/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/api/v1/share-machines');
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch share machines');
  }
});

export const getShareMachineDetails = createAsyncThunk<
  ShareMachine,
  string,
  { state: RootState; rejectValue: string }
>('shareMachine/getDetails', async (machineId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/api/v1/share-machines/${machineId}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch machine details');
  }
});

export const getUserShares = createAsyncThunk<
  ShareSummary,
  void,
  { state: RootState; rejectValue: string }
>('shareMachine/getUserShares', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/api/v1/my-shares');
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch user shares');
  }
});

export const purchaseShares = createAsyncThunk<
  UserShare,
  SharePurchasePayload,
  { state: RootState; rejectValue: string }
>('shareMachine/purchase', async (purchaseData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/api/v1/purchase-shares', purchaseData);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to purchase shares');
  }
});

export const createShareMachine = createAsyncThunk<
  ShareMachine,
  FormData,
  { state: RootState; rejectValue: string }
>('shareMachine/create', async (machineData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/api/v1/create-share-machine', machineData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create share machine');
  }
});

export const updateShareProfits = createAsyncThunk<
  { message: string; updates: any[] },
  string,
  { state: RootState; rejectValue: string }
>('shareMachine/updateProfits', async (machineId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/api/v1/update-profits/${machineId}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update share profits');
  }
});

// Slice interface
interface ShareMachineState {
  machines: ShareMachine[];
  selectedMachine: ShareMachine | null;
  userShares: ShareSummary | null;
  loading: boolean;
  error: string | null;
  lastProfitUpdate: string | null;
}

const initialState: ShareMachineState = {
  machines: [],
  selectedMachine: null,
  userShares: null,
  loading: false,
  error: null,
  lastProfitUpdate: null
};

// Slice
const shareMachineSlice = createSlice({
  name: 'shareMachine',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedMachine: (state) => {
      state.selectedMachine = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchAllShareMachines
      .addCase(fetchAllShareMachines.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllShareMachines.fulfilled, (state, action) => {
        state.loading = false;
        state.machines = action.payload;
        state.error = null;
      })
      .addCase(fetchAllShareMachines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch share machines';
      })
      // getShareMachineDetails
      .addCase(getShareMachineDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getShareMachineDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedMachine = action.payload;
        state.error = null;
      })
      .addCase(getShareMachineDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch machine details';
      })
      // getUserShares
      .addCase(getUserShares.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserShares.fulfilled, (state, action) => {
        state.loading = false;
        state.userShares = action.payload;
        state.error = null;
      })
      .addCase(getUserShares.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch user shares';
      })
      // purchaseShares
      .addCase(purchaseShares.pending, (state) => {
        state.loading = true;
      })
      .addCase(purchaseShares.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedMachine) {
          state.selectedMachine.availableShares -= action.payload.numberOfShares;
        }
        state.error = null;
      })
      .addCase(purchaseShares.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to purchase shares';
      })
      // updateShareProfits
      .addCase(updateShareProfits.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateShareProfits.fulfilled, (state, action) => {
        state.loading = false;
        state.lastProfitUpdate = new Date().toISOString();
        state.error = null;
      })
      .addCase(updateShareProfits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update share profits';
      });
  }
});

export const { clearError, clearSelectedMachine } = shareMachineSlice.actions;
export default shareMachineSlice.reducer;