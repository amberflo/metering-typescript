# amberflo-metering-typescript

<p>
    <a href="https://github.com/amberflo/metering-typescript/actions">
        <img alt="CI Status" src="https://github.com/amberflo/metering-typescript/actions/workflows/tests.yml/badge.svg?branch=master">
    </a>
    <a href="https://www.npmjs.com/package/amberflo-metering-typescript">
        <img alt="NPM version" src="https://img.shields.io/npm/v/amberflo-metering-typescript.svg">
    </a>
</p>

[Amberflo](https://amberflo.io) is the simplest way to integrate metering into your application.

This is the official TypeScript client that wraps the [Amberflo REST API](https://docs.amberflo.io/docs).

## :heavy_check_mark: Features

- Add and update customers
- Assign and update product plans to customers
- List invoices of a customer
- Get a new customer portal session for a customer
- Add and list prepaid orders to customers
- Send meter events in asynchronous batches for high throughput (with optional flush on demand)
- Query usage

## :rocket: Quick Start

1. [Sign up for free](https://ui.amberflo.io/) and get an API key.

2. Install the SDK

```
npm install --save amberflo-metering-typescript
```

3. Create a customer

```typescript
import { CustomerDetailsClient, CustomerDetailsApiPayload } from "amberflo-metering-typescript";

// 1. Define some properties for this customer
const customerId = '123';
const customerName = 'Dell';
const traits = new Map<string, string>();
traits.set("customerType", "Tech");

// 2. Initialize metering client
const client = new CustomerDetailsClient(apiKey, debug);

// 3. Create or update the customer
const payload = new CustomerDetailsApiPayload(customerId, customerName, traits);
const createInStripe = true;
const customer = await client.add(payload, createInStripe);
```

4. Ingest meter events

```typescript
import { IngestOptions, Metering, FlushMode } from "amberflo-metering-typescript";

// 1. Instantiate metering client
const ingestOptions = new IngestOptions();
ingestOptions.flushMode = FlushMode.auto;
ingestOptions.batchSize = 20;
ingestOptions.frequencyMillis = 3000;

const metering = new Metering('my-api-key', false, ingestOptions);

// 2. Initialize and start the ingestion client
metering.start();

// Optional: Define dimesions for your meters
const dimensions = new Map<string, string>();
dimensions.set("region", "Midwest");
dimensions.set("customerType", "Tech");

// 3. Queue meter messages for ingestion.
metering.meter("TypeScript-ApiCalls", j + 1, Date.now(), "123", dimensions);

// 4. Perform graceful shutdown, flush, stop the timer
await metering.shutdown();
```

5. Query usage

```typescript
import {
    AggregationInterval, AggregationType, TimeRange, UsageApiPayload, UsageClient,
} from "amberflo-metering-typescript";

// 1. Initialize the usage client
const client = new UsageClient(apiKey, debug);

// 2. Define a time range
const startTimeInSeconds = Math.ceil((new Date().getTime() - 24 * 60 * 60 * 1000) / 1000);  // two days ago
const timeRange = new TimeRange(startTimeInSeconds);

// 3. Get overall usage report of a meter
const payload = new UsageApiPayload(
    'TypeScript-ApiCalls',
    AggregationType.sum,
    AggregationInterval.day,
    timeRange,
);
const result = await client.getUsage(payload);
```

## :zap: High throughput ingestion

Amberflo.io libraries are built to support high throughput environments. That
means you can safely send hundreds of meter records per second. For example,
you can chose to deploy it on a web server that is serving hundreds of requests
per second.

However, every call does not result in a HTTP request, but is queued in memory
instead. Messages are batched and flushed in the background, allowing for much
faster operation. The size of batch and rate of flush can be customized.

**Automatic flush:** When operating with auto flush mode, which is the default,
the messages will accumulate in the queue until either the batch size is
reached or some period of time elapses. When either happens, the batch is sent.

**Flush on demand:** For example, at the end of your program, you'll want to
flush to make sure there's nothing left in the queue. Calling this method will
block the calling thread until there are no messages left in the queue. So,
you'll want to use it as part of your cleanup scripts and avoid using it as
part of the request lifecycle.

## :book: Documentation

General documentation on how to use Amberflo is available at [Product Walkthrough](https://docs.amberflo.io/docs/product-walkthrough).

The full REST API documentation is available at [API Reference](https://docs.amberflo.io/reference).

## :scroll: Samples

Code samples covering different scenarios are available in the [TypeScript samples](https://github.com/amberflo/metering-typescript-samples) repository.

## :bookmark_tabs: Reference

### API Clients

#### [Ingest](https://docs.amberflo.io/reference/post_ingest)

```typescript
import { IngestOptions, Metering, FlushMode } from "amberflo-metering-typescript";
```

#### [Customer](https://docs.amberflo.io/reference/post_customers)

```typescript
import { CustomerDetailsClient, CustomerDetailsApiPayload } from "amberflo-metering-typescript";
```

#### [Usage](https://docs.amberflo.io/reference/post_usage)

```typescript
import {
    AggregationInterval,
    AggregationType,
    AllUsageApiPayload,
    AllUsageGroupBy,
    TimeRange,
    UsageApiPayload,
    UsageClient,
} from "amberflo-metering-typescript";
```

#### [Customer Portal Session](https://docs.amberflo.io/reference/post_session)

```typescript
import {
    CustomerPortalSessionClient,
    CustomerPortalSessionApiPayload
} from "amberflo-metering-typescript"
```

#### [Customer Prepaid Order](https://docs.amberflo.io/reference/post_payments-pricing-amberflo-customer-prepaid)

```typescript
import {
    CustomerPrepaidOrderClient,
    CustomerPrepaidOrderApiPayload,
    BillingPeriod,
    BillingPeriodInterval,
} from "amberflo-metering-typescript";
```

#### [Customer Product Invoice](https://docs.amberflo.io/reference/get_payments-billing-customer-product-invoice)

```typescript
import {
    AllInvoicesQuery,
    LatestInvoiceQuery,
    InvoiceQuery,
    CustomerProductInvoiceClient,
} from "amberflo-metering-typescript";
```

#### [Customer Product Plan](https://docs.amberflo.io/reference/post_payments-pricing-amberflo-customer-pricing)

```typescript
import {
    CustomerProductPlanClient,
    CustomerProductPlanApiPayload,
} from "amberflo-metering-typescript";
```
