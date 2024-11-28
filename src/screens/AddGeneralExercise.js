import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { API_BASE_URL } from '@env';

export default function AddNewExercise({ navigation }) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [series, setSeries] = useState('');
  const [repeticoes, setRepeticoes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddExercise = async () => {
    if (!nome.trim() || !descricao.trim() || !series.trim() || !repeticoes.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (isNaN(parseInt(series, 10)) || isNaN(parseInt(repeticoes, 10))) {
      Alert.alert('Erro', 'Séries e repetições devem ser números válidos.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/professor/add_exercises`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome,
          descricao,
          series: parseInt(series, 10),
          repeticoes: parseInt(repeticoes, 10),
        }),
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Exercício adicionado com sucesso!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        const errorData = await response.json();
        Alert.alert('Erro', errorData.message || 'Erro ao adicionar exercício.');
      }
    } catch (error) {
      console.error('Erro ao adicionar exercício:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o exercício. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.pageTitle}>Novo Exercício</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Feather name="activity" size={20} color="#3b82f6" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nome do Exercício"
                placeholderTextColor="#888"
                value={nome}
                onChangeText={setNome}
              />
            </View>

            <View style={styles.inputContainer}>
              <Feather name="file-text" size={20} color="#3b82f6" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Descrição"
                placeholderTextColor="#888"
                value={descricao}
                onChangeText={setDescricao}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.rowContainer}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Feather name="repeat" size={20} color="#3b82f6" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Séries"
                  placeholderTextColor="#888"
                  value={series}
                  keyboardType="numeric"
                  onChangeText={setSeries}
                />
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Feather name="hash" size={20} color="#3b82f6" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Repetições"
                  placeholderTextColor="#888"
                  value={repeticoes}
                  keyboardType="numeric"
                  onChangeText={setRepeticoes}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleAddExercise}
              disabled={loading}
            >
              {loading ? (
                <Feather name="loader" size={24} color="#fff" />
              ) : (
                <>
                  <Feather name="plus-circle" size={24} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Adicionar Exercício</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  backButton: {
    marginRight: 15,
  },
  pageTitle: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  form: {
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  button: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#555',
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});