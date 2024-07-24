import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                navigation.replace("Main");
            }
        });

        return unsubscribe;
    }, []);

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log('Logged in with', user.email);
            })
            .catch(error => alert(error.message));
    };

    return (
        <View style={styles.background}>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <Text style={styles.appName}>SPRINT O' CLOCK</Text>
                <Image source={require('../assets/logo2.png')} style={styles.runnerImage} />
                <Text style={styles.headerText}>Log In</Text>
                <Text style={styles.logoPhrase}>Welcome Back, Runner!</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={text => setEmail(text)}
                        style={styles.input}
                        placeholderTextColor="#aaa"
                    />
                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={text => setPassword(text)}
                        style={styles.input}
                        secureTextEntry
                        placeholderTextColor="#aaa"
                    />
                </View>
                <TouchableOpacity onPress={handleLogin} style={styles.button}>
                    <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.signUpContainer}>
                    <Text style={styles.signUpText}>Don't have an account? <Text style={styles.signUpLink}>Sign Up</Text></Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF', // Set background color to white
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'orange', // Change color to orange
        marginBottom: 20,
        textAlign: 'center',
    },
    runnerImage: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0D1B2A', // Change color to dark blue
        marginBottom: 10,
    },
    logoPhrase: {
        fontSize: 16,
        color: '#0D1B2A', // Change color to dark blue
        marginBottom: 20,
    },
    inputContainer: {
        width: '80%',
        marginBottom: 30,
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 10,
        fontSize: 16,
        color: 'black',
    },
    button: {
        backgroundColor: '#1E90FF', // Blue color
        width: '80%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    signUpContainer: {
        marginTop: 20,
    },
    signUpText: {
        color: '#0D1B2A', // Change color to dark blue
        fontSize: 14,
        textAlign: 'center',
    },
    signUpLink: {
        color: '#1E90FF',
        fontWeight: '700',
        fontSize: 16,
    },
});

export default LoginScreen;
