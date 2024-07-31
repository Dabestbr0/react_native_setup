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
                navigation.navigate('Main', { screen: 'ProfilePage', params: { firstName } }); // Navigate with firstName
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
                <View style={styles.boxContainer}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="First Name"
                            value={firstName}
                            onChangeText={text => setFirstName(text)}
                            style={styles.input}
                            placeholderTextColor="#555"
                        />
                        <TextInput
                            placeholder="Last Name"
                            value={lastName}
                            onChangeText={text => setLastName(text)}
                            style={styles.input}
                            placeholderTextColor="#555"
                        />
                        <TextInput
                            placeholder="Email"
                            value={email}
                            onChangeText={text => setEmail(text)}
                            style={styles.input}
                            placeholderTextColor="#555"
                        />
                        <TextInput
                            placeholder="Password"
                            value={password}
                            onChangeText={text => setPassword(text)}
                            style={styles.input}
                            secureTextEntry
                            placeholderTextColor="#555"
                        />
                    </View>
                    <TouchableOpacity onPress={handleSignUp} style={styles.button}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.signInContainer}>
                        <Text style={styles.signInText}>Already have an account? <Text style={styles.signInLink}>Sign In</Text></Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
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
        color: 'orange',
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
        color: '#0D1B2A',
        marginBottom: 10,
    },
    logoPhrase: {
        fontSize: 16,
        color: '#0D1B2A',
        marginBottom: 20,
    },
    boxContainer: {
        width: '90%',
        backgroundColor: '#F7F8FA',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 5,
        elevation: 5,
    },
    inputContainer: {
        width: '100%',
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 10,
        fontSize: 16,
        color: 'black',
        borderColor: '#ddd',
        borderWidth: 1,
    },
    button: {
        backgroundColor: '#1E90FF',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
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
        color: '#0D1B2A',
        fontSize: 14,
        textAlign: 'center',
    },
    signInLink: {
        color: '#1E90FF',
        fontWeight: '700',
        fontSize: 14,
    },
});

export default SignUpScreen;
