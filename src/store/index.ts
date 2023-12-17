import {createStore, Store} from 'vuex';
import VuexPersist from 'vuex-persist';
import { InjectionKey  } from "vue";

const getDefaultState = () => {
  return {}
}

export const PSLocalStorage = new VuexPersist({
  key: 'ps',
  storage: window.localStorage,
  reducer: (state: any) => {
    const { ps } = state;

    return {
      appId: ps.appId,
      sessionId: ps.sessionId
    };
  }
})

export interface State {
}

export const key: InjectionKey<Store<State>> = Symbol()
export default createStore<State>({
  state: getDefaultState,
  mutations: {},
  actions: {},
  modules: {},
  plugins: [PSLocalStorage.plugin]
});
