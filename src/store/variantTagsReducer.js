const initialState = {
  initialLoading: true,
  tags: []
};

export const FETCH_VARIANT_TAGS = "FETCH_VARIANT_TAGS";

export const actions = {
  fetchTags: payload => ({
    type: FETCH_VARIANT_TAGS,
    payload
  })
};

const actionHandler = {
  [FETCH_VARIANT_TAGS]: (state, action) => ({
    ...state,
    tags: action.payload,
    initialLoading: false
  })
};

const variantTagsReducer = (state = initialState, action) => {
  const handler = actionHandler[action.type];
  return handler ? handler(state, action) : state;
};

export default variantTagsReducer;
