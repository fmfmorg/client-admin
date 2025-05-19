import { configureStore } from '@reduxjs/toolkit'
import pricingReducer from '@components/pricing/slice'
import purchaseQuantityReducer from '@components/purchase-quantity/slice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      pricingReducer,
      purchaseQuantityReducer,
    }
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']