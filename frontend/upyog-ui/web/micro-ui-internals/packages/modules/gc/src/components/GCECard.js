import React from "react";
import { useTranslation } from "react-i18next";
import { EmployeeModuleCard, DeleteIcon } from "@nudmcdgnpm/digit-ui-react-components";

const GCECard = () => {
  const { t } = useTranslation();

  const links = [
    {
      label: t("ES_COMMON_INBOX"),
      link: `/upyog-ui/employee/gc/inbox`,
    }
  ];

  return (
    <EmployeeModuleCard
      Icon={<DeleteIcon className="fill-path-primary-main" />}
      moduleName={t("ACTION_TEST_GC")}
      links={links}
    />
  );
};

export default GCECard;