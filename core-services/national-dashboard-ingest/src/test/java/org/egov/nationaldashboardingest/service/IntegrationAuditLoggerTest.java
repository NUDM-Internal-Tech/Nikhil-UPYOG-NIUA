package org.egov.nationaldashboardingest.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.nationaldashboardingest.config.ApplicationProperties;
import org.egov.nationaldashboardingest.producer.Producer;
import org.egov.nationaldashboardingest.utils.IntegrationAuditConstants;
import org.egov.nationaldashboardingest.web.models.IntegrationRequestEventWrapper;
import org.egov.nationaldashboardingest.web.models.ExternalApiResponseEventWrapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.HttpClientErrorException;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class IntegrationAuditLoggerTest {

    @Mock
    private Producer producer;

    @Mock
    private ApplicationProperties applicationProperties;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private ExternalApiAuditLogger integrationAuditLogger;

    @BeforeEach
    void setUp() throws Exception {
        when(applicationProperties.getIntegrationRequestInitiatedTopic()).thenReturn("integration-request-initiated");
        when(applicationProperties.getIntegrationResponseReceivedTopic()).thenReturn("integration-response-received");
        when(applicationProperties.getIntegrationAuditMaxPayloadBytes()).thenReturn(204800);
        when(objectMapper.writeValueAsBytes(any())).thenAnswer(invocation -> "{\"payload\":\"test\"}".getBytes());
    }

    @Test
    void logInboundApi_shouldPublishMatchingCorrelationIdsOnSuccess() {
        ArgumentCaptor<Object> eventCaptor = ArgumentCaptor.forClass(Object.class);

        ResponseEntity<String> response = integrationAuditLogger.logInboundApi(
                "1a54beda-1b3f-42b1-830a-c7a9d83ed46e",
                "pb",
                IntegrationAuditConstants.API_NATIONAL_DASHBOARD_METRIC_INGEST,
                Map.of("request", "payload"),
                () -> ResponseEntity.ok("success"));

        verify(producer, times(2)).push(any(), eventCaptor.capture());
        IntegrationRequestEventWrapper requestWrapper = (IntegrationRequestEventWrapper) eventCaptor.getAllValues().get(0);
        ExternalApiResponseEventWrapper responseWrapper = (ExternalApiResponseEventWrapper) eventCaptor.getAllValues().get(1);

        assertEquals("pb", requestWrapper.getIntegrationRequest().getTenantId());
        assertEquals("1a54beda-1b3f-42b1-830a-c7a9d83ed46e",
                requestWrapper.getIntegrationRequest().getCorrelationId());
        assertEquals(IntegrationAuditConstants.API_NATIONAL_DASHBOARD_METRIC_INGEST,
                requestWrapper.getIntegrationRequest().getExternalApiName());
        assertEquals(IntegrationAuditConstants.DIRECTION_INBOUND,
                requestWrapper.getIntegrationRequest().getDirection());
        assertEquals(requestWrapper.getIntegrationRequest().getCorrelationId(),
                responseWrapper.getApiResponseEvent().getCorrelationId());
        assertEquals(IntegrationAuditConstants.STATUS_SUCCESS, responseWrapper.getApiResponseEvent().getStatus());
        assertEquals(HttpStatus.OK.value(), responseWrapper.getApiResponseEvent().getHttpStatusCode());
        assertNotNull(responseWrapper.getApiResponseEvent().getDurationMs());
        assertEquals("success", response.getBody());
    }

    @Test
    void logInboundApi_shouldPublishFailureResponseAndRethrowException() {
        ArgumentCaptor<Object> eventCaptor = ArgumentCaptor.forClass(Object.class);
        HttpClientErrorException exception = HttpClientErrorException.create(
                HttpStatus.BAD_REQUEST,
                "Bad Request",
                null,
                "invalid request".getBytes(),
                null);

        RuntimeException thrown = assertThrows(RuntimeException.class, () -> integrationAuditLogger.logInboundApi(
                "1a54beda-1b3f-42b1-830a-c7a9d83ed46e",
                "pb",
                IntegrationAuditConstants.API_NATIONAL_DASHBOARD_METRIC_INGEST,
                Map.of("uri", "http://localhost:8280/national-dashboard/metric/_ingest"),
                () -> {
                    throw exception;
                }));

        assertEquals(exception, thrown);
        verify(producer, times(2)).push(any(), eventCaptor.capture());
        IntegrationRequestEventWrapper requestWrapper = (IntegrationRequestEventWrapper) eventCaptor.getAllValues().get(0);
        ExternalApiResponseEventWrapper responseWrapper = (ExternalApiResponseEventWrapper) eventCaptor.getAllValues().get(1);

        assertEquals(requestWrapper.getIntegrationRequest().getCorrelationId(),
                responseWrapper.getApiResponseEvent().getCorrelationId());
        assertEquals(IntegrationAuditConstants.STATUS_FAILED, responseWrapper.getApiResponseEvent().getStatus());
        assertEquals(HttpStatus.BAD_REQUEST.value(), responseWrapper.getApiResponseEvent().getHttpStatusCode());
        assertNotNull(responseWrapper.getApiResponseEvent().getErrorDetails());
        assertEquals(IntegrationAuditConstants.ERROR_TYPE_CLIENT,
                responseWrapper.getApiResponseEvent().getErrorDetails().getErrorType());
        verify(producer).push(eq("integration-request-initiated"), any());
        verify(producer).push(eq("integration-response-received"), any());
    }
}
