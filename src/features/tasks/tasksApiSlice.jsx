import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const tasksAdapter = createEntityAdapter({
  selectId: (task) => task.id, // Now using id instead of _id
});

const initialState = tasksAdapter.getInitialState();

export const tasksApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTasksByUserId: builder.query({
      query: ({ userId, query }) => `/tasks/user/${userId}${query}`,
      transformResponse: (responseData) => {
        const { tasks, taskCount } = responseData;
        const transformedData = tasks.map((task) => ({
          ...task,
          id: task._id, // Transform _id to id
        }));
        return {
          ...tasksAdapter.setAll(initialState, transformedData),
          taskCount,
        };
      },
      providesTags: (result, error, { userId }) => [
        { type: "Task", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Task", id })),
      ],
    }),
    getTaskById: builder.query({
      query: (id) => `/tasks/${id}`,
      transformResponse: (responseData) => {
        const task = {
          ...responseData,
          id: responseData._id, // Transform _id to id
        };
        return tasksAdapter.upsertOne(initialState, task);
      },
      providesTags: (result, error, id) => [{ type: "Task", id }],
    }),
    addTask: builder.mutation({
      query: (initialTask) => ({
        url: "/tasks/create",
        method: "POST",
        body: initialTask,
      }),
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),
    updateTask: builder.mutation({
      query: (initialTask) => ({
        url: `/tasks/${initialTask.id}`,
        method: "PATCH",
        body: initialTask,
      }),
      invalidatesTags: (result, error, initialTask) => [
        { type: "Task", id: initialTask.id },
      ],
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Task", id }],
    }),
  }),
});

const selectTasksResult = tasksApiSlice.endpoints.getTasksByUserId.select();

// Create memoized selectors
const selectTasksData = createSelector(
  selectTasksResult,
  (tasksResult) => tasksResult.data || initialState
);

export const { selectAll: selectAllTasks, selectById: selectTaskById } =
  tasksAdapter.getSelectors((state) => selectTasksData(state));

export const {
  useGetTasksByUserIdQuery,
  useAddTaskMutation,
  useGetTaskByIdQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = tasksApiSlice;
