const initialState = {
  initialLoading: true,
  tags: []
};

export const FETCH_VENDOR_TAGS = "FETCH_VENDOR_TAGS";

export const actions = {
  fetchTags: payload => ({
    type: FETCH_VENDOR_TAGS,
    payload
  })
};

const actionHandler = {
  [FETCH_VENDOR_TAGS]: (state, action) => ({
    ...state,
    tags: action.payload,
    initialLoading: false
  })
};

const vendorTagsReducer = (state = initialState, action) => {
  const handler = actionHandler[action.type];
  return handler ? handler(state, action) : state;
};

export default vendorTagsReducer;
