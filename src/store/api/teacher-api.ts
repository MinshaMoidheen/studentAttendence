import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { BASE_URL, USERS_URL } from "@/constants/constants";
import type { Teacher, CreateTeacherRequest, UpdateTeacherRequest } from "@/types/teacher";

export const teacherApi = createApi({
  reducerPath: "teacherApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("content-type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Teacher"],
  endpoints: (builder) => ({
    // Get all teachers
    getTeachers: builder.query<Teacher[], void>({
      query: () => `${USERS_URL}/teachers`,
      providesTags: ["Teacher"],
    }),

    // Get teacher by ID
    getTeacherById: builder.query<Teacher, string>({
      query: (id) => `${USERS_URL}/teachers/${id}`,
      providesTags: (result, error, id) => [{ type: "Teacher", id }],
    }),

    // Create teacher
    createTeacher: builder.mutation<Teacher, CreateTeacherRequest>({
      query: (teacher) => ({
        url: `${USERS_URL}/teachers`,
        method: "POST",
        body: teacher,
      }),
      invalidatesTags: ["Teacher"],
    }),

    // Update teacher
    updateTeacher: builder.mutation<Teacher, UpdateTeacherRequest>({
      query: ({ id, ...teacher }) => ({
        url: `${USERS_URL}/teachers/${id}`,
        method: "PUT",
        body: teacher,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Teacher", id }],
    }),

    // Delete teacher
    deleteTeacher: builder.mutation<void, string>({
      query: (id) => ({
        url: `${USERS_URL}/teachers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Teacher"],
    }),
  }),
});

export const {
  useGetTeachersQuery,
  useGetTeacherByIdQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
} = teacherApi;
