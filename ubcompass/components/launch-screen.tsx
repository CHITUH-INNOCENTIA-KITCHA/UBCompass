import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

export function LaunchScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/splash-ubcompass.png')}
        style={styles.image}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#006400',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
