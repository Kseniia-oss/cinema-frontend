import { configureStore } from '@reduxjs/toolkit'
import moviesReducer from '../features/movies/moviesSlice'
import authReducer from '../features/auth/authSlice'
import { readSession } from '../features/auth/auth.session'

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    auth: authReducer,
  },

  preloadedState: {
    auth: {
      session: readSession(),
    },
  },

  devTools: import.meta.env.DEV,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch