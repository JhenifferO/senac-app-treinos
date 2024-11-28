// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import LoginScreen from '../screens/LoginScreen';
import MainTeacher from '../screens/MainTeacher';
import Register from '../screens/RegisterScreen';
import MainStudent from '../screens/MainStudent';
import Exercises from '../screens/Exercises';
import Student from '../screens/StudentDetails';
import NewExercise from '../screens/AddExercise';
import NewGeneralExercise from '../screens/AddGeneralExercise';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function MainDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={MainStudent} options={{ headerShown: false }} />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainScreen"
          component={MainDrawer}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Exercises"
          component={Exercises}
          options={{
            headerShown: true,
            title: 'Detalhes do Exercício',
            headerStyle: { backgroundColor: '#1e3a8a' },
            headerTintColor: '#fff',
          }}
        />
          <Stack.Screen
          name="Register"
          component={Register}
          options={{
            headerShown: true,
            title: 'Cadastro',
            headerStyle: { backgroundColor: '#1e3a8a' },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="MainTeacher"
          component={MainTeacher}
          options={{
            headerShown: false,
            title: 'Professor',
            headerStyle: { backgroundColor: '#1e3a8a' },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="Student"
          component={Student}
          options={{
            headerShown: true,
            title: 'Detalhes do Aluno',
            headerStyle: { backgroundColor: '#1e3a8a' },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="NewExercise"
          component={NewExercise}
          options={{
            headerShown: true,
            title: 'Atribuir Exercício ao Alunoo',
            headerStyle: { backgroundColor: '#1e3a8a' },
            headerTintColor: '#fff',
          }}
        />
          <Stack.Screen
          name="NewGeneralExercise"
          component={NewGeneralExercise}
          options={{
            headerShown: true,
            title: 'Atribuir Exercício a Lista',
            headerStyle: { backgroundColor: '#1e3a8a' },
            headerTintColor: '#fff',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}