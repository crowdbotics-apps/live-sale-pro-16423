import { createStackNavigator } from "react-navigation-stack";

import ChatScreen from "./screens/ChatScreen";
import Home from "./screens/";


export default MessengerNavigator = createStackNavigator(
  {
    ChatScreen: { screen: ChatScreen },
    Home: { screen: Home },

  },
  {
    initialRouteName: "Home",

  }
);
