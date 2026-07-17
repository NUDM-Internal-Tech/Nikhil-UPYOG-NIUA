import { queryTemplate } from "../common/queryTemplate";
// import mergeConfig from "../../config/mergeConfig";
import { StoreService } from "../services/molecules/Store/service";

export const useStore = ({ stateCode, moduleCode, language }) => {
  return queryTemplate({ queryKey: ["store", stateCode, moduleCode, language], queryFn: () => StoreService.defaultData(stateCode, moduleCode, language) });
};

export const useInitStore = (stateCode, enabledModules) => {
  const { isPending, error, isError, data } = queryTemplate({
    queryKey: ["initStore", stateCode, enabledModules],
    queryFn: () => StoreService.digitInitData(stateCode, enabledModules),
    config: { staleTime: Infinity },
  });

  if (data) {
    StoreService.setInitData(data);
  }

  return { isLoading: isPending, error, isError, data };
};
