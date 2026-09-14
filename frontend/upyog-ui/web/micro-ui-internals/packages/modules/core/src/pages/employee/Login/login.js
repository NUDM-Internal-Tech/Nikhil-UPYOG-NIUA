import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Dropdown, FormComposer, Loader, Toast, ConfigurableLoginPage } from "@nudmcdgnpm/digit-ui-react-components";
import employeeLoginConfig from "./employeeLoginConfig.json";
import { loginConfig } from "./config";

/* set employee details to enable backward compatible */
const setEmployeeDetail = (userObject, token) => {
  let locale = JSON.parse(sessionStorage.getItem("Digit.locale"))?.value || "en_IN";
  localStorage.setItem("Employee.tenant-id", userObject?.tenantId);
  localStorage.setItem("tenant-id", userObject?.tenantId);
  localStorage.setItem("citizen.userRequestObject", JSON.stringify(userObject));
  localStorage.setItem("locale", locale);
  localStorage.setItem("Employee.locale", locale);
  localStorage.setItem("token", token);
  localStorage.setItem("Employee.token", token);
  localStorage.setItem("user-info", JSON.stringify(userObject));
  localStorage.setItem("Employee.user-info", JSON.stringify(userObject));
};

const Login = ({ config: propsConfig, t, isDisabled }) => {
  const { data: cities, isLoading } = Digit.Hooks.useTenants();
  const { data: storeData, isLoading: isStoreLoading } = Digit.Hooks.useStore.getInitData();
  const { stateInfo } = storeData || {};
  const [user, setUser] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [disable, setDisable] = useState(false);

  const navigate = Digit.Hooks.useCustomNavigate();

  useEffect(() => {
    if (!user) {
      return;
    }
    Digit.SessionStorage.set("citizen.userRequestObject", user);
    const filteredRoles = user?.info?.roles?.filter((role) => role.tenantId === Digit.SessionStorage.get("Employee.tenantId"));
    if (user?.info?.roles?.length > 0) user.info.roles = filteredRoles;
    Digit.UserService.setUser(user);
    setEmployeeDetail(user?.info, user?.access_token);
    let redirectPath = "/upyog-ui/employee";

    /* logic to redirect back to same screen where we left off  */
    if (window?.location?.href?.includes("from=")) {
      redirectPath = decodeURIComponent(window?.location?.href?.split("from=")?.[1]) || "/upyog-ui/employee";
    }

    /* RAIN-6489 Logic to navigate to National DSS home incase user has only one role [NATADMIN] */
    if (user?.info?.roles && user?.info?.roles?.length > 0 && user?.info?.roles?.every((e) => e.code === "NATADMIN")) {
      redirectPath = "/upyog-ui/employee/dss/landing/NURT_DASHBOARD";
    }
    /* RAIN-6489 Logic to navigate to National DSS home incase user has only one role [STADMIN] */
    if (user?.info?.roles && user?.info?.roles?.length > 0 && user?.info?.roles?.every((e) => e.code === "STADMIN")) {
      redirectPath = "/upyog-ui/employee/dss/landing/home";
    }

    navigate(redirectPath, { replace: true });
  }, [user]);

  const onLogin = async (data) => {
    if (!data?.city) {
      setShowToast("Please Select City!");
      setTimeout(closeToast, 4000);
      return;
    }
    setDisable(true);
    const requestData = {
      ...data,
      userType: "EMPLOYEE",
    };
    requestData.tenantId = data.city.code;
    delete requestData.city;

    try {
      const { UserRequest: info, ...tokens } = await Digit.UserService.authenticate(requestData);
      Digit.SessionStorage.set("Employee.tenantId", info?.tenantId);
      setUser({ info, ...tokens });
    } catch (err) {
      setShowToast(err?.response?.data?.error_description || "Invalid login credentials!");
      setTimeout(closeToast, 5000);
    }
    setDisable(false);
  };

  const closeToast = () => {
    setShowToast(null);
  };

  const onForgotPassword = () => {
    sessionStorage.getItem("User") && sessionStorage.removeItem("User");
    navigate("/upyog-ui/employee/user/forgot-password");
  };

  const handleAction = (action, payload) => {
    if (action === "forgotPassword") {
      onForgotPassword();
    }
  };

  const activeConfig = propsConfig || loginConfig?.[0] || {};
  const [userId = { label: "CORE_LOGIN_USERNAME", type: "text", name: "username" }, password = { label: "CORE_LOGIN_PASSWORD", type: "password", name: "password" }, city = { label: "CORE_COMMON_CITY", type: "custom", name: "city" }] = activeConfig.inputs || [];

  const formComposerConfig = [
    {
      body: [
        {
          label: t(userId.label),
          type: userId.type,
          populators: {
            name: userId.name,
          },
          isMandatory: true,
        },
        {
          label: t(password.label),
          type: password.type,
          populators: {
            name: password.name,
          },
          isMandatory: true,
        },
        {
          label: t(city.label),
          type: city.type,
          populators: {
            name: city.name,
            component: ({ onChange, value }) => (
              <Dropdown
                option={cities}
                className="login-city-dd"
                optionKey="i18nKey"
                select={(d) => onChange(d)}
                value={value}
                t={t}
              />
            ),
          },
          isMandatory: true,
        },
      ],
    },
  ];

  const employeeFormSlot = (
    <FormComposer
      onSubmit={onLogin}
      isDisabled={isDisabled || disable}
      noBoxShadow
      inline
      submitInForm
      config={formComposerConfig}
      label={activeConfig.texts?.submitButtonLabel || "CORE_COMMON_CONTINUE"}
      secondaryActionLabel={activeConfig.texts?.secondaryButtonLabel || "CORE_COMMON_FORGOT_PASSWORD"}
      onSecondayActionClick={onForgotPassword}
      heading={activeConfig.texts?.header}
      headingStyle={{ textAlign: "center", display: "none" }}
      cardStyle={{ margin: "0", minWidth: "100%", width: "100%", background: "transparent", border: "none", boxShadow: "none", padding: 0 }}
      className="loginFormStyleEmployee w-full text-left"
      buttonStyle={{ maxWidth: "100%", width: "100%", marginTop: "8px", background: "var(--primary-main, #a82227)", borderRadius: "var(--border-radius-sm, 4px)" }}
    />
  );

  return isLoading || isStoreLoading ? (
    <Loader />
  ) : (
    <div className="w-full min-h-screen relative">
      <ConfigurableLoginPage
        pageConfig={employeeLoginConfig}
        slots={{
          employeeLoginForm: employeeFormSlot,
        }}
        t={t}
        onAction={handleAction}
      />
      {showToast && <Toast error={true} label={t(showToast)} onClose={closeToast} />}
    </div>
  );
};

Login.propTypes = {
  config: PropTypes.any,
  t: PropTypes.func,
  isDisabled: PropTypes.bool,
};

Login.defaultProps = {
  config: null,
  t: (s) => s,
  isDisabled: false,
};

export default Login;
