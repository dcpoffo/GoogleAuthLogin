import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ToastAndroid,
  Image,
} from 'react-native';

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [user, setUser] = useState<{
    email: string;
    name: string;
    picture: string;
  } | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "164987342206-hptbq9h2oa5g2f9u7kac8l2802hl1sv6.apps.googleusercontent.com",
    androidClientId: "164987342206-2297ss8qm783qnkgs020on6cgnoamhcg.apps.googleusercontent.com",
  })

  const callAuthGoogle = () => {
    promptAsync();
  }

  const getUserInfo = async () => {
    if (response) {
      switch (response.type) {
        case 'error':
          ToastAndroid.show('Houve um erro', ToastAndroid.SHORT);
          break;
        case 'cancel':
          ToastAndroid.show('Login cancelaro', ToastAndroid.SHORT);
          break;
        case 'success':
          try {
            const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
              headers: {
                Authorization: `Bearer ${response.authentication?.accessToken}`,
              },
            });

            const userLogin = await res.json();
            setUser(userLogin);

          } catch (error) { 
            console.warn('Erro');            
          }
          break;
        default:
          () => { }

      }
    }
  };

  useEffect(() => {
    getUserInfo();
  }, [response])

  if (user) {
    return (
      <View style={styles.container}>
        <Text
          style={{
            fontSize: 20,
            marginBottom: 10,
          }}
        >
          Seja Bem Vindo ✌
        </Text>
        <Image
          source={{
            uri: user.picture,
            width: 70,
            height: 70,
          }}
          borderRadius={40}
        />
        <Text
          style={{
            marginTop: 10,
            fontSize: 17,
          }}
        >
          {user.name}
        </Text>
        <Text
          style={{
            marginBottom: 20,
          }}
        >
          {user.email}
        </Text>
        <Button title='Sair' onPress={() => setUser(null)} />
        <StatusBar style='auto' />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login com Google</Text>
      <Button title='Entrar' disabled={!request} onPress={callAuthGoogle} />
      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: 10,
    fontSize: 20,
  },
});
