import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Movie } from './movie.types'
import { demoMovies } from './movies.mock'

interface MoviesState {
  items: Movie[]
}

const initialState: MoviesState = {
  items: demoMovies.map((movie) => ({ ...movie })),
}

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    movieAdded(state, action: PayloadAction<Movie>) {
      state.items.push(action.payload)
    },

    movieUpdated(state, action: PayloadAction<Movie>) {
      const index = state.items.findIndex(
        (movie) => movie.id === action.payload.id,
      )

      if (index !== -1) {
        state.items[index] = action.payload
      }
    },

    movieDeleted(state, action: PayloadAction<number>) {
      state.items = state.items.filter(
        (movie) => movie.id !== action.payload,
      )
    },
  },
})

export const { movieAdded, movieUpdated, movieDeleted } =
  moviesSlice.actions

export default moviesSlice.reducer