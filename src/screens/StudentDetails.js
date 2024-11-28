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
  RefreshControl,
  StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { API_BASE_URL } from '@env';

export default function StudentDetails({ route, navigation }) {
  const { student } = route.params;
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStudentExercises = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/professor/student/${student.id}/exercises`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar exercícios do aluno.');
      }

      const data = await response.json();
      setExercises(data);
    } catch (error) {
      console.error('Erro ao buscar exercícios do aluno:', error);
      Alert.alert('Erro', 'Não foi possível carregar os exercícios do aluno.');
    } finally {
      setLoading(false);
    }
  }, [student.id]);

  const handleRemoveExercise = useCallback(
    async (exerciseId) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/professor/student/${student.id}/exercises/${exerciseId}`,
          {
            method: 'DELETE',
            credentials: 'include',
          }
        );

        if (!response.ok) {
          throw new Error('Erro ao remover exercício.');
        }

        Alert.alert('Sucesso', 'Exercício removido com sucesso.');
        fetchStudentExercises();
      } catch (error) {
        console.error('Erro ao remover exercício:', error);
        Alert.alert('Erro', 'Não foi possível remover o exercício.');
      }
    },
    [student.id, fetchStudentExercises]
  );

  const handleAddExercise = useCallback(() => {
    navigation.navigate('NewExercise', { studentId: student.id, fetchStudentExercises });
  }, [student.id, navigation, fetchStudentExercises]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStudentExercises();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchStudentExercises();
  }, [fetchStudentExercises]);

  const renderExerciseItem = ({ item }) => (
    <View style={styles.exerciseBlock}>
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseTitle}>{item.nome}</Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() =>
            Alert.alert('Remover Exercício', 'Deseja realmente remover este exercício?', [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Remover', onPress: () => handleRemoveExercise(item.id) },
            ])
          }
        >
          <Feather name="trash-2" size={20} color="#e63946" />
        </TouchableOpacity>
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
      <Text style={styles.dateText}>
        Adicionado em: {new Date(item.assignedAt).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Feather name="user" size={24} color="#3b82f6" />
        <Text style={styles.pageTitle}>{student.name}</Text>
      </View>

      <Text style={styles.sectionTitle}>Ficha de Treino</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" style={styles.loader} />
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderExerciseItem}
          ListEmptyComponent={
            <View style={styles.messageContainer}>
              <Feather name="inbox" size={48} color="#888" />
              <Text style={styles.messageText}>Nenhum exercício atribuído.</Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#3b82f6']}
              tintColor="#3b82f6"
            />
          }
          contentContainerStyle={styles.listContent}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={handleAddExercise}>
        <Feather name="plus-circle" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Adicionar Exercício</Text>
      </TouchableOpacity>
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
  pageTitle: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#3b82f6',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  exerciseBlock: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  exerciseTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
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
  dateText: {
    color: '#888',
    fontSize: 12,
  },
  removeButton: {
    padding: 5,
  },
  addButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    padding: 15,
    borderRadius: 25,
    margin: 20,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
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
    marginTop: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});