import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "../../common/queryClientTemplate";

const usePropertySearchWithDue = ({ tenantId, filters, auth = true, configs }) => {
  const client = useQueryClient();

  const getOwnerNames = (propertyData) => {
    const getActiveOwners = propertyData?.owners?.filter(owner => owner?.active);
    const getOwnersList = getActiveOwners?.map(activeOwner => activeOwner?.name)?.join(",");
    return getOwnersList;
  };

  const defaultSelect = (data) => {
    if (!data || !Array.isArray(data.Properties)) {
      return { Properties: [], ConsumerCodes: [], FormattedData: {} };
    }
    let consumerCodes = [];
    let formattedData = {};
    data.Properties.forEach((property) => {
      if (!property) return;
      property.status == "ACTIVE" && consumerCodes.push(property.propertyId);
      property.units = property?.units?.filter((unit) => unit?.active) || [];
      property.owners = property?.owners?.filter((owner) =>
        (owner?.status === property?.status) === "INWORKFLOW" && property?.creationReason === "MUTATION" ? "INACTIVE" : "ACTIVE"
      ) || [];
      formattedData[property.propertyId] = {
        propertyId: property?.propertyId,
        name: property?.owners?.[0]?.name,
        status: property?.status,
        due: false,
        locality: property?.tenantId && property?.address?.locality?.code
          ? `${property.tenantId.replace(".", "_").toUpperCase()}_REVENUE_${property.address.locality.code}`
          : "",
        owners: property?.owners || [],
        documents: property?.documents || [],
        ownerNames: getOwnerNames(property)
      };
    });
    data["ConsumerCodes"] = consumerCodes;
    data["FormattedData"] = formattedData;
    return data;
  };

  const { isLoading, error, data, isSuccess: isPropertySuccess } = useQuery({
    ...configs,
    queryKey: ["propertySearchList", tenantId, filters, auth],
    queryFn: async () => {
      const response = await Digit.PTService.search({ tenantId, filters, auth });
      return response || { Properties: [] };
    },
    select: defaultSelect,
  });

  let consumerCodes = data?.ConsumerCodes?.join(",") || "";

  const { isLoading: billLoading, data: billData, isSuccess } = useQuery({
    ...configs,
    queryKey: ["propertySearchBillList", tenantId, filters, data, auth, consumerCodes],
    queryFn: async () => {
      if (!consumerCodes) {
        return { Bill: [] };
      }
      const response = await Digit.PTService.fetchPaymentDetails({ tenantId, consumerCodes, auth });
      return response || { Bill: [] };
    },
    enabled: (configs?.enabled ?? true) && !!data && !!consumerCodes,
    select: (billResp) => {
      if (!billResp || !billResp.Bill) {
        if (data) {
          data["Bill"] = {};
        }
        return billResp || { Bill: [] };
      }
      if (data) {
        data["Bill"] =
          billResp.Bill.reduce((curr, acc) => {
            if (!acc || !acc.consumerCode) return curr;
            curr[acc.consumerCode] = acc.totalAmount;
            if (data.FormattedData && data.FormattedData[acc.consumerCode]) {
              data.FormattedData[acc.consumerCode]["due"] = acc.totalAmount;
            }
            return curr;
          }, {}) || {};
      }
      return billResp;
    },
  });

  return {
    isLoading: isLoading || billLoading,
    error,
    data,
    billData,
    isSuccess: isPropertySuccess && (consumerCodes ? isSuccess : true),
    revalidate: () => {
      client.invalidateQueries({ queryKey: ["propertySearchBillList", tenantId, filters] });
      client.invalidateQueries({ queryKey: ["propertySearchList", tenantId, filters] });
    },
  };
};

export default usePropertySearchWithDue;

