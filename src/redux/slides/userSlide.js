import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  name: '',
  email: '',
  phone: '',
  address: '',
  avatar: '',
  access_token: '',
  _id: '',
  isAdmin: false
}

export const userSlide = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const {name='', email='', address= '', phone='', avatar='', access_token='',refresh_token='', _id='', isAdmin } = action.payload
      state.name = name;
      state.email = email;
      state.phone = phone;
      state.address = address;
      state.avatar = avatar;
      state.access_token = access_token;
      state.refresh_token = refresh_token;
      state.id = _id;
      state.isAdmin = isAdmin;
    },

    resetUser: (state) => {
      state.name = '';
      state.email =  '';
      state.phone =  '';
      state.address =  '';
      state.avatar =  '';
      state.access_token = '';
      state.refresh_token = '';
      state.id = '';
      state.isAdmin = false;
    },


  },
})

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlide.actions

export default userSlide.reducer