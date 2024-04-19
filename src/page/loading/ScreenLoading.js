import React from 'react';
import {View, StyleSheet, StatusBar, Image, Dimensions, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {logo_dinkes} from '../../assets';

const ScreenLoading = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={{
          height: windowHeight * 0.2,
          width: windowWidht,
          resizeMode: 'contain',
        }}
        source={logo_dinkes}></Image>
      <ActivityIndicator size={48} color="#D3D3D3" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#18B2A2C4', // Ganti warna latar belakang sesuai kebutuhan Anda
  },
  centered: {
    alignItems: 'center',
  },
});

export default ScreenLoading;
const windowWidht = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
