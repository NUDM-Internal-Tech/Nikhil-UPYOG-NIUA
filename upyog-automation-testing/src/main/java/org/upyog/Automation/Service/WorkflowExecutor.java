package org.upyog.Automation.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.upyog.Automation.Reports.ExtentManager;
import org.upyog.Automation.Reports.ReportManager;
import org.upyog.Automation.Utils.WorkflowDataStore;
import org.upyog.Automation.config.*;
import org.upyog.Automation.model.WorkflowData;
import org.upyog.Automation.model.WorkflowStep;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class WorkflowExecutor {

    private static final Logger logger =
            LoggerFactory.getLogger(WorkflowExecutor.class);

    @Autowired
    private CitizenTestService citizenTestService;

    @Autowired
    private EmployeeTestService employeeTestService;

    @Autowired
    private VendorTestService vendorTestService;

    public void executeWorkflow(
            String workflowPath,
            String stakeholderPath,
            String citizenUrl
    ) {
        String employeeUrl =
                citizenUrl.replace(
                        "/citizen/login",
                        "/employee/login"
                );


        WorkflowData workflow =
                WorkflowConfigLoader.load(workflowPath);
        WorkflowDataStore.remove("APPLICATION_NO");

        logger.info(
                "APPLICATION_NO RESET"
        );

        ModuleData stakeholder =
                StakeholderConfigLoader.load(
                        stakeholderPath
                );
        logger.info(
                "NEW REPORT CREATED FOR = "
                        + workflow.getModuleName()
        );
        ExtentManager.reset();
        ReportManager.clearTest();

        logger.info(
                "AFTER RESET TEST = "
                        + ReportManager.getTest()
        );

        ReportManager.startTest(
                workflow.getModuleName(),
                workflow.getModuleName()
        );
        try {
            for (WorkflowStep step : workflow.getSteps()) {
                try {
                    logger.info(
                            "STEP TYPE = " + step.getType()
                    );

                    logger.info(
                            "STEP MODULE = " + step.getModule()
                    );

                    logger.info(
                            "STEP ROLE = " + step.getRole()
                    );

                    ReportManager.logFlow(
                            step.getName()
                    );

                    ReportManager.logStep(
                            "Executing : " + step.getModule()
                    );

                    logger.info(
                            "Executing : "
                                    + step.getModule()
                    );

                    if ("CITIZEN".equalsIgnoreCase(step.getType())) {
                        logger.info(
                                "CALLING CITIZEN SERVICE"
                        );

                        citizenTestService.runCitizenSideTest(
                                citizenUrl,
                                step.getModule(),
                                stakeholder.getCitizen().getMobile(),
                                stakeholder.getCitizen().getOtp(),
                                stakeholder.getCitizen().getCity(),
                                null
                        );
                    } else if ("EMPLOYEE".equalsIgnoreCase(step.getType())) {

                        EmployeeData employee =
                                stakeholder.getEmployeeByRole(
                                        step.getRole()
                                );

                        if (employee == null) {

                            throw new RuntimeException(
                                    "Role not found in stakeholder file : "
                                            + step.getRole()
                            );
                        }
                        logger.info(
                                "APPLICATION_NO = "
                                        + WorkflowDataStore.get("APPLICATION_NO")
                        );

                        String applicationNo =
                                WorkflowDataStore.get("APPLICATION_NO");

                        if (applicationNo == null ||
                                applicationNo.isBlank()) {

                            throw new RuntimeException(
                                    "APPLICATION_NO not found in WorkflowDataStore"
                            );

                        }
                        logger.info(
                                "CALLING EMPLOYEE SERVICE"
                        );

                        employeeTestService.runEmployeeTest(
                                employeeUrl,
                                step.getModule(),
                                employee.getUsername(),
                                employee.getPassword(),
                                applicationNo
                        );
                    }
                    else if ("VENDOR".equalsIgnoreCase(step.getType())) {

                        VendorData vendor = stakeholder.getVendor();

                        if (vendor == null) {
                            throw new RuntimeException("Vendor details not found");
                        }

                        String applicationNo =
                                WorkflowDataStore.get("APPLICATION_NO");

                        if (applicationNo == null || applicationNo.isBlank()) {
                            throw new RuntimeException(
                                    "APPLICATION_NO not found in WorkflowDataStore"
                            );
                        }

                        vendorTestService.runVendorTest(
                                citizenUrl,
                                step.getModule(),
                                vendor.getMobile(),
                                vendor.getOtp(),
                                vendor.getCity(),
                                applicationNo
                        );
                    }
                    ReportManager.logStep(
                            "PASSED : "
                                    + step.getModule()
                    );

                } catch (Exception e) {

                    ReportManager.logFailure(
                            "FAILED : "
                                    + step.getModule()
                                    + " | "
                                    + e.getMessage()
                    );

                    throw new RuntimeException(
                            "Workflow Failed at : "
                                    + step.getModule(),
                            e
                    );
                }
            }
        } finally {

            logger.info(
                    "ABOUT TO FLUSH = "
                            + workflow.getModuleName()
            );

            ReportManager.flush();

            logger.info(
                    "REPORT SAVED = "
                            + workflow.getModuleName()
            );

            ReportManager.clearTest();

            ExtentManager.reset();
        }
    }
}