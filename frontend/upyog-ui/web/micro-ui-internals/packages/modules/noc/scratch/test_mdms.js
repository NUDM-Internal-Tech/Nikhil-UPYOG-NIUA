const http = require('http');

const body = JSON.stringify({
  RequestInfo: {
    apiId: "org.egov.pt",
    ver: "1.0",
    ts: 1,
    action: "asd",
    did: "1",
    key: "abcd",
    msgId: "20170310130900|en_IN",
    authToken: ""
  },
  MdmsCriteria: {
    tenantId: "pg",
    moduleDetails: [
      {
        moduleName: "firenoc",
        masterDetails: [
          { name: "BuildingType" },
          { name: "FireStations" }
        ]
      },
      {
        moduleName: "common-masters",
        masterDetails: [
          { name: "OwnerShipCategory" },
          { name: "OwnerType" }
        ]
      }
    ]
  }
});

const queryMdms = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/egov-mdms-service/v1/_search`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => { responseBody += chunk; });
      res.on('end', () => {
        try {
          if (res.statusCode >= 400) {
            reject(new Error(`Status ${res.statusCode}: ${responseBody}`));
          } else {
            resolve(JSON.parse(responseBody));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(body);
    req.end();
  });
};

async function run() {
  try {
    console.log("Fetching MDMS criteria from UAT environment...");
    const res = await queryMdms();
    const mdmsData = res.MdmsRes || {};
    
    console.log("\n1. --- firenoc.BuildingType ---");
    const buildingTypes = mdmsData.firenoc?.BuildingType || [];
    console.log(`Total BuildingTypes: ${buildingTypes.length}`);
    buildingTypes.forEach(bt => {
      console.log(`  - Code: "${bt.code}", Active: ${bt.active}, UOMs: ${JSON.stringify(bt.uom)}`);
    });

    console.log("\n2. --- firenoc.FireStations ---");
    const fireStations = mdmsData.firenoc?.FireStations || [];
    console.log(`Total FireStations: ${fireStations.length}`);
    fireStations.forEach(fs => {
      console.log(`  - Code: "${fs.code}", BaseTenantId: "${fs.baseTenantId}", Active: ${fs.active}`);
    });

    console.log("\n3. --- common-masters.OwnerShipCategory ---");
    const ownershipCategories = mdmsData["common-masters"]?.OwnerShipCategory || [];
    console.log(`Total OwnershipCategories: ${ownershipCategories.length}`);
    ownershipCategories.forEach(oc => {
      console.log(`  - Code: "${oc.code}", Active: ${oc.active}`);
    });

    console.log("\n4. --- common-masters.OwnerType ---");
    const ownerTypes = mdmsData["common-masters"]?.OwnerType || [];
    console.log(`Total OwnerTypes: ${ownerTypes.length}`);
    ownerTypes.forEach(ot => {
      console.log(`  - Code: "${ot.code}", Active: ${ot.active}`);
    });

  } catch (err) {
    console.error("Error:", err.message);
  }
}

run();
