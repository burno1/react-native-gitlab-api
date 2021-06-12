import React, { useContext } from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator,DrawerItem, DrawerContentScrollView } from '@react-navigation/drawer';
import { navigationRef } from "./RootNavigation";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext, AuthProvider } from "./src/context/AuthContext";
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import RepoScreen from './src/screens/RepoScreen';

function CustomDrawerContent() {
  const {authState, logoutAction, isLoggedIn } = useContext(AuthContext);

  const logout = () =>{
    logoutAction();
  }

  return (
    <DrawerContentScrollView >
      <DrawerItem label="Logout" onPress={() => logout()} />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();


function Root(){
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{    
          headerLeft: null
        }}
      />
      <Stack.Screen
        name="Repo"
        component={RepoScreen}
      />
      </Stack.Navigator>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer ref={navigationRef}>
        <Drawer.Navigator 
          drawerContent={props => <CustomDrawerContent {...props} />}>
            <Drawer.Screen name="Root" component={Root}/>
        </Drawer.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}