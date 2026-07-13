import React from "react";

import {
  Loader
} from "@nudmcdgnpm/digit-ui-react-components";

import {
  useTranslation
} from "react-i18next";

import {
  useQueryClient
} from "@tanstack/react-query";

import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  useMatch
} from "react-router-dom";


import CreatePropertyForm from "../../pageComponents/createForm";
import PTAcknowledgement from "../../pageComponents/PTAcknowledgement";



const NewApplication = () => {


  const queryClient = useQueryClient();


  const navigate = useNavigate();


  const location = useLocation();


  const stateId =
    Digit.ULBService.getStateId();


  const tenantId =
    Digit.ULBService.getCurrentTenantId();



  const [
    params,
    setParams,
    clearParams
  ] =
    Digit.Hooks.useSessionStorage(
      "PT_CREATE_PROPERTY",
      {}
    );




  const {
    data: commonFields,
    isLoading
  }
    =
    Digit.Hooks.pt.useMDMS(
      stateId,
      "PropertyTax",
      "CommonFieldsConfig"
    );




  const redirectUrl =
    new URLSearchParams(
      location.search
    )
      .get("redirectToUrl");




  const createProperty = () => {

    navigate(
      "acknowledgement"
    );

  };




  const onSuccess = () => {

    clearParams();

    queryClient.invalidateQueries({
      queryKey: [
        "PT_CREATE_PROPERTY"
      ]
    });

  };




  if (isLoading) {

    return <Loader />;

  }



  return (

    <Routes>


      <Route
        path="*"
        element={
          <CreatePropertyForm
            onSubmit={createProperty}
            value={params}
            redirectUrl={redirectUrl}
            userType="employee"
          />
        }
      />

      {/* <Route path={`save-property`} element={<SaveProperty onSuccess={onSuccess} redirectUrl={redirectUrl} userType={"employee"} />} /> */}

      <Route
        path="save-property"
        element={
          <PTAcknowledgement
            data={params}
            onSuccess={onSuccess}
            redirectUrl={redirectUrl}
            userType="employee"
          />
        }
      />


    </Routes>

  );

};


export default NewApplication;