// screens/HomePage.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';

const HomePage = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gradientOverlay} />
      <ScrollView style={styles.scrollView}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/releaf_logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>Welcome Back!</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calculate Your Impact</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Carbon Footprint Calculator</Text>
          </TouchableOpacity>
        </View>

        {/* Statistics Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Statistics</Text>
          <View style={styles.statsCard}>
            <Text style={styles.statsText}>Start calculating your impact!</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00552A',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(67, 111, 89, 0.5)',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 50,
    marginBottom: 20,
  },
  welcomeText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '300',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 15,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  statsText: {
    color: 'white',
    fontSize: 16,
  },
});

export default HomePage;