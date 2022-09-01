import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'fleetPay',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    SplashScreen: {
      launchShowDuration: 5000,
      launchAutoHide: false,
      // androidSplashResourceName: 'splash',
      // androidScaleType: 'CENTER_CROP'
    }
  },

};

export default config;
