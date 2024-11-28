import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { API_BASE_URL } from '@env';

export default function MainTeacher({ navigation }) {
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [professorName, setProfessorName] = useState('');

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/professor/students`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        setMessage('Você não está autenticado. Por favor, faça login.');
        setStudents([]);
        return;
      }

      const data = await response.json();

      if (data.length === 0) {
        setMessage('Nenhum aluno encontrado.');
        setStudents([]);
      } else {
        setMessage('');
        setStudents(data);
      }
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      setMessage('Erro ao buscar alunos. Tente novamente mais tarde.');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProfessorData = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/professor/data`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        console.error('Usuário não autenticado.');
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar dados do professor:', error);
      return null;
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        navigation.navigate('Login');
      } else {
        console.error('Erro ao fazer logout.');
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }, [navigation]);

  useEffect(() => {
    const loadData = async () => {
      await fetchStudents();
      const professorData = await fetchProfessorData();

      if (professorData) {
        setProfessorName(professorData.name);
      }
    };

    loadData();
  }, [fetchStudents, fetchProfessorData]);

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleStudentPress = useCallback((student) => {
    navigation.navigate('Student', { student });
  }, [navigation]);

  const handleAddExercises = useCallback(() => {
    navigation.navigate('NewGeneralExercise');
  }, [navigation]);

  const renderStudentItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.studentBlock}
      onPress={() => handleStudentPress(item)}
    >
      <View style={styles.studentHeader}>
        <Text style={styles.studentName}>{item.name}</Text>
        <Feather name="chevron-right" size={24} color="#fff" />
      </View>
      <Text style={styles.studentEmail}>{item.email}</Text>
    </TouchableOpacity>
  ), [handleStudentPress]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View style={styles.profileCircle}>
          <Text style={styles.profileInitial}>{professorName.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.greeting}>Olá, Professor {professorName}</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.pageTitle}>Gerenciar Alunos</Text>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar aluno"
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredStudents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderStudentItem}
          ListEmptyComponent={
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>{message}</Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={handleAddExercises}>
        <Feather name="plus-circle" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Adicionar Exercícios à Lista</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  pageTitle: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
    justifyContent: 'space-between',
  },
  logoutButton: {
    padding: 10,
  },
  profileCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileInitial: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  greeting: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 25,
    marginHorizontal: 20,
    marginVertical: 15,
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
  studentBlock: {
    backgroundColor: '#1e3a8a',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
  },
  studentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  studentName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  studentEmail: {
    color: '#ccc',
    fontSize: 16,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  messageText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    padding: 15,
    borderRadius: 10,
    margin: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});