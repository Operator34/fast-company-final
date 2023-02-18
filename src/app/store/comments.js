import { createSlice } from "@reduxjs/toolkit";
import commentService from "../services/comment.service";
import { nanoid } from "nanoid";
const commentsSlice = createSlice({
    name: "comments",
    initialState: { entities: null, isLoading: true, error: null },
    reducers: {
        commentsRequested: (state) => {
            state.isLoading = true;
        },
        commentsReceved: (state, action) => {
            state.entities = action.payload;
            state.isLoading = false;
        },
        commentsRequestFailed: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        commentRemoved: (state, action) => {
            state.entities = state.entities.filter(
                (c) => c._id !== action.payload
            );
            console.log(state.entities);
            state.isLoading = false;
        },
        commentsCreated: (state, action) => {
            state.entities.push(action.payload);
        }
    }
});

const { reducer: commentsReducer, actions } = commentsSlice;
export const {
    commentsReceved,
    commentsRequested,
    commentsRequestFailed,
    commentRemoved,
    commentsCreated
} = actions;

export const removedComment = (id) => async (dispatch) => {
    dispatch(commentsRequested());
    try {
        await commentService.removeComment(id);
        dispatch(commentRemoved(id));
    } catch (error) {
        dispatch(commentsRequestFailed(error.message));
    }
};
export const createdComment = (data) => async (dispatch) => {
    const comment = {
        ...data,
        _id: nanoid(),
        created_at: Date.now(),
        userId: data.currentUserId
    };
    try {
        const { content } = await commentService.createComment(comment);
        dispatch(commentsCreated(content));
    } catch (error) {
        dispatch(commentsRequestFailed(error.message));
    }
};

export const loadCommentsList = (userId) => async (dispatch) => {
    dispatch(commentsRequested());
    try {
        const { content } = await commentService.getComments(userId);
        dispatch(commentsReceved(content));
    } catch (error) {
        dispatch(commentsRequestFailed(error.message));
    }
};

export const getComments = () => (state) => state.comments.entities;
export const getCommentsLoadingStatus = () => (state) =>
    state.comments.isLoading;

export default commentsReducer;
