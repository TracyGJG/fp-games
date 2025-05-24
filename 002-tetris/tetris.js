let State;

export const initialState = (state) => {
  State = state;
  return State.make();
};

export const next = (state) => State.next(state);

export const enqueue = (state, action) =>
  action ? State[action](state) : state;
