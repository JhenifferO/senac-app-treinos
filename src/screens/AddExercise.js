import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  StatusBar,
  TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { API_BASE_URL } from '@env';

export default function AddExercise({ route, navigation }) {
  const { studentId, fetchStudentExercises } = route.params;
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAvailableExercises = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/exercise`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar exercícios disponíveis.');
      }

      const data = await response.json();

      if (data.length === 0) {
        setMessage('Nenhum exercício disponível no momento.');
        setExercises([]);
      } else {
        setMessage('');
        setExercises(data);
        setFilteredExercises(data);
      }
    } catch (error) {
      console.error('Erro ao buscar exercícios disponíveis:', error);
      setMessage('Erro ao buscar exercícios. Tente novamente mais tarde.');
      setExercises([]);
    } finally {
      setLoading(false);
    }
  }, []);
 
  const handleAssignExercise = useCallback(
    async (exerciseId) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/professor/student/${studentId}/exercises`,
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ exerciseId }),
          }
        );
  
        const responseBody = await response.json();
  
        if (response.status === 400) {
          Alert.alert('Atenção', responseBody.message || 'Solicitação inválida.');
          return;
        }
  
        if (response.status === 404) {
          Alert.alert('Erro', responseBody.message || 'Aluno ou exercício não encontrado.');
          return;
        }
  
        if (response.status === 201) {
          Alert.alert('Sucesso', 'Exercício atribuído com sucesso.');
          fetchStudentExercises();
          navigation.goBack();
          return;
        }
  
        Alert.alert('Erro', responseBody.message || 'Ocorreu um erro inesperado.');
      } catch (error) {
        console.error('Erro ao atribuir exercício:', error);
        Alert.alert('Erro', 'Falha ao comunicar com o servidor. Tente novamente mais tarde.');
      }
    },
    [studentId, fetchStudentExercises, navigation]
  );  

  useEffect(() => {
    fetchAvailableExercises();
  }, [fetchAvailableExercises]);

  useEffect(() => {
    const filtered = exercises.filter(exercise => 
      exercise.nome.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredExercises(filtered);
  }, [searchQuery, exercises]);

  const renderExerciseItem = ({ item }) => (
    <TouchableOpacity
      style={styles.exerciseBlock}
      onPress={() =>
        Alert.alert(
          'Atribuir Exercício',
          `Deseja realmente atribuir o exercício "${item.nome}" ao aluno?`,
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Atribuir', onPress: () => handleAssignExercise(item.id) },
          ]
        )
      }
    >
      <View style={styles.exerciseContent}>
        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseTitle}>{item.nome}</Text>
          <Text style={styles.exerciseDescription}>{item.descricao}</Text>
        </View>
        <View style={styles.exerciseDetails}>
          <View style={styles.detailItem}>
            <Feather name="repeat" size={16} color="#3b82f6" />
            <Text style={styles.detailText}>{item.series} séries</Text>
          </View>
          <View style={styles.detailItem}>
            <Feather name="activity" size={16} color="#3b82f6" />
            <Text style={styles.detailText}>{item.repeticoes} repetições</Text>
          </View>
        </View>
      </View>
      <Feather name="plus-circle" size={24} color="#3b82f6" style={styles.addIcon} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Adicionar Exercício</Text>
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar exercício"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderExerciseItem}
          ListEmptyComponent={
            <View style={styles.messageContainer}>
              <Feather name="inbox" size={48} color="#888" />
              <Text style={styles.messageText}>{message || 'Nenhum exercício encontrado.'}</Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
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
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 25,
    margin: 20,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    height: 50,
    fontSize: 16,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  exerciseBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseInfo: {
    marginBottom: 10,
  },
  exerciseTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  exerciseDescription: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 5,
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    color: '#ccc',
    fontSize: 14,
    marginLeft: 5,
  },
  addIcon: {
    marginLeft: 15,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  messageText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});