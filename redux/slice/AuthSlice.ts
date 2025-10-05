import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "@/supabaseClient";
import { RoleType, UserStatus } from "@/enums";

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
};

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

  return data as UserDetailsResponsePops;
});

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserByAuthId.fulfilled, (state, action) => {
      const userDetails = action.payload;
      state.userDetails = {
        ...action.payload,
        role: userDetails?.roles?.name,
      };
    });
  },
});

export default authSlice.reducer;
