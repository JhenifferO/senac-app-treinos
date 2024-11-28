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

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(null);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword || !role) {
      Toast.show({
        type: 'info',
        text1: 'Atenção',
        text2: 'Preencha todos os campos.',
        text2Style: {
            fontSize: 18,
            fontWeight: 'bold',
          },
        position: 'top',
      });
      return;
    }

    if (!isValidEmail(email)) {
        Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Por favor, insira um email válido.',
        position: 'top',
        text2Style: {
            fontSize: 18,
            fontWeight: 'bold',
          },
        });
        return;
    }

    if (password.length < 5) {
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: 'A senha deve ter no mínimo 5 caracteres.',
          text2Style: {
            fontSize: 18,
            fontWeight: 'bold',
          },
          position: 'top',
        });
        return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'As senhas não coincidem.',
        text2Style: {
            fontSize: 18,
            fontWeight: 'bold',
          },
        position: 'top',
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, confirmPassword, role }),
      });

      console.log('Status da resposta:', response.status);

      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: 'Cadastro realizado com sucesso!',
          text2: 'Agora você pode fazer login.',
          text2Style: {
            fontSize: 18,
            fontWeight: 'bold',
          },
        });

        setTimeout(() => {
            navigation.navigate('Login');
        }, 1200);
      } else {
        const errorData = await response.json();
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: errorData.message || 'Erro desconhecido',
          text2Style: {
            fontSize: 18,
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
            <Text style={styles.subtitle}>Criar uma Conta</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              placeholderTextColor="#aaa"
              value={name}
              onChangeText={setName}
            />
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
            <TextInput
              style={styles.input}
              placeholder="Confirme a Senha"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <View style={styles.roleContainer}>
              <Text style={styles.roleLabel}>Você é:</Text>
              <TouchableOpacity
                style={[styles.roleOption, role === 1 && styles.roleOptionSelected]}
                onPress={() => setRole(1)}
              >
                <Text style={styles.roleText}>Professor</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleOption, role === 2 && styles.roleOptionSelected]}
                onPress={() => setRole(2)}
              >
                <Text style={styles.roleText}>Aluno </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.goBack}>Já tem uma conta? Faça login</Text>
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
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 20,
  },
  roleLabel: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
  roleOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#3b82f6',
    minWidth: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },

  roleOptionSelected: {
    backgroundColor: '#3b82f6',
  },
  roleText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  registerButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#3b82f6',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  goBack: {
    color: '#ddd',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 16,
  },
});