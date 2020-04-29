import { createStackNavigator } from "react-navigation-stack";

import CameraScreen from "./screens/CameraScreen";
import Home from "./screens/";


export default CameraNavigator = createStackNavigator(
  {
    Camera: { screen: CameraScreen },
    Home: { screen: Home },
  },
  {
    initialRouteName: "Home",
  }
);
