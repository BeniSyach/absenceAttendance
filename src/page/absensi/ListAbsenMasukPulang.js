/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import {
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Alert,
  Modal,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import React, { useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Picker } from '@react-native-picker/picker';
import {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {absensi, logo_rsud} from '../../assets';
import { useSelector } from 'react-redux';
import * as Location from 'expo-location';
import * as LocalAuthentication from 'expo-local-authentication';
import axios from 'axios';

const ListAbsence = ({navigation, route}) => {
  const [selectJadwal, setSelectJadwal] = useState('');
  const TOKEN = useSelector(state => state.RefreshTokenReducer);
  const [refreshing, setRefreshing] = React.useState(false);
  const [jarak, setJarak] = useState('1');
  const [loading, setLoading] = useState(false);
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
      selectJadwal,
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
        `${process.env.EXPO_PUBLIC_API_URL}/absen/Tambah-AbsenMasuk`,
        {
          user_id: route.params.user_id,
          id_jadwalKerja: selectJadwal,
          // latitude_masuk: position.latitude,
          latitude_masuk: coords.latitude,
          longitude_masuk: coords.longitude,
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
        setLoading(false);
        Alert.alert(
          data.message,
          '',
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
      } else {
        setLoading(false);
        Alert.alert(
          data.message,
          '',
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
                navigation.replace('Main');
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
                navigation.replace('Main');
              },
            },
          ],
          {cancelable: false},
        );
      }

      setLoading(false);
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

  const toRadians = (degrees) => {
    return degrees * Math.PI / 180;
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

  const authCurrentAbsenKeluar = async () => {
    try {
      let result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Verifikasi identitas Anda',
          cancelLabel: 'Batal',
      });
      if (result.success) {
          console.log('Authentication successful');
          handleActionAbsenKeluar();
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

  const handleActionAbsenKeluar = async () => {
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
          sendDataAbsenKeluar(coords)
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

  const sendDataAbsenKeluar = async (coords) => {
    setLoading(true);
    console.log('senddata', '3');

    console.log('data mau dikirim ke server user id', route.params.user_id);
    console.log(
      'data mau dikirim ke server id jadwal kerja',
      selectJadwal,
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
          id_jadwalKerja: selectJadwal,
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

  console.log('status list absen', route.params);
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
        }
        >
        <View
          style={{
            flexDirection: 'row',
            marginTop: windowHeight * 0.06,
            marginBottom: windowHeight * 0.01,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={absensi}
            style={{
              width: 80,
              height: 70,
              marginEnd: 10,
              resizeMode: 'contain',
            }}
          />
          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: '#000000',
              marginTop: 10, // Sesuaikan sesuai kebutuhan
            }}>
            Absensi
          </Text>
        </View>
        <View
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            width: windowWidht * 0.9,
            height: windowHeight * 0.6,
            borderRadius: 40,
            alignItems: 'flex-start',
            backgroundColor: '#dadf00',
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.5)',
          }}>
          <View style={styles.inputselect}>
          <Picker
        style={{
          border: 1,
          width: windowWidht * 0.5,
          marginTop: -windowHeight * 0.02,
        }}
        selectedValue={selectJadwal}
        onValueChange={(itemValue) => setSelectJadwal(itemValue)}
      >
        <Picker.Item label="Pilih Jadwal" value={null} />
        {route.params.jadwal.map(item => (
          <Picker.Item key={item.id} label={item.nama} value={item.id} />
        ))}
      </Picker>
          </View>
          <View
            style={{
              flexDirection: 'column',
              marginTop: windowHeight * 0.01,
              marginBottom: windowHeight * 0.01,
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
            {route.params.status_absen == false ? (
              <TouchableOpacity
                disabled={jarak == '1' ? true : false}
                onPress={() => {
                  {
                    selectJadwal == ''
                      ? Alert.alert(
                          'Pilih Jadwal Terlebih Dahulu yaaa, Agar Bisa Absen',
                        )
                      : authCurrent();
                  }
                }}>
                <View style={[styles.cardContainer, {borderRadius: 40}]}>
                  <View style={styles.cardContent}>
                    <Icon
                      name="sign-in-alt"
                      size={windowHeight * 0.12}
                      color="#000000"
                    />

                    <Text
                      style={[
                        styles.cardText,
                        {color: '#000000', fontSize: windowWidht * 0.045, fontWeight: 'bold'},
                      ]}>
                      Absen Masuk
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity disabled={true}>
                <View style={[styles.cardContainer, {borderRadius: 40}]}>
                  <View style={styles.cardContent}>
                    <Icon
                      name="sign-in-alt"
                      size={windowHeight * 0.12}
                      color="#d3d3d3"
                    />

                    <Text
                      style={[
                        styles.cardText,
                        {color: '#d3d3d3', fontSize: windowWidht * 0.045, fontWeight: 'bold'},
                      ]}>
                      Anda Sudah Absen Masuk
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            {route.params.status_absen == true ? (
              <TouchableOpacity
                disabled={jarak == '1' ? true : false}
                onPress={() => {
                  {
                    selectJadwal == ''
                      ? Alert.alert(
                          'Pilih Jadwal Terlebih Dahulu yaaa, Agar Bisa Absen',
                        )
                      : authCurrentAbsenKeluar()
                  }
                }}>
                <View style={[styles.cardContainer, {borderRadius: 40}]}>
                  <View style={styles.cardContent}>
                    <Icon
                      name="sign-out-alt"
                      size={windowHeight * 0.12}
                      color="#000000"
                    />

                    <Text
                      style={[
                        styles.cardText,
                        {color: '#000000', fontSize: windowWidht * 0.045, fontWeight: 'bold'},
                      ]}>
                      Absen Pulang
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity disabled={true}>
                <View style={[styles.cardContainer, {borderRadius: 40}]}>
                  <View style={styles.cardContent}>
                    <Icon
                      name="sign-in-alt"
                      size={windowHeight * 0.12}
                      color="#d3d3d3"
                    />
                    <Text
                      style={[
                        styles.cardText,
                        {color: '#d3d3d3', fontSize: windowWidht * 0.045, fontWeight: 'bold'},
                      ]}>
                      Anda Belum Absen Pulang
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View
          style={{
            marginTop: windowHeight * 0.1,
            marginBottom: 'auto',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
          <Text
            style={{
              marginTop: 'auto',
              marginLeft: 'auto',
              fontSize: 18,
              alignItems: 'flex-end',
              color: 'black',
              fontWeight: 'bold'
            }}>
            © IT RSUD HAT{' '}
            <Image source={logo_rsud} style={{width: 20}}></Image>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
    </>
  );
};

export default ListAbsence;

const windowWidht = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  listMenu: {
    marginVertical: windowHeight * 0.01,
    width: windowWidht * 0.4,
    height: windowHeight * 0.044,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#00000030',
    marginLeft: 'auto',
    marginRight: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  btnTextSuccess: {
    backgroundColor: 'green',
    color: '#FFFFFF',
    fontSize: 18,
  },
  messageText: {
    color: '#000000',
    textAlign: 'center',
  },
  message: {
    width: windowWidht * 0.85,
    paddingVertical: windowHeight * 0.02,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: windowHeight * 0.03,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  inputselect: {
    alignItems: 'center',
    marginTop: windowHeight * 0.03,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  dropdown1BtnStyle: {
    width: windowWidht * 0.7,
    height: windowHeight * 0.043,
    backgroundColor: '#FFF',
    borderRadius: 0,
    borderWidth: 1,
    borderColor: '#444',
  },
  dropdown1BtnTxtStyle: {color: '#444', textAlign: 'left'},
  dropdown1DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdown1RowTxtStyle: {color: '#444', textAlign: 'left'},
  dropdown1SelectedRowStyle: {backgroundColor: 'rgba(0,0,0,0.1)'},
  dropdown1searchInputStyleStyle: {
    backgroundColor: '#EFEFEF',
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  cardContainer: {
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
    shadowOffset: {width: 1, height: 1},
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  cardContent: {
    alignItems: 'center',
    padding: 20,
  },
});
