import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function ExerciseDetailsScreen({ route }) {
  const { exercise } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{exercise.nome}</Text>
          <View style={styles.iconContainer}>
            <Feather name="activity" size={24} color="#3b82f6" />
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.description}>{exercise.descricao}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Detalhes do Exercício</Text>
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Feather name="repeat" size={20} color="#3b82f6" />
              <Text style={styles.detailLabel}>Séries</Text>
              <Text style={styles.detailValue}>{exercise.series}</Text>
            </View>
            <View style={styles.detailItem}>
              <Feather name="refresh-cw" size={20} color="#3b82f6" />
              <Text style={styles.detailLabel}>Repetições</Text>
              <Text style={styles.detailValue}>{exercise.repeticoes}</Text>
            </View>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Dicas</Text>
          <Text style={styles.tips}>
            • Mantenha a forma correta durante todo o exercício{'\n'}
            • Respire de forma constante e controlada{'\n'}
            • Foque nos músculos que está trabalhando{'\n'}
            • Ajuste o peso conforme necessário para manter a técnica
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  iconContainer: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 20,
    padding: 10,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#e0e0e0',
    lineHeight: 24,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#a0a0a0',
    marginTop: 5,
  },
  detailValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },
  tips: {
    fontSize: 16,
    color: '#e0e0e0',
    lineHeight: 24,
  },
});