import {
  CREATE_POST,
  RETRIEVE_POSTS,
  UPDATE_POST,
  DELETE_POST,
  DELETE_ALL_POSTS,
  LIKE_POST,
} from "../actions/types";

const initialState = [];

function postReducer(posts = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_POST:
      return [...posts, payload];

    case RETRIEVE_POSTS:
      return payload;

    case UPDATE_POST:
      return posts.map((post) => {
        if (post.id === payload.id) {
          return {
            ...post,
            ...payload,
          };
        }
        return post;
      });

    case DELETE_POST:
      return posts.filter(({ id }) => id !== payload.id);

    case DELETE_ALL_POSTS:
      return [];

    case LIKE_POST:
      return posts.map((post) =>
        post.id === action.payload.id ? action.payload : post
      );

    default:
      return posts;
  }
}

export default postReducer;
