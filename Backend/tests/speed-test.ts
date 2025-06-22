// speed-test.ts
import axios from 'axios';
import https from "https";


const BASE_URL = 'https://localhost:3000';
const endpoints = [
  "/api/touchpoint/window?date=2024-01-01&from=14:00&to=15:00",
  "/api/touchpoint/flightnumber?flightNumber=PGT1261",
  "/api/touchpoint/airline?airlineShortname=PEGASUS",
  "/api/touchpoint/aircraft?aircraftType=A320N",
  "/api/touchpoint/touchpoint?touchpoint=Aankomsthal"
];

function getRandomEndpoint() {
  return endpoints[Math.floor(Math.random() * endpoints.length)];
}

async function login() {
  try {
    const response = await axios.post(
      `${BASE_URL}/post/login`,
      {
        username: "admin1",
        password: "Admin1Admin"
      },
      {
        httpsAgent: new https.Agent({ rejectUnauthorized: false })

      }
    );
    return response.data.token;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (err.response) {
        throw new Error(`Login mislukt: status ${err.response.status}, data: ${JSON.stringify(err.response.data)}`);
      } else if (err.request) {
        throw new Error("Login mislukt: geen response ontvangen van server");
      } else {
        throw new Error(`Login mislukt: ${err.message}`);
      }
    } else if (err instanceof Error) {
      throw new Error("Login mislukt: " + err.message);
    } else {
      throw new Error("Login mislukt: onbekende fout");
    }
  }
}

async function runSpeedTest() {
  const token = await login();
  console.log("✅ Inloggen gelukt, token ontvangen.");

  const responseTimes: number[] = [];

  for (let i = 0; i < 20; i++) {
    const endpoint = getRandomEndpoint();
    const url = `${BASE_URL}${endpoint}`;

    const start = performance.now();
    console.log(`Start request ${i + 1}: ${endpoint}`);
    try{
      await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      });
      const end = performance.now();

      const duration = end - start;
      responseTimes.push(duration);
      console.log(`Request ${i + 1}: ${endpoint} duurde ${duration.toFixed(2)} ms`);
    } catch (error : any) {
      console.error(`Request ${i + 1} ${endpoint} mislukt:`, error.message || error);
    }
  }

  const threshold = 1000; 
  const fastResponses = responseTimes.filter(t => t < threshold).length;
  const percentageFast = (fastResponses / responseTimes.length) * 100;

  console.log(`\n${percentageFast.toFixed(2)}% van de requests duurden minder dan ${threshold} ms.`);

  if (percentageFast >= 95) {
    console.log("🎉 Test geslaagd!");
  } else {
    console.log("❌ Test niet geslaagd.");
    process.exit(1); 
  }
}

runSpeedTest().catch(err => {
  console.error("❌ Fout tijdens test:", err.message || err);
  process.exit(1);
});
