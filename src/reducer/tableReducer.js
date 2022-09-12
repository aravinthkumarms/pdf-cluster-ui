export const INITIAL_STATE = {
    open: false,
    vertical: 'top',
    horizontal: 'center',
    fetchSuccess: false,
    order: false,
    selected: [],
    page: 0,
    rowsPerPage: 5,
    imageList: [],
    apiData: [],
    tableErr: false,

};

export const tableReducer = (state, action) => {
    switch (action.type) {
        case "FETCH_IMAGE":
            return {
                ...state,
                imageList: action.payload
            };
        case "SNACK_BAR_OPEN":
            return {
                ...state,
                open: true,
                vertical: 'center',
                horizontal: 'center'
            };
        case "FETCH_SUCCESS":
            return {
                ...state,
                fetchSuccess: true,
                apiData: action.payload,
                vertical: 'center',
                horizontal: 'center'
            };
        case "SNACK_BAR_CLOSE":
            return {
                ...state,
                open: false,
                vertical: 'center',
                horizontal: 'center'
            };
        case "FETCH_SUCCESS_CLOSE":
            return {
                ...state,
                fetchSuccess: false,
                vertical: 'center',
                horizontal: 'center'
            };
        case "SELECTED_STATE":
            return {
                ...state,
                selected: action.payload
            };

        default:
            return state;
    }
};
