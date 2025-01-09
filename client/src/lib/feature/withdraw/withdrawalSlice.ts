// features/withdrawalSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axiosInstance';
import { RootState } from '@/lib/store/store';

import { WithdrawalState ,  Withdrawal,
  WithdrawalRequest,
  WithdrawalResponse,
  WithdrawalListResponse,
  WithdrawalStats,
  ProcessWithdrawalPayload, 
  FetchAllWithdrawalsParams} from '@/types/withdrawals';


  
  export const requestWithdrawal = createAsyncThunk<
    WithdrawalResponse,
    WithdrawalRequest,
    { rejectValue: string }
  >(
    'withdrawal/request',
    async (withdrawalData, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.post<WithdrawalResponse>(
          '/api/v1/withdrawals/request',
          withdrawalData
        );
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to request withdrawal');
      }
    }
  );
  
  export const processWithdrawalRequest = createAsyncThunk<
    WithdrawalResponse,
    ProcessWithdrawalPayload,
    { rejectValue: string }
  >(
    'withdrawal/process',
    async (processData, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.post<WithdrawalResponse>(
          '/api/v1/withdrawals/process',
          processData
        );
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to process withdrawal');
      }
    }
  );
  
  export const fetchPendingWithdrawals = createAsyncThunk<
    WithdrawalListResponse,
    { page?: number; limit?: number },
    { rejectValue: string }
  >(
    'withdrawal/fetchPending',
    async ({ page = 1, limit = 20 }, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get<WithdrawalListResponse>(
          '/api/v1/withdrawals/pending',
          { params: { page, limit } }
        );
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch pending withdrawals');
      }
    }
  );
  
  export const fetchUserWithdrawals = createAsyncThunk<
  WithdrawalListResponse,
  { email: string; page?: number; limit?: number },  // Change userId to email
  { rejectValue: string }
>(
  'withdrawal/fetchUserWithdrawals',
  async ({ email, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<WithdrawalListResponse>(
        `/api/v1/withdrawals/by-email`, // Change endpoint
        { 
          params: { 
            email,  // Pass email as query parameter
            page, 
            limit 
          } 
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user withdrawals');
    }
  }
);
  
  export const fetchWithdrawalStats = createAsyncThunk<
    WithdrawalStats,
    void,
    { rejectValue: string }
  >(
    'withdrawal/fetchStats',
    async (_, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get<WithdrawalStats>(
          '/api/v1/withdrawals/stats'
        );
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch withdrawal statistics');
      }
    }
  );

  export const fetchAllWithdrawals = createAsyncThunk<
  WithdrawalListResponse,
  FetchAllWithdrawalsParams,
  { rejectValue: string }
>(
  'withdrawal/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<WithdrawalListResponse>(
        '/api/v1/withdrawals/all',
        { params }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch all withdrawals'
      );
    }
  }
);




const initialState: WithdrawalState = {
  withdrawals: [],
  pendingWithdrawals: [],
  allWithdrawals: [], // Add this line

  stats: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalWithdrawals: 0
  },
  isLoading: false,
  error: null
};

// Slice
const withdrawalSlice = createSlice({
  name: 'withdrawal',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetWithdrawalState: () => initialState
  },
  extraReducers: (builder) => {
    // Request Withdrawal
    builder.addCase(requestWithdrawal.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(requestWithdrawal.fulfilled, (state, action) => {
      state.isLoading = false;
      state.withdrawals.unshift(action.payload.transaction);
    });
    builder.addCase(requestWithdrawal.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to request withdrawal';
    });

    // Process Withdrawal
    builder.addCase(processWithdrawalRequest.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(processWithdrawalRequest.fulfilled, (state, action) => {
      state.isLoading = false;
      // Update both withdrawals and pending withdrawals lists
      const updatedWithdrawal = action.payload.transaction;
      state.withdrawals = state.withdrawals.map(w => 
        w._id === updatedWithdrawal._id ? updatedWithdrawal : w
      );
      state.pendingWithdrawals = state.pendingWithdrawals.filter(w => 
        w._id !== updatedWithdrawal._id
      );
    });
    builder.addCase(processWithdrawalRequest.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to process withdrawal';
    });

    // Fetch Pending Withdrawals
    builder.addCase(fetchPendingWithdrawals.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchPendingWithdrawals.fulfilled, (state, action) => {
      state.isLoading = false;
      state.pendingWithdrawals = action.payload.withdrawals;
      state.pagination = {
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
        totalWithdrawals: action.payload.totalWithdrawals
      };
    });
    builder.addCase(fetchPendingWithdrawals.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch pending withdrawals';
    });

    // Fetch User Withdrawals
    builder.addCase(fetchUserWithdrawals.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchUserWithdrawals.fulfilled, (state, action) => {
      state.isLoading = false;
      state.withdrawals = action.payload.withdrawals;
      state.pagination = {
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
        totalWithdrawals: action.payload.totalWithdrawals
      };
    });
    builder.addCase(fetchUserWithdrawals.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch user withdrawals';
    });

    // Fetch Withdrawal Stats
    builder.addCase(fetchWithdrawalStats.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchWithdrawalStats.fulfilled, (state, action) => {
      state.isLoading = false;
      state.stats = action.payload;
    });
    builder.addCase(fetchWithdrawalStats.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch withdrawal statistics';
    });
  }
});

export const { clearError, resetWithdrawalState } = withdrawalSlice.actions;
export default withdrawalSlice.reducer;