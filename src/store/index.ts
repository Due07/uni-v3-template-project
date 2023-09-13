import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';

const store = createPinia();

store.use(createPersistedState({
  storage: {
    getItem (key: string) {
      return uni.getStorageSync(key);
    },
    setItem<T>(key: string, value: T) {
      uni.setStorageSync(key, value);
    },
  }
}));

export default store;
