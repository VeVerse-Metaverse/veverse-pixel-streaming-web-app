
import psStore from "../store/modules/ps";
import {PSLocalStorage} from "../store";

export const rehydrateStore = async () => {
  const psSavedState = await PSLocalStorage.restoreState(
    PSLocalStorage.key,
    PSLocalStorage.storage
  );

  psStore.restoreSavedState(psSavedState);
};
