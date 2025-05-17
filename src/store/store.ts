import { configureStore } from '@reduxjs/toolkit'
import purchaseQuantityReducer from '@components/purchase-quantity/purchaseQuantitySlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
        purchaseQuantityReducer,
    }
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']