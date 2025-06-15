import { setEngine } from "./app/getEngine";
import { LoadScreen } from "./app/screens/LoadScreen";
// import { MainScreen } from "./app/screens/main/MainScreen";
import { Login } from "./app/screens/Login";
import { userSettings } from "./app/utils/userSettings";
import { CreationEngine } from "./engine/engine";
import { Assets, Sprite } from "pixi.js";

/**
 * Importing these modules will automatically register there plugins with the engine.
 */
import "@pixi/sound";
// import "@esotericsoftware/spine-pixi-v8";

// Create a new creation engine instance
const engine = new CreationEngine();
setEngine(engine);

(async () => {
  // Initialize the creation engine instance
  await engine.init({
    background: "#1E1E1E",
    resizeOptions: { minWidth: 768, minHeight: 1024, letterbox: false },
  });

  // Initialize the user settings
  userSettings.init();

  // Load the main bundle first to ensure cursor asset is available
  await Assets.loadBundle('main');

  // await engine.navigation.showScreen(LoadScreen);
  // Show the main screen once the load screen is dismissed
  await engine.navigation.showScreen(Login);
  





})();
