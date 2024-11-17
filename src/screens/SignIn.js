import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard, 
  Image
} from 'react-native';

const SignIn = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gradientOverlay} />
      
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.content}
        >
          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>

          {/* Logo */}
          <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/releaf_logo.png')}  // Make sure your PNG file is in the assets folder
            style={styles.logo}
            resizeMode="contain"
          />
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

<TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate("HomePage")}
          >
            <Text style={styles.buttonText}>Sign in</Text>
            <Text style={styles.buttonIcon}>›</Text>
          </TouchableOpacity>

            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
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
  content: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  backButtonText: {
    color: 'white',
    fontSize: 32,
    fontWeight: '300',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logoText: {
    fontSize: 36,
    color: 'white',
    fontWeight: '300',
    letterSpacing: 1,
  },
  logoHouse: {
    fontSize: 36,
    fontWeight: '400',
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '400',
    marginBottom: 30,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    color: 'white',
    fontSize: 16,
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: 'transparent',
    marginTop: 20,
  },
  signInButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '400',
    marginRight: 10,
  },
  buttonIcon: {
    color: 'white',
    fontSize: 24,
    fontWeight: '300',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 20,
  },
  forgotPasswordText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
});

export default SignIn;