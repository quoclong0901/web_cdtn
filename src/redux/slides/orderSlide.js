import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    orderItems: [
        // {
        //     name: { type: String, required: true },
        //     amount: { type: Number, required: true },
        //     image: { type: String, required: true },
        //     price: { type: Number, required: true },
        //     product: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Product',
        //     required: true,
        //     },
        // },
    ],

    orderItemsSelected: [],

    shippingAddress: {
        // fullName: { type: String, required: true },
        // address: { type: String, required: true },
        // city: { type: String, required: true },
        // phone: { type: Number, required: true }
    },
    paymentMethod: '',
    itemsPrice: 0 ,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
    user: '',
    isPaid: false,
    paidAt: '',
    isDelivered: false,
    deliveredAt: '',
}

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrderProduct: (state, action) => {
      const { orderItem } = action.payload
      const itemOrder = state?.orderItems?.find((item) => item?.product === orderItem.product)
      if(itemOrder) {
        itemOrder.amount += orderItem?.amount
      } else {
        state?.orderItems.push(orderItem)
      }
    },

    increaseAmount: (state, action) => {
      const { idProduct } = action.payload
      const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct);
      const itemOrderSelected = state?.orderItemsSelected?.find((item) => item?.product === idProduct);

      if (itemOrder) itemOrder.amount++;
      if (itemOrderSelected)  {
        itemOrderSelected.amount++;
      }
    },

    decreaseAmount: (state, action) => {
      const { idProduct } = action.payload;
      const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct);
      const itemOrderSelected = state?.orderItemsSelected?.find((item) => item?.product === idProduct);

      if (itemOrder && itemOrder.amount > 1) itemOrder.amount--;
      if (itemOrderSelected && itemOrderSelected.amount > 1) {
        itemOrderSelected.amount--;
      }
    },

    removeOrderProduct: (state, action) => {
      const { idProduct } = action.payload
      const itemOrder = state?.orderItems?.filter((item) => item?.product !== idProduct);   
      const itemOrderSelected = state?.orderItemsSelected?.filter((item) => item?.product !== idProduct);   

      state.orderItems = itemOrder;
      state.orderItemsSelected = itemOrderSelected;
    },

    removeAllOrderProduct: (state, action) => {
      const { listChecked } = action.payload
      const itemOrders = state?.orderItems?.filter((item) => !listChecked.includes(item.product)) 
      const itemOrdersSelected = state?.orderItemsSelected?.filter((item) => !listChecked.includes(item.product)) 

      state.orderItems = itemOrders
      state.orderItemsSelected = itemOrdersSelected
    },

    selectedOrder: (state, action) => {
      const {listChecked} = action.payload

      const orderSelected = []
      state.orderItems.forEach((order) => {
        if(listChecked.includes(order.product)) {
          orderSelected.push(order)
        }
      });

      state.orderItemsSelected = orderSelected
    }
  },
})

// Action creators are generated for each case reducer function
export const { addOrderProduct, increaseAmount, decreaseAmount, removeOrderProduct, removeAllOrderProduct, selectedOrder } = orderSlice.actions

export default orderSlice.reducer