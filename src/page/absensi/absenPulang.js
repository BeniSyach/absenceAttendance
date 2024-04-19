/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Modal
} from 'react-native';
import React, {useEffect, useState} from 'react';
// import MapView, {Callout, Marker, Circle} from 'react-native-maps';
import {useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import axios from 'axios';
import {logo_rsud} from '../../assets';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Location from 'expo-location';

const AbsensiPulang = ({navigation, route}) => {
  const TOKEN = useSelector(state => state.RefreshTokenReducer);
  console.log('data dari hp', route.params);
  const [refreshing, setRefreshing] = React.useState(false);
  const [jarak, setJarak] = useState('1');
  const finger = 'ON';
  const [loading, setLoading] = useState(false);
  // const [location, setLocation] = useState(null);
  const latref = route.params.lat;
  const lngref = route.params.lng;

  useEffect(() => {
    console.log('route.params', route.params);
    getLocation();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getLocation();
    setRefreshing(false);
  }, []);

  const sendData = async (coords) => {
    setLoading(true);
    console.log('senddata', '3');

    console.log('data mau dikirim ke server user id', route.params.user_id);
    console.log(
      'data mau dikirim ke server id jadwal kerja',
      route.params.id_jadwalKerja,
    );
    console.log('data mau dikirim ke server latitude_masuk', coords.latitude);
    console.log('data mau dikirim ke server longitude_masuk', coords.longitude);
    try {
      const refreshResponse = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/token`,
        {
          headers: {
            Cookie: `refreshToken=${TOKEN}`,
          },
        },
      );
      const newToken = refreshResponse.data.akses_token;
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/absen/Tambah-AbsenPulang`,
        {
          user_id: route.params.user_id,
          id_jadwalKerja: route.params.id_jadwalKerja,
          // latitude_masuk: position.latitude,
          latitude_pulang: coords.latitude,
          longitude_pulang: coords.longitude,
          absen_masuk_id: route.params.absen_masuk_id,
        },
        {
          headers: {
            Authorization: `Bearer ${newToken}`,
            otherHeader: 'foo',
            Accept: 'application/json',
          },
        },
      );

      let data = response.data;
      if (data.data) {
        console.log(response);

        Alert.alert(
          data.message,
          '',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('Main');
              },
            },
          ],
          {cancelable: false},
        );
      } else {
   
        Alert.alert(
          data.message,
          '',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('Main');
              },
            },
          ],
          {cancelable: false},
        );
      }
    } catch (error) {
      // Handle errors
      if (axios.isAxiosError(error)) {
        // Axios specific error handling
        // console.error('Axios Error:', error.response?.data);
        Alert.alert(
          error.response?.data.message,
          '',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('Main');
              },
            },
          ],
          {cancelable: false},
        );
      } else {
        Alert.alert(
          error.message,
          '',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('Main');
              },
            },
          ],
          {cancelable: false},
        );
      }
    }
    setLoading(false);
  };

  const authCurrent = async () => {
    try {
      let result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Verifikasi identitas Anda',
          cancelLabel: 'Batal',
      });
      if (result.success) {
          console.log('Authentication successful');
          handleAction();
      } else {
          console.log('Authentication failed');
      }
  } catch (error) {
      console.error('Authentication error:', error);
      Alert.alert(
        'Error Fingerprint Atau Face ID !!!',
        'Handphone Anda Tidak Support Memakai Fingerprint atau Face ID.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.replace('Main');
            },
          },
        ],
        {cancelable: false},
      );
  }
  };


  const handleAction = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Izin lokasi tidak diberikan');
        return;
      }
      let { coords } = await Location.getCurrentPositionAsync({});
      const startCoords = { latitude: latref, longitude: lngref};
      const endCoords = { latitude: coords.latitude, longitude: coords.longitude }; 
      const desiredRadius = route.params.radius; 
      
      const distance = calculateDistance(startCoords, endCoords);
      
      if (distance <= desiredRadius) {
          console.log('Kedua titik berada dalam radius yang diinginkan.');
          setJarak('0');
          sendData(coords)
      } else {
          console.log('Kedua titik berada di luar radius yang diinginkan.');
          setJarak('1');
          Alert.alert(
            'Titik Lokasi !!!',
            'Lokasi Anda Berada Di Luar Radius.',
            [
              {
                text: 'OK',
                // onPress: () => {
                //   navigation.replace('Main');
                // },
              },
            ],
            {cancelable: false},
          );
      }
  } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert(
        'Gagal Mengambil Titik Lokasi !!!',
        'Silahkan Cek GPS Handphone Anda.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.replace('Main');
            },
          },
        ],
        {cancelable: false},
      );
  }
  };

  const calculateDistance = (startCoords, endCoords) => {
    const earthRadius = 6371e3; // Radius bumi dalam meter
    const { latitude: startLat, longitude: startLng } = startCoords;
    const { latitude: endLat, longitude: endLng } = endCoords;

    const dLat = toRadians(endLat - startLat);
    const dLng = toRadians(endLng - startLng);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(startLat)) * Math.cos(toRadians(endLat)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    return distance; // Jarak dalam meter
};

