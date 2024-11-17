import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';


const LandingPage = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Gradient Background using Views */}
      <View style={styles.gradientOverlay} />
      
      <View style={styles.content}>
        {/* Logo and Tagline */}
        <View style={styles.logoContainer}>
        <Image
            source={require('../../assets/releaf_logo.png')}  // Make sure your PNG file is in the assets folder
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.tagline}>properties, simplified.</Text>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate("SignIn")}
          >
            <Text style={styles.buttonText}>Sign in</Text>
            <Text style={styles.buttonIcon}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.getStartedButton]}
            //onPress={() => navigation.navigate('GetStarted')}
          >
            <Text style={styles.buttonIcon}>‹</Text>
            <Text style={styles.buttonText}>Get started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#79B495', // Lighter green as base color
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(67, 111, 89, 0.5)', // Darker green overlay for gradient effect
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 200,
  },
  logoText: {
    fontSize: 48,
    color: 'white',
    fontWeight: '300',
    letterSpacing: 1,
  },
  logoHouse: {
    fontSize: 48,
    fontWeight: '400',
  },
  tagline: {
    color: 'white',
    fontSize: 18,
    fontWeight: '300',
    marginTop: 8,
  },
  buttonContainer: {
    width: '100%',
    gap: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '400',
    marginHorizontal: 10,
  },
  buttonIcon: {
    color: 'white',
    fontSize: 24,
    fontWeight: '300',
  },
  getStartedButton: {
    marginTop: 10,
  },
});

export default LandingPage;