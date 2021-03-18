export const MISSING_CUSTOMER_ID = 'customerId is a required field';
export const MISSING_CUSTOMER_NAME = 'customerName is a required field';
export const MISSING_METER_NAME = 'meterName is a required field';
export const INVALID_UTC_TIME_MILLIS = 'utcTimeMillis is invalid, it should be milliseconds in UTC and not a timestamp in the future';
export const UTC_TIME_MILLIS_FROM_FUTURE = 'utcTimeMillis is invalid, future date not allowed';
export const MISSING_API_KEY = 'apiKey is a required field';
export const START_NOT_CALLED = 'metering.start() not called yet to start ingestion client';
export const CUSTOMER_DETAILS_API_ERROR = 'CustomerDetails API call failed';