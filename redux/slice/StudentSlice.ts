import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/supabaseClient";
import { Student } from "@/types";

interface StudentState {
  students: Student[];
  total: number;
}

const initialState: StudentState = {
  students: [],
  total: 0,
};

// ✅ FETCH students
export const fetchStudents = createAsyncThunk<
  { data: Student[]; total: number },
  {
    page: number;
    limit: number;
    sortBy: keyof Student;
    order: "asc" | "desc";
  },
  { rejectValue: Error }
>(
  "students/fetch",
  async ({ page, limit, sortBy, order }, { rejectWithValue }) => {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from("students")
        .select("*", { count: "exact" })
        .range(from, to)
        .order(sortBy, { ascending: order === "asc" });

      if (error) return rejectWithValue(error);

      return { data: data as Student[], total: count || 0 };
    } catch (err) {
      return rejectWithValue(err as Error);
    }
  }
);

// ✅ ADD student
export const addStudent = createAsyncThunk<
  Student,
  Omit<Student, "id" | "created_at">,
  { rejectValue: Error }
>("students/add", async (studentData, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase
      .from("students")
      .insert([studentData])
      .select()
      .single();
    if (error) return rejectWithValue(error);
    return data as Student;
  } catch (err) {
    return rejectWithValue(err as Error);
  }
});

// ✅ UPDATE student
export const updateStudent = createAsyncThunk<
  Student,
  { id: string; updates: Partial<Student> },
  { rejectValue: Error }
>("students/update", async ({ id, updates }, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase
      .from("students")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) return rejectWithValue(error);
    return data as Student;
  } catch (err) {
    return rejectWithValue(err as Error);
  }
});

// ✅ DELETE student
export const deleteStudent = createAsyncThunk<
  string,
  string,
  { rejectValue: Error }
>("students/delete", async (id, { rejectWithValue }) => {
  try {
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) return rejectWithValue(error);
    return id;
  } catch (err) {
    return rejectWithValue(err as Error);
  }
});

const studentSlice = createSlice({
  name: "students",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // FETCH
    builder.addCase(fetchStudents.fulfilled, (state, action) => {
      state.students = action.payload.data;
      state.total = action.payload.total;
    });
  },
});

export default studentSlice.reducer;
