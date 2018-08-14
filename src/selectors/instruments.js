import { createSelector } from "reselect"

export default createSelector(
  state => state.data.instruments,
  instruments => instruments
)
