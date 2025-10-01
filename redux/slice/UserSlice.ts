import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/supabaseClient";
import { User } from "@/types";

interface UserState {
  users: User[];
  total: number;
}

const initialState: UserState = {
  users: [],
  total: 0,
};

// ✅ FETCH users
export const fetchUsers = createAsyncThunk<
  { data: User[]; total: number },
  {
    page: number;
    limit: number;
    sortBy: keyof User;
    order: "asc" | "desc";
    status: string;
  },
  { rejectValue: Error }
>(
  "users/fetch",
  async ({ page, limit, sortBy, order, status }, { rejectWithValue }) => {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let query = supabase
        .from("users")
        .select(
          `
          *,
          roles:role_id (
            id,
            name
          )
        `,
          { count: "exact" }
        )
        .range(from, to)
        .order(sortBy, { ascending: order === "asc" });

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error, count } = await query;

      if (error) return rejectWithValue(error);

      return { data: data as User[], total: count || 0 };
    } catch (error) {
      return rejectWithValue(error as Error);
    }
  }
);

// ✅ ADD user
export const addUser = createAsyncThunk<
  User,
  Omit<User, "id" | "created_at">,
  { rejectValue: Error }
>("users/add", async (UserData, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .insert([UserData])
      .select()
      .single();
    if (error) return rejectWithValue(error);
    return data as User;
  } catch (err) {
    return rejectWithValue(err as Error);
  }
});

// ✅ UPDATE user
export const updateUser = createAsyncThunk<
  User,
  { id: string; updates: Partial<User> },
  { rejectValue: Error }
>("users/update", async ({ id, updates }, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) return rejectWithValue(error);
    return data as User;
  } catch (err) {
    return rejectWithValue(err as Error);
  }
});

// ✅ DELETE user
export const deleteUser = createAsyncThunk<
  string,
  string,
  { rejectValue: Error }
>("users/delete", async (id, { rejectWithValue }) => {
  try {
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) return rejectWithValue(error);
    return id;
  } catch (err) {
    return rejectWithValue(err as Error);
  }
});

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // FETCH
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.users = action.payload.data;
      state.total = action.payload.total;
    });
  },
});

export default userSlice.reducer;
