import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { auth } from '../services/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const SignUpScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const navigation = useNavigation();

    const handleSignUp = () => {
        const fullName = `${firstName} ${lastName}`;
        createUserWithEmailAndPassword(auth, email, password)
            .then(async userCredentials => {
                const user = userCredentials.user;
                await updateProfile(user, {
                    displayName: fullName
                });
                console.log('Registered with', user.email);
                navigation.navigate('Main'); // Navigate to the Main screen after signup
            })
            .catch(error => alert(error.message));
    };

    return (
        <View style={styles.background}>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <Text style={styles.appName}>SPRINT O' CLOCK</Text>
                <Image source={require('../assets/logo2.png')} style={styles.runnerImage} />
                <Text style={styles.headerText}>Sign Up</Text>
                <Text style={styles.logoPhrase}>Join Us and Start Running!</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="First Name"
                        value={firstName}
                        onChangeText={text => setFirstName(text)}
                        style={styles.input}
                        placeholderTextColor="#aaa"
                    />
                    <TextInput
                        placeholder="Last Name"
                        value={lastName}
                        onChangeText={text => setLastName(text)}
                        style={styles.input}
                        placeholderTextColor="#aaa"
                    />
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
                <TouchableOpacity onPress={handleSignUp} style={styles.button}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.signInContainer}>
                    <Text style={styles.signInText}>Already have an account? <Text style={styles.signInLink}>Sign In</Text></Text>
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
    signInContainer: {
        marginTop: 20,
    },
    signInText: {
        color: '#0D1B2A', // Change color to dark blue
        fontSize: 14,
        textAlign: 'center',
    },
    signInLink: {
        color: '#1E90FF',
        fontWeight: '700',
        fontSize: 16,
    },
});

export default SignUpScreen;
