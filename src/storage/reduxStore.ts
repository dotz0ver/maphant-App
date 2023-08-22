import { combineReducers, configureStore, createSlice } from "@reduxjs/toolkit";

import { UserCategory, UserData } from "../types/User";

type userStateType = {
  token: string | null | undefined;
  privKey: string | null | undefined;
  profile: UserData | null | undefined;
};
// type ChatState = {
//   room: { id: number; chatlist: string[] }[];
// };
// const defaultChatState: ChatState = {
//   room: [],
// };
const defaultUserState: userStateType = {
  token: undefined,
  privKey: undefined,
  profile: undefined,
};
const ChatSlice = createSlice({
  name: "roomname",
  // @ts-ignore
  initialState: {},
  reducers: {
    addChat: (state, action) => {
      const { chatid, content }: { chatid: number; content: string } = action.payload;

      const Chatroom = state[chatid];
      if (Chatroom == undefined) {
        state[chatid] = [];
      }
      state[chatid].push(content);
      return state;
    },
  },
});
const userSlice = createSlice({
  name: "user",
  initialState: defaultUserState,
  reducers: {
    setToken: (state, action) => {
      if (action.payload === null)
        return {
          token: null,
          privKey: null,
          profile: state.profile,
        };

      return {
        token: action.payload.token,
        privKey: action.payload.privKey,
        profile: state.profile,
      };
    },
    setProfile: (state, action) => {
      return {
        token: state.token,
        privKey: state.privKey,
        profile: action.payload,
      };
    },
    clear: state => {
      state.token = null;
      state.privKey = null;
      state.profile = null;

      return state;
    },
  },
});

const userCategorySlice = createSlice({
  name: "userCategory",
  initialState: null as UserCategory | null,
  reducers: {
    setUserCategory: (state, action) => {
      return action.payload as UserCategory;
    },
  },
});
const LoadingUISlice = createSlice({
  name: "LoadingUI",
  initialState: 0,
  reducers: {
    showLoading: state => (state += 1),
    hideLoading: state => (state -= 1),
  },
});

const rootReducer = combineReducers({
  user: userSlice.reducer,
  LoadingUI: LoadingUISlice.reducer,
  userCategory: userCategorySlice.reducer,
  ChatSlice: ChatSlice.reducer,
});
export type RootState = ReturnType<typeof rootReducer>;

export default configureStore({
  reducer: rootReducer,
});
export { ChatSlice, LoadingUISlice, userCategorySlice, userSlice };
