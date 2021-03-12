
Instructions to run locally
---------------------------

1. Install dependencies
```sh
npm install
```

2. Build TypeScript package
```sh
npx tsc 
```

3. Run project
```sh
node ./dist/index.js 
```

Sample ingestion code
---------------------

```sh
export async function runIngest(){
    let ingestOptions = new IngestOptions();
    ingestOptions.batchSize = 20;
    ingestOptions.frequencyMillis = 3000;

    const metering = new Metering(apiKey, false, ingestOptions);    

    const dimensions = new Map<string, string>();
    dimensions.set("region", "Midwest");
    dimensions.set("tenant_type", "Tech");

    let j = 0;
    for(j=0; j<50; j++){
        let delay = new Promise(resolve => setTimeout(resolve, 100));
        await delay;
        metering.meter("TypeScript-ApiCalls", j + 1, Date.now(), "123", "Dell", dimensions);
        metering.meter("TypeScript-Bandwidth", j + 1, Date.now(), "123", "Dell", dimensions);
        metering.meter("TypeScript-Transactions", j + 1, Date.now(), "123", "Dell", dimensions);
        metering.meter("TypeScript-CPU", j + 1, Date.now(), "123", "Dell", dimensions);
    }

    //metering.flush();
    console.log('calling shutdown');
    metering.flush();
    metering.shutdown();    
}

runIngest()
```

Sample usage code
-----------------

```sh
export async function runUsage(){
    let payload = new UsagePayload();
    payload.meterId = 'cfe68e90-82bf-11eb-902f-f9afe0dc6e9e';
    payload.customerName = 'Dell';
    const client = new UsageClient(apiKey);    
    let result = await client.getUsage(payload);
    console.log(result);
}

runUsage()
```