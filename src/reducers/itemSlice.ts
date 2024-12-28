import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Item {
  id: number;
  name: string;
  reason: string;
  status: string;
}

export interface ItemSliceStateProps {
  items: Item[];
  currentItem: Item | null;
  loading: boolean;
  error: string | null;
}

const initialState: ItemSliceStateProps = {
  items: [],
  currentItem: null,
  loading: false,
  error: null,
};

export const fetchItems = createAsyncThunk<Item[]>(
  "items/fetchItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/items`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching items"
      );
    }
  }
);

export const updateItem = createAsyncThunk<
  void,
  { ids: number[]; reason: string; status: string }
>("items/updateItem", async ({ ids, reason, status }, { rejectWithValue }) => {
  try {
    await axios.put(`${apiUrl}/items/update-many`, { ids, reason, status });
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Error updating items"
    );
  }
});

// Slice
const itemSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    setCurrentItem(state, action: PayloadAction<Item | null>) {
      state.currentItem = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateItem.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentItem } = itemSlice.actions;
export default itemSlice.reducer;
