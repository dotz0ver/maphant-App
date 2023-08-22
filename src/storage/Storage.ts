import AsyncStorage from "@react-native-async-storage/async-storage";

import SecureStorage from "./SecureStorage";

type storabeTypes = string | boolean | number | object | Array<unknown>;

class Storage {
  async write(key: string, value: storabeTypes): Promise<void> {
    const val = JSON.stringify(value);

    if (key.startsWith("SECURE_STORAGE")) {
      return await SecureStorage.write(key, val);
    }

    await AsyncStorage.setItem(key, val);
  }
  async read<T extends storabeTypes>(key: string): Promise<T | null> {
    let value: string | null;

    if (key.startsWith("SECURE_STORAGE")) {
      value = await SecureStorage.read(key);
    } else {
      value = await AsyncStorage.getItem(key);
    }

    if (value === null) {
      return null;
    }

    return JSON.parse(value) as T;
  }
  async remove(key: string) {
    if (key.startsWith("SECURE_STORAGE")) {
      await SecureStorage.remove(key);
    }

    await AsyncStorage.removeItem(key);
  }
}

export default new Storage();
