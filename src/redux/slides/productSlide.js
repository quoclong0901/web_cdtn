import { createSlice } from '@reduxjs/toolkit'
// import type { PayloadAction } from '@reduxjs/toolkit'


const initialState = {
  search: '',
  products: [],
}

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    searchProduct: (state, action) => {
      state.search = action.payload
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { searchProduct, setProducts } = productSlice.actions

export default productSlice.reducer