import { config } from "chai";
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname),
    baseUrl: 'http://10.12.1.159:4200', 
    defaultCommandTimeout: 10000,
    video: false,
    setupNodeEvents(on, config) {
      config.env = {
        ...config.env,
        ...process.env,
        Api_Url: 'http://10.12.1.159:4200'
      }
      return config
    },
  },
});
function nxE2EPreset(__dirname: string): Cypress.EndToEndConfigOptions | undefined {
  throw new Error("Function not implemented.");
}

