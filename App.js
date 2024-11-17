import React from 'react'; 
import { NavigationContainer } from '@react-navigation/native'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import LandingPage from "./src/screens/Landing";
import SignIn from "./src/screens/SignIn";
import HomePage from "./src/screens/HomePage";

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>   
      <Stack.Navigator>
      <Stack.Screen
          name="LandingPage"
          component={LandingPage}
          options={{ headerShown: false}}
        />

      <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{ headerShown: false}}
        />

      <Stack.Screen
          name="HomePage"
          component={HomePage}
          options={{ headerShown: false}}
        />


      </Stack.Navigator>
      </NavigationContainer>
  );
};