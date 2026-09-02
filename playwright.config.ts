import { defineConfig,devices } from "@playwright/test";
const baseURL=process.env.PLAYWRIGHT_BASE_URL??"http://localhost:3000";
export default defineConfig({testDir:"./tests",webServer:{command:"npm run dev",url:baseURL,reuseExistingServer:true},use:{baseURL,trace:"retain-on-failure"},projects:[{name:"chromium",use:{...devices["Desktop Chrome"]}},{name:"mobile",use:{...devices["iPhone 13"],browserName:"chromium"}}]});
