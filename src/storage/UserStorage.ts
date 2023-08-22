import Toast from "react-native-root-toast";

import { UserCategory, UserData } from "../types/User";
import reduxStore, { RootState, userCategorySlice, userSlice } from "./reduxStore";
import Storage from "./Storage";
import storageKey from "./Storagekey";

type UserTokenData = {
  token: string;
  privKey: string;
};

class UserStorage {
  static async loadUserDataOnStartUp(): Promise<void> {
    const token = await this.getUserToken();
    const profile = await this.getUserProfile();
    const category = await this.getUserCategoryCurrent();

    reduxStore.dispatch(userSlice.actions.setProfile(profile));
    reduxStore.dispatch(userCategorySlice.actions.setUserCategory(category));
    reduxStore.dispatch(userSlice.actions.setToken(token));
  }

  static async getUserToken(): Promise<UserTokenData | null> {
    const token = await Storage.read<string>(storageKey.USER_TOKEN);
    const privKey = await Storage.read<string>(storageKey.USER_PRIVKEY);

    if (token && privKey) {
      return { token, privKey };
    }
    return null;
  }
  static async getUserProfile(): Promise<UserData | null> {
    return await Storage.read<UserData>(storageKey.USER_PROFILE);
  }
  static async getUserCategoryCurrent(): Promise<UserCategory | null> {
    return await Storage.read<UserCategory>(storageKey.USER_CATEGORY_MAJOR);
  }
  static async listUserCategory(): Promise<UserCategory[]> {
    const profile = await this.getUserProfile();
    if (profile) return profile.category;
    return [];
  }
  static async setUserToken(token: string, privKey: string): Promise<void> {
    await Storage.write(storageKey.USER_TOKEN, token);
    await Storage.write(storageKey.USER_PRIVKEY, privKey);

    reduxStore.dispatch(userSlice.actions.setToken({ token: token, privKey: privKey }));
  }
  static async setUserProfile(profile: UserData): Promise<void> {
    await Storage.write(storageKey.USER_PROFILE, profile);

    const savedCategory = await this.getUserCategoryCurrent();
    if (savedCategory === null || !profile.category.includes(savedCategory)) {
      if (profile.category.length === 0) return;
      // Toast.show("회원 정보에 계열·학과 정보가 존재하지 않습니다.");
      else await this.setUserCategoryCurrent(profile.category[0]);
    }

    reduxStore.dispatch(userSlice.actions.setProfile(profile));
  }
  static async setUserCategoryCurrent(category: UserCategory) {
    await Storage.write(storageKey.USER_CATEGORY_MAJOR, category);

    reduxStore.dispatch(userCategorySlice.actions.setUserCategory(category));
  }
  static async removeUserData(): Promise<void> {
    await Storage.remove(storageKey.USER_TOKEN);
    await Storage.remove(storageKey.USER_PRIVKEY);

    reduxStore.dispatch(userSlice.actions.clear());
  }

  static async isUserLoggedIn(): Promise<boolean> {
    return Storage.read<string>(storageKey.USER_TOKEN).then(token =>
      Promise.resolve(token !== null),
    );
  }

  static isUserDataLoadingSelector = (state: RootState) => state.user.token === undefined;
  static isUserLoggedInSelector = (state: RootState) => state.user.token !== null;
  static userProfileSelector = (state: RootState) => state.user.profile;
  static userCategorySelector = (state: RootState) => state.userCategory;
}

export { userSlice };
export default UserStorage;
