import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { API_BASE_URL } from '@env';

export default function MainStudent({ navigation }) {
  const [search, setSearch] = useState('');
  const [activities, setActivities] = useState([]);
  const [availableExercises, setAvailableExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [showAvailable, setShowAvailable] = useState(false);

  const fetchUserActivities = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/exercise/user`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        setMessage('Você não está autenticado. Por favor, faça login.');
        setActivities([]);
        return;
      }

      const data = await response.json();

      if (data.length === 0) {
        setMessage('Nenhum exercício cadastrado para você no momento.');
        setActivities([]);
      } else {
        setMessage('');
        setActivities(data);
      }
    } catch (error) {
      console.error('Erro ao buscar atividades do usuário:', error);
      setMessage('Erro ao buscar os exercícios. Tente novamente mais tarde.');
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAvailableExercises = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/exercise`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setAvailableExercises(data);
    } catch (error) {
      console.error('Erro ao buscar exercícios disponíveis:', error);
    }
  }, []);

  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/exercise/data`, {
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
      console.error('Erro ao buscar dados do usuário:', error);
      return null;
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserActivities();
    setRefreshing(false);
  }, [fetchUserActivities]);

  useEffect(() => {
    const loadData = async () => {
      await fetchUserActivities();
      const userData = await fetchUserData();
  
      if (userData) {
        setUserName(userData.name);
      }
    };
  
    loadData();
  }, [fetchUserActivities, fetchUserData]);

  const filteredActivities = activities.filter((activity) =>
    activity.nome.toLowerCase().includes(search.toLowerCase())
  );

  const handleActivityPress = useCallback((exercise) => {
    navigation.navigate('Exercises', { exercise });
  }, [navigation]);

  const toggleAvailableExercises = useCallback(() => {
    if (!showAvailable) fetchAvailableExercises();
    setShowAvailable((prev) => !prev);
  }, [showAvailable, fetchAvailableExercises]);

  const formatDate = useCallback((timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  const renderActivityItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.activityBlock}
      onPress={() => handleActivityPress(item)}
    >
      <View style={styles.activityHeader}>
        <Text style={styles.activityTitle}>{item.nome}</Text>
        <Feather name="chevron-right" size={24} color="#fff" />
      </View>
      <Text style={styles.activityDescription}>{item.descricao}</Text>
      <View style={styles.activityFooter}>
        <Text style={styles.activityDetails}>
          <Feather name="repeat" size={14} color="#aaa" /> {item.series} séries
        </Text>
        <Text style={styles.activityDetails}>
          <Feather name="activity" size={14} color="#aaa" /> {item.repeticoes} repetições
        </Text>
      </View>
      <Text style={styles.activityDate}>
        <Feather name="calendar" size={14} color="#aaa" /> {formatDate(item.assignedAt)}
      </Text>
    </TouchableOpacity>
  ), [handleActivityPress, formatDate]);

  const handleLogout = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {

        navigation.navigate('Login');
      } else {
        console.error('Erro ao fazer logout 0x1.');
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View style={styles.profileCircle}>
          <Text style={styles.profileInitial}>{userName.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.greeting}>Olá, {userName}</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.pageTitle}>Ficha de treino</Text>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar exercício"
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredActivities}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderActivityItem}
          ListEmptyComponent={
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>{message}</Text>
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

      <TouchableOpacity
        style={styles.button}
        onPress={toggleAvailableExercises}
      >
        <Text style={styles.buttonText}>
          {showAvailable ? 'Ocultar Exercícios Disponíveis' : 'Ver Exercícios Disponíveis'}
        </Text>
        <Feather name={showAvailable ? "chevron-up" : "chevron-down"} size={20} color="#fff" />
      </TouchableOpacity>

      {showAvailable && (
        <FlatList
          data={availableExercises}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.availableBlock}>
              <Text style={styles.activityTitle}>{item.nome}</Text>
              <Text style={styles.activityDescription}>{item.descricao}</Text>
              <View style={styles.activityFooter}>
                <Text style={styles.activityDetails}>
                  <Feather name="repeat" size={14} color="#aaa" /> {item.series} séries
                </Text>
                <Text style={styles.activityDetails}>
                  <Feather name="activity" size={14} color="#aaa" /> {item.repeticoes} repetições
                </Text>
              </View>
            </View>
          )}
          contentContainerStyle={styles.availableListContent}
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
    fontSize: 24,
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
  activityBlock: {
    backgroundColor: '#1e3a8a',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  activityTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  activityDescription: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 10,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  activityDetails: {
    color: '#aaa',
    fontSize: 14,
  },
  activityDate: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 5,
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
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    padding: 15,
    borderRadius: 25,
    marginHorizontal: 20,
    marginVertical: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  availableBlock: {
    backgroundColor: '#2a2a72',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  availableListContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});