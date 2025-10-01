import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "@/supabaseClient";
import { RoleType, UserStatus } from "@/enums";
import { RoleData } from "@/types";

interface UserDetailsPops {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: UserStatus;
  role_id: string;
  role: RoleType;
}
interface UserDetailsResponsePops {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: UserStatus;
  role_id: string;
  roles: {
    name: RoleType;
    id: string;
  };
}

interface UserState {
  userDetails: UserDetailsPops;
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
  roles: RoleData[];
}

const initialState: UserState = {
  userDetails: {
    id: "",
    name: "",
    email: "",
    phone: "",
    status: UserStatus.WAITING,
    role_id: "",
    role: RoleType.ADMIN,
  },
  status: "idle",
  error: null,
  roles: [],
};

export const getAllRoles = createAsyncThunk<
  RoleData[],
  void,
  { rejectValue: string }
>("roles/getAll", async (_, { rejectWithValue }) => {
  const { data, error } = await supabase.from("roles").select("*");

  if (error) {
    return rejectWithValue(error.message);
  }

  return data as RoleData[];
});

export const getUserByAuthId = createAsyncThunk<
  UserDetailsResponsePops,
  string,
  { rejectValue: Error }
>("users/getByAuthId", async (authId, { rejectWithValue }) => {
  const { data, error } = await supabase
    .from("users")
    .select(
      `
      id,
      email,
      name,
      status,
      phone,
      role_id,
      roles (id, name)
    `
    )
    .eq("auth_id", authId)
    .single();

  if (error) return rejectWithValue(error);
  // if (!data) return rejectWithValue("No user found for this authId");

  return data as UserDetailsResponsePops;
});

export const getAllUsers = createAsyncThunk<
  UserDetailsPops[],
  string | undefined,
  { rejectValue: string }
>("users/getAll", async (roleName, { rejectWithValue }) => {
  let query = supabase.from("users").select(`
		*,
		roles (*)
	`);

  if (roleName) {
    query = query.eq("roles.name", roleName);
  }
  const { data, error } = await query;
  if (error) {
    return rejectWithValue(error.message);
  }
  return data as UserDetailsPops[];
});

export const addUser = createAsyncThunk<
  UserDetailsPops,
  Partial<UserDetailsPops>,
  { rejectValue: string }
>("users/add", async (newUser, { rejectWithValue }) => {
  const { data, error } = await supabase
    .from("users")
    .insert([newUser])
    .select("*, roles (*)")
    .single();

  if (error) {
    return rejectWithValue(error.message);
  }
  return data as UserDetailsPops;
});

export const updateUser = createAsyncThunk<
  UserDetailsPops,
  { id: string; updates: Partial<UserDetailsPops> },
  { rejectValue: string }
>("users/update", async ({ id, updates }, { rejectWithValue }) => {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", id)
    .select("*, roles (*)")
    .single();

  if (error) {
    return rejectWithValue(error.message);
  }
  return data as UserDetailsPops;
});

export const deleteUser = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("users/delete", async (id, { rejectWithValue }) => {
  const { error } = await supabase.from("users").delete().eq("id", id);
  if (error) {
    return rejectWithValue(error.message);
  }
  return id;
});

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllRoles.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllRoles.fulfilled, (state, action) => {
        state.status = "success";
        state.roles = action.payload;
      })
      .addCase(getAllRoles.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload as string;
      })
      .addCase(getUserByAuthId.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getUserByAuthId.fulfilled, (state, action) => {
        const userDetails = action.payload;
        state.status = "success";
        state.userDetails = {
          ...action.payload,
          role: userDetails?.roles?.name,
        };
      });
  },
});

export default authSlice.reducer;
