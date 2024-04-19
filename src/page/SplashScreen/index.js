import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect} from 'react';
import {Alert, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import {
  SET_DATA_TOKEN,
  SET_DATA_USER,
  SET_DATA_REFRESH_TOKEN,
} from '../../redux/action';
import ScreenLoading from '../loading/ScreenLoading';

const SplashScreen = ({navigation}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    NetInfo.addEventListener(state => {
      const offline = !(state.isConnected && state.isInternetReachable);
      if (offline) {
        Alert.alert(
          'Masalah koneksi',
          'cek koneksi anda dan buka ulang aplikasi',
        );
      } else {
        console.log('ini di splashscreen');
        let isAmounted = false;
        if (!isAmounted) {
          Promise.all([
            getDataUser(),
            getDataToken(),
            getDataPermission(),
            getDataRefreshToken(),
          ])
            .then(response => {
              console.log('sudah login 1');
              if (response[0] !== null && response !== response[1]) {
                const user = response;
                console.log('data dari hp', user);
                console.log('data dari hp token', user[1]);
                console.log('data dari hp refresh token', user[3]);
                dispatch(SET_DATA_USER(user[0]));
                dispatch(SET_DATA_TOKEN(user[1]));
                dispatch(SET_DATA_REFRESH_TOKEN(user));
                storeDataToken(user[1]);
                storeDataUser(user[0]);
                storeDataRefreshToken(user[3]);
                navigation.replace('Main');
              } else {
                navigation.replace('Login');
              }
            })
            .catch(e => {
              setTimeout(() => {
                navigation.replace('Login');
              }, 2000);
              console.log('data local tidak dibaca');
            });
        }
        return () => {
          isAmounted = true;
        };
      }
    });
  }, []);

  const getDataUser = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@LocalUser');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
      // console.log('local user',jsonValue);
    } catch (e) {
      // error reading value
    }
  };

  const getDataToken = async () => {
    try {
      const value = await AsyncStorage.getItem('@LocalToken');
      if (value !== null) {
        return value;
      }
    } catch (e) {
      // error reading value
    }
  };

  const getDataRefreshToken = async () => {
    try {
      const value = await AsyncStorage.getItem('@LocalRefreshToken');
      if (value !== null) {
        return value;
      }
    } catch (e) {
      // error reading value
    }
  };

  const getDataPermission = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@LocalPermission');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };

  const storeDataUser = async value => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('@LocalUser', jsonValue);
    } catch (e) {
      console.log('no save');
    }
  };

  const storeDataToken = async value => {
    try {
      await AsyncStorage.setItem('@LocalToken', value);
    } catch (e) {
      console.log('TOken not Save ');
    }
  };

  const storeDataRefreshToken = async value => {
    try {
      await AsyncStorage.setItem('@LocalRefreshToken', value);
    } catch (e) {
      console.log('TOken not Save ');
    }
  };

  return <ScreenLoading />;
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});
export default SplashScreen;
