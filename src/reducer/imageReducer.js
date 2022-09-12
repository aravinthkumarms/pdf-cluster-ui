import { createSlice } from '@reduxjs/toolkit';

const ImageList = createSlice({
    name: 'imageList',
    initialState: {
        imageList: [],
        data: [],
        pageOrder: [],
        fileName: ""
    }
    ,
    reducers: {
        updateVal(state, actions) {
            state.imageList = actions.payload
        },
        updateData(state, actions) {
            state.data = actions.payload
        },
        updatePageOrder(state, actions) {
            state.pageOrder = actions.payload
        },
        updateFileName(state, actions) {
            state.fileName = actions.payload
        }
    }
});

export const { updateVal, updateData, updatePageOrder, updateFileName } = ImageList.actions;

export default ImageList.reducer;