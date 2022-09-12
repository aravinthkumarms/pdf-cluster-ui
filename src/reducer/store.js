import { configureStore } from '@reduxjs/toolkit';
import imageReducer from './imageReducer';

export default configureStore({
    reducer: {
        image: imageReducer
    }
});
