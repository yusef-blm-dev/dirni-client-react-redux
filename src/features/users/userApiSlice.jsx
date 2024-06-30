import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { selectUserId } from "../auth/authSlice";

// Create the entity adapter
const usersAdapter = createEntityAdapter({});
const initialState = usersAdapter.getInitialState();

// Inject endpoints into the apiSlice
export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      validateStatus: (response, result) =>
        response.status === 200 && !result.isError,
      transformResponse: (responseData) => {
        // Assuming responseData is the single user object from the API
        const user = { ...responseData, id: responseData._id }; // Adjust id mapping if necessary
        return usersAdapter.upsertOne(initialState, user);
      },
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    addNewUser: builder.mutation({
      query: (initialUserData) => ({
        url: "/users",
        method: "POST",
        body: initialUserData,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    updateUser: builder.mutation({
      query: ({ id, userData }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: userData,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),
    updateUserAvatar: builder.mutation({
      query: (avatar) => ({
        url: `/image/upload`,
        method: "POST",
        body: avatar,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),
  }),
});

// Export hooks for the queries and mutations
export const {
  useGetUserByIdQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useUpdateUserAvatarMutation,
  useDeleteUserMutation,
} = usersApiSlice;

// Selectors
const selectUsersResult = createSelector(selectUserId, (userId) => {
  if (userId) {
    return usersApiSlice.endpoints.getUserById.select(userId);
  } else {
    return;
  }
});

const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult?.data ?? initialState
);

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors((state) => selectUsersData(state));

// Memoized selector for a single user by ID
export const selectUserByIdMemoized = (userId) =>
  createSelector(
    (state) => selectUserById(state, userId),
    (user) => user ?? initialState.entities[userId]
  );
