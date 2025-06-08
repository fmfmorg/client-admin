import { configureStore } from '@reduxjs/toolkit'
import productsReducer from '@slices/products'

export const makeStore = () => {
  return configureStore({
    reducer: {
      productsReducer,
    }
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']