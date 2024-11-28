import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import { API_BASE_URL } from '@env';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {

    if (!email || !password) {
      Toast.show({
        type: 'info',
        text1: 'Atenção',
        text2: 'Preencha todos os campos.',
        position: 'top',
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Status da resposta:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Resposta recebida:', data);

        Toast.show({
          type: 'success',
          text1: 'Sucesso',
          text2: `Bem-vindo, ${data.user.name}`,
          text2Style: {
            fontSize: 18,
            fontWeight: 'bold',
          },
        });

        if (data.user.role === 'student') {
          navigation.navigate('MainScreen');
        } else if (data.user.role === 'teacher') {
          navigation.navigate('MainTeacher');
        }
      } else {
        const errorData = await response.json();

        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: errorData.message || 'Erro desconhecido',
          text2Style: {
            fontSize: 16,
            fontWeight: 'bold',
          },
        });
      }
    } catch (error) {
      console.error('Erro ao conectar ao servidor:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível conectar ao servidor.',
        text2Style: {
          fontSize: 18,
          fontWeight: 'bold',
        },
      });
    }
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      }}
      style={styles.backgroundImage}
    >
      <LinearGradient colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)']} style={styles.gradient}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>FitTrack</Text>
            <Text style={styles.subtitle}>Gerenciamento de Treinos</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Esqueci minha senha</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>

          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    fontSize: 48,
    color: '#fff',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    color: '#ddd',
    marginTop: 10,
  },
  formContainer: {
    width: '100%',
    maxWidth: 350,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    paddingHorizontal: 20,
    color: '#fff',
    marginBottom: 15,
    fontSize: 16,
  },
  forgotPassword: {
    color: '#ddd',
    marginBottom: 30,
    textAlign: 'right',
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#3b82f6',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  registerButton: {
    width: '100%',
    height: 50,
    backgroundColor: 'transparent',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});