import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AuthResponse } from './auth.types'

interface AuthState {
  session: AuthResponse | null
}

const initialState: AuthState = {
  session: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    sessionStarted(state, action: PayloadAction<AuthResponse>) {
      state.session = action.payload
    },

    sessionEnded(state) {
      state.session = null
    },
  },
})

export const { sessionStarted, sessionEnded } = authSlice.actions
export default authSlice.reducer