const toRadians = (degrees) => {
    return degrees * Math.PI / 180;
};

const getLocation = async () => {
  try{
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert(
      'Ijin Lokasi',
      'Ijin Lokasi Belum Di Berikan.',
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.replace('Main');
          },
        },
      ],
      {cancelable: false},
    );
    return;
  }

  let enabled = await Location.hasServicesEnabledAsync();
  if(enabled == false)
  {
    Alert.alert(
      'GPS Tidak Aktif',
      'Aktifkan GPS Anda',
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.replace('Main');
          },
        },
      ],
      {cancelable: false},
    );
  }else{
    try{
    let currentLocation = await Location.getCurrentPositionAsync({});
    if(currentLocation.mocked == true){
      Alert.alert(
        'Lokasi Palsu !!!',
        'Anda Menggunakan Lokasi Palsu.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.replace('Main');
            },
          },
        ],
        {cancelable: false},
      );
    }else{
      setLocation(currentLocation);
      const startCoords = { latitude: latref, longitude: lngref};
      const endCoords = { latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude }; 
      const desiredRadius = route.params.radius; 
      
      const distance = calculateDistance(startCoords, endCoords);
      
      if (distance <= desiredRadius) {
          console.log('Kedua titik berada dalam radius yang diinginkan.');
          setJarak('0');
      } else {
          console.log('Kedua titik berada di luar radius yang diinginkan.');
          setJarak('1');
          Alert.alert(
            'Titik Lokasi !!!',
            'Lokasi Anda Berada Di Luar Radius.',
            [
              {
                text: 'OK',
                // onPress: () => {
                //   navigation.replace('Main');
                // },
              },
            ],
            {cancelable: false},
          );
      }
    }
  }catch (error) {
    console.error("Error:", error);
    Alert.alert(
      'Gagal Mengambil Titik Lokasi !!!',
      'Silahkan Cek GPS Handphone Anda.',
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.replace('Main');
          },
        },
      ],
      {cancelable: false},
    );
  }
  }
}catch (error) {
  console.error("Error:", error);
  Alert.alert(
    'Gagal Mengambil Titik Lokasi !!!',
    'Silahkan Cek GPS Handphone Anda.',
    [
      {
        text: 'OK',
        onPress: () => {
          navigation.replace('Main');
        },
      },
    ],
    {cancelable: false},
  );
}
};

