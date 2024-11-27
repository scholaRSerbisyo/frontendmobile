


  import * as React from 'react';
  import { View, Image, StyleSheet } from 'react-native';
  import { useNavigation } from '@react-navigation/native';
  import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
  import { Button } from '~/components/ui/button';
  import { Text } from '~/components/ui/text';
  import { Link } from 'expo-router';
  export default function LandingPage() {
      
  //   const navigation = useNavigation();

  //   const handleWelcomePress = () => {
  //     navigation.navigate('Login');
  //   };

    return (
      <View style={styles.container}>
        <Animated.View entering={FadeIn.delay(300).duration(1000)} style={styles.logoContainer}>
          <Image
            source={require('../assets/images/2nd-type-logo.png')}
            resizeMode="contain"
            style={styles.logo}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(800).duration(800)}>
          <Button
            style={styles.continueButton}          
          >
           <Link href= '/auth/Login'>
            <Text style={styles.continueButtonText}>Welcome Scholars</Text>
            </Link>
          </Button>
        </Animated.View>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      // alignItems: 'center',
      // padding: 24,
      backgroundColor: 'white', // Primary background color
    },
    logoContainer: {
      // flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    logo: {
      resizeMode: 'contain'
    },
    continueButton: {
      backgroundColor: '#FDB316',
      height: '25%',
      marginHorizontal: '10%',
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
    },
    continueButtonText: {
      color: '#191851',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
