import React, { useEffect } from "react";
import { Loader } from "@nudmcdgnpm/digit-ui-react-components";

const LanguageSelection = () => {
  const navigate = Digit.Hooks.useCustomNavigate();
  const { data: { stateInfo } = {}, isLoading } = Digit.Hooks.useStore.getInitData();
  const selectedLanguage = Digit.StoreData.getCurrentLanguage();

  useEffect(() => {
    if (!isLoading && stateInfo) {
      // Skip language screen: use existing selected language or fallback to English, then go to login
      const targetLanguage = selectedLanguage || "en_IN";
      Digit.LocalizationService.changeLanguage(targetLanguage, stateInfo.code);
      navigate(`/upyog-ui/citizen/login`);
    }
  }, [isLoading, stateInfo]);

  return <Loader />;
};

export default LanguageSelection;