return (
  <>
      <View>
      {/* <Text style={styles.paragraph}>{text}</Text> */}
        <Modal visible={loading} animationType="slide" transparent>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 10,
              }}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text>Loading...</Text>
            </View>
          </View>
        </Modal>
      </View>
  <SafeAreaView style={{flex: 1, backgroundColor: '#4DC2B7'}}>
    <ScrollView
      scrollEnabled={true}
      contentContainerStyle={styles.scrollView}
      nestedScrollEnabled={true}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={{alignItems: 'center'}}>
      <Text
              style={[
                {marginVertical: windowHeight * 0.01, fontSize: windowWidht * 0.04, fontWeight: 'bold'},
                jarak == '1' ? {color: '#ff0000', fontSize: windowWidht * 0.04, fontWeight: 'bold'} : {color: 'black', backgroundColor: 'green', fontSize: windowWidht * 0.04, fontWeight: 'bold'},
              ]}>
              Anda Berada Di{' '}
              {jarak == '1' ? 'luar Jangkauan' : 'Dalam Jangkauan'}
            </Text>

            <Text style={[{marginVertical: windowHeight * 0.05, fontSize: windowWidht * 0.06, fontWeight: 'bold'}]}>
              Absen Pulang
            </Text>
          {/* {location ? (
        <View
        style={{
          height: windowHeight * 0.3,
          width: windowWidht * 0.8,
          backgroundColor: '#FFFFFF',
        }}>
        <MapView
          style={{flex: 1}}
          showsMyLocationButton={true}
          region={{
            latitude: parseFloat(latref),
            longitude: parseFloat(lngref),
            latitudeDelta: 0.00683,
            longitudeDelta: 0.0035,
          }}>
          <Circle
            center={{
              latitude: parseFloat(latref),
              longitude: parseFloat(lngref),
            }}
            radius={parseInt(route.params.radius)}
            strokeWidth={1}
            strokeColor="#ff0000"
            fillColor="#ff000030"
          />

          <Marker
            coordinate={{
              latitude: parseFloat(latref),
              longitude: parseFloat(lngref),
            }}>
            <Callout>
              <View>
                <Text>Posisi Kantor</Text>
              </View>
            </Callout>
          </Marker>
            <Marker
            pinColor={'blue'}
            coordinate={{
              latitude:  location && location.coords && location.coords.latitude,
              longitude: location && location.coords && location.coords.longitude,
            }}>
            <Callout>
              <View>
                <Text>Posisi Anda</Text>
              </View>
            </Callout>
          </Marker>
        </MapView>
      </View>
          ) : (
            <>
            <ActivityIndicator size="large" /> 
                <Text style={{fontSize: windowWidht * 0.06, fontWeight: 'bold'}}> Loading Maps.....</Text>
            </>
          )} */}
        {/* <Text style={[{marginVertical: windowHeight * 0.02, fontSize: windowWidht * 0.06, fontWeight: 'bold'}]}>Map Anda</Text> */}
      </View>
    </ScrollView>
    {jarak == '1' ? <TouchableOpacity
          style={[styles.btn]}>
          <Text style={{color: '#FFFFFF', fontSize: 24, fontWeight: 'bold'}}>
            Anda Berada diluar Lokasi
          </Text>
        </TouchableOpacity> : <TouchableOpacity
          style={[styles.btn]}
          onPress={() => {
            authCurrent();
          }}>
          <Text style={{color: '#FFFFFF', fontSize: 24, fontWeight: 'bold'}}>
            Absen
          </Text>
        </TouchableOpacity>}

    {jarak != 1 && route.params.fingerfrint == 'OFF' && finger == 'ON' && (
      <TouchableOpacity
        style={[styles.btn]}
        onPress={() => {
          handleAction();
        }}>
        <Text style={{color: '#FFFFFF', fontSize: 24, fontWeight: 'bold'}}>
          Absen
        </Text>
      </TouchableOpacity>
    )}

    {jarak != 1 && route.params.fingerfrint == 'ON' && finger == 'OFF' && (
      <TouchableOpacity
        style={[styles.btn]}
        onPress={() => {
          handleAction();
        }}>
        <Text style={{color: '#FFFFFF', fontSize: 24, fontWeight: 'bold'}}>
          Absen
        </Text>
      </TouchableOpacity>
    )}

    <View
      style={{
        marginTop: windowHeight * 0.15,
        marginBottom: 'auto',
        marginStart: 'auto',
        marginEnd: 'auto',
      }}>
      <Text
        style={{
          marginTop: 'auto',
          marginLeft: 'auto',
          fontSize: 18,
          alignItems: 'flex-end',
          color: '#000000',
          fontWeight: 'bold',
        }}>
        © IT RSUD HAT{' '}
        <Image source={logo_rsud} style={{width: 20}}></Image>
      </Text>
    </View>
  </SafeAreaView>
  </>
);
};

export default AbsensiPulang;

const windowWidht = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  mapS: {
    width: windowWidht * 0.8,
    height: windowHeight * 0.25,
    backgroundColor: '#FFFFFF',
  },
  image: {
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidht * 0.7,
    height: windowWidht * 1.0,
    backgroundColor: '#00000010',
  },
  btn: {
    width: windowWidht * 0.76,
    height: windowHeight * 0.07,
    backgroundColor: '#00B2FF',
    marginLeft: 'auto',
    marginRight: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
