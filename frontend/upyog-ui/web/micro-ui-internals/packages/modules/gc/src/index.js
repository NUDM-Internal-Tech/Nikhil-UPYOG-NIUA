import { GCComponents } from "./Module";

export const initGCComponents = () => {
  Object.entries(GCComponents).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};