/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Arsip, group, history, logo_dinkes, logo_rsud} from '../../assets';
import {useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

const Home = ({navigation}) => {
  const REFRESHTOKEN = useSelector(state => state.RefreshTokenReducer);
  const USER = useSelector(state => state.UserReducer);
  const [data, setData] = useState({});
  console.log('ini data di home', data);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      getData();
      getLocationPermission();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getData();
    getLocationPermission();
    setRefreshing(false);
  }, []);

  const getLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Ijin Lokasi',
        'Ijin Lokasi Belum Di Berikan.',
        [
          {
            text: 'OK',
            onPress: () => {
              AsyncStorage.clear();
              navigation.replace('Login');
            },
          },
        ],
        {cancelable: false},
      );
    }else{
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
                AsyncStorage.clear();
                navigation.replace('Login');
              },
            },
          ],
          {cancelable: false},
        );
      }
    }
  };

  const getData = async () => {
    setLoading(true);
    console.log('get data id home', USER.userId);
    console.log('token hp depan', REFRESHTOKEN);
    const refreshResponse = await axios.get(
      `${process.env.EXPO_PUBLIC_API_URL}/auth/token`,
      {
        headers: {
          Cookie: `refreshToken=${REFRESHTOKEN}`,
        },
      },
    );
    const newToken = refreshResponse.data.akses_token;
    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/${process.env.EXPO_PUBLIC_API_MENU}/${USER.userId}`,
        {
          headers: {
            Authorization: `Bearer ${newToken}`,
            otherHeader: 'foo',
            Accept: 'application/json',
          },
        },
      );
      console.log('data response home', response.data)
      if(response.data.status == "error"){
        Alert.alert(
          'Sesi Berakhir',
          'Silahkan Login Ulang Kembali',
          [
            {
              text: 'OK',
              onPress:() =>{
                AsyncStorage.clear();
                navigation.replace('Login');
              }
            }
          ],
          {
            cancelable: false
          }
        )
      }else{
        setData(response.data)
      }
      }catch(e){
        console.log('kesalahan', e.message);
        Alert.alert(
          'Sesi Berakhir',
          'Silahkan Login Ulang Kembali',
          [
            {
              text: 'OK',
              onPress:() =>{
                AsyncStorage.clear();
                navigation.replace('Login');
              }
            }
          ],
          {
            cancelable: false
          }
        )
      }
    setLoading(false);
  };

  const fotoUrl = `https://absensidinkes.deliserdangkab.go.id/uploads/img/profil/${data && data.UsersById && data.UsersById.foto}`;
  console.log('data foto di home', fotoUrl);

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
        <SafeAreaView style={{flex: 1, backgroundColor: '#AFA3A3'}}>
          <ScrollView
            scrollEnabled={true}
            contentContainerStyle={styles.scrollView}
            nestedScrollEnabled={true}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <View style={{backgroundColor: '#4DC2B7', width: windowWidht * 1}}>
              <View
                style={{
                  flexDirection: 'row',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  width: windowWidht * 0.85,
                  marginBottom: windowHeight * 0.02,
                  marginTop: windowHeight * 0.02,
                }}>
                <View>
                  <Image
                    source={logo_dinkes}
                    style={[
                      styles.iconRadius1,
                      {resizeMode: 'contain'},
                    ]}></Image>
                </View>
                <View
                  style={{
                    marginLeft: windowHeight * 0.01,
                    marginRight: windowHeight * 0.01,
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      marginLeft: windowWidht * 0.01,
                      marginRight: windowWidht * 0.1,
                      textAlign: 'center',
                      fontSize: windowWidht * 0.035,
                    }}>
                    Selamat Datang di Aplikasi
                  </Text>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      marginLeft: windowWidht * 0.02,
                      marginRight: windowWidht * 0.1,
                      textAlign: 'center',
                      fontSize: windowWidht * 0.035,
                    }}>
                    Absensi Dinas Kesehatan Deli Serdang
                  </Text>
                </View>
                <TouchableOpacity
                  style={{marginLeft: 'auto', marginTop: windowHeight * 0.01}}
                  // onPress={() => {
                  //   navigation.navigate('message', {
                  //     lat:
                  //       data &&
                  //       data.UsersById &&
                  //       data.UsersById.puskesmas &&
                  //       data.UsersById.puskesmas.lat,
                  //     lng:
                  //       data &&
                  //       data.UsersById &&
                  //       data.UsersById.puskesmas &&
                  //       data.UsersById.puskesmas.lng,
                  //     radius:
                  //       data &&
                  //       data.UsersById &&
                  //       data.UsersById.puskesmas &&
                  //       data.UsersById.puskesmas.radius,
                  //   });
                  // }}
                >
                  <Icon
                    name="bell"
                    size={windowHeight * 0.04}
                    color="#000000"
                    solid
                  />
                  {/* {data.messageCount != '' && (
                    <View
                      style={{
                        justifyContent: 'center',
                        marginTop: -40,
                        backgroundColor: 'red',
                        width: windowWidht * 0.05,
                        height: windowWidht * 0.05,
                        borderRadius: (windowWidht * 0.05) / 2,
                      }}>
                      <Text
                        style={{
                          color: '#FFFFFF',
                          textAlign: 'center',
                          fontSize: 10,
                        }}>
                        {data.messageCount}
                      </Text>
                    </View>
                  )} */}
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  // width: windowWidht * 0.85,
                  marginBottom: windowHeight * 0.02,
                  marginTop: windowHeight * 0.01,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 60,
                    width: windowWidht * 5,
                    left: 0,
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('User', {screen: 'User'})
                    }>
                    {data && data.UsersById && data.UsersById.foto == null ? (
                      <Image
                        style={styles.iconRadius}
                        source={{
                          uri: `https://i.pinimg.com/236x/56/2e/be/562ebed9cd49b9a09baa35eddfe86b00.jpg`,
                        }}
                      />
                    ) : (
                      <Image
                        style={styles.iconRadius11}
                        source={{uri: fotoUrl}}
                      />
                    )}
                  </TouchableOpacity>

                  <View
                    style={{
                      marginLeft: windowHeight * 0.01,
                      marginRight: windowHeight * 0.1,
                    }}>
                    <Text
                      style={{
                        color: '#000000',
                        fontSize: windowWidht * 0.05,
                        fontWeight: 'bold',
                      }}>
                      {data && data.UsersById && data.UsersById.nama}
                    </Text>
                    <Text
                      style={{
                        color: '#000000',
                        fontSize: windowWidht * 0.04,
                        fontWeight: 'bold',
                      }}>
                      {data &&
                        data.UsersById &&
                        data.UsersById.puskesmas &&
                        data.UsersById.puskesmas.nama}
                    </Text>
                    <Text
                      style={{
                        color: '#000000',
                        fontWeight: 'bold',
                        fontSize: windowWidht * 0.035,
                      }}>
                      {data && data.UsersById && data.UsersById.status}
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: '#AFA3A3',
                  borderTopLeftRadius: 60,
                  borderTopRightRadius: 30,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    width: windowWidht * 0.8,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: windowHeight * 0.03,
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('ListAbsence', {
                        fingerfrint: data && data.fingerfrint,
                        selfie: data && data.selfie,
                        lat:
                          data &&
                          data.UsersById &&
                          data.UsersById.puskesmas &&
                          data.UsersById.puskesmas.lat,
                        lng:
                          data &&
                          data.UsersById &&
                          data.UsersById.puskesmas &&
                          data.UsersById.puskesmas.lng,
                        radius:
                          data &&
                          data.UsersById &&
                          data.UsersById.puskesmas &&
                          data.UsersById.puskesmas.radius,
                        user_id: USER.userId,
                        jadwal:
                          data &&
                          data.UsersById &&
                          data.UsersById.shift &&
                          data.UsersById.shift.jadwal_kerja,
                        status_absen: data && data.status_absen,
                        absen_masuk_id: data.id_absen_masuk || 0,
                        // id_absen_masuk:
                      })
                    }>
                    <View style={[styles.cardContainer, {borderRadius: 40}]}>
                      <View style={styles.cardContent}>
                        <Icon
                          name="fingerprint"
                          size={windowHeight * 0.1}
                          color="#000000"
                        />

                        <Text style={[styles.cardText, {color: '#000000'}]}>
                          Absensi
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Request')}>
                    <View style={[styles.cardContainer, {borderRadius: 40}]}>
                      <View style={styles.cardContent}>
                        <Image
                          source={group}
                          style={{
                            width: windowWidht * 0.19,
                            height: windowHeight * 0.1,
                            resizeMode: 'contain',
                          }}></Image>

                        <Text style={[styles.cardText, {color: '#000000'}]}>
                          Pengajuan
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                {/* row 2 */}
                <View
                  style={{
                    flexDirection: 'row',
                    width: windowWidht * 0.8,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: windowHeight * 0.03,
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('ListHistory', {
                        type: data && data.role && data.role.nama,
                      })
                    }>
                    <View style={[styles.cardContainer, {borderRadius: 40}]}>
                      <View style={styles.cardContent}>
                        <Image
                          source={history}
                          style={{
                            width: windowWidht * 0.2,
                            height: windowHeight * 0.1,
                            resizeMode: 'contain',
                          }}></Image>

                        <Text style={[styles.cardText, {color: '#000000'}]}>
                          Histori
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Holiday')}>
                    <View style={[styles.cardContainer, {borderRadius: 40}]}>
                      <View style={styles.cardContent}>
                        <Image
                          source={Arsip}
                          style={{
                            width: windowWidht * 0.2,
                            height: windowHeight * 0.1,
                            resizeMode: 'contain',
                          }}></Image>

                        <Text style={[styles.cardText, {color: '#000000'}]}>
                          Arsip Berkas
                        </Text>
                        <Text style={[styles.cardText, {color: '#000000'}]}>
                          SPT
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View
              style={{
                backgroundColor: '#AFA3A3',
              }}>
              <Text
                style={[styles.cardText, {color: '#000000', marginBottom: 10}]}>
                Statistik Absensi Anda
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#AFA3A3',
                  marginLeft: 10,
                }}>
                <View
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 30,
                    marginLeft: 10,
                    marginRight: 10,
                    height: windowHeight * 0.1,
                    width: windowWidht * 0.45,
                  }}>
                  <TouchableOpacity>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        marginTop: windowHeight * 0.01,
                      }}>
                      <Text
                        style={{
                          fontSize: windowWidht * 0.08,
                          color: '#000000',
                          fontWeight: 'bold',
                          marginRight: windowWidht * 0.05,
                        }}>
                        {data && data.totalTelatMasuk}
                      </Text>
                      <Icon name="user" size={40} />
                    </View>
                    <View>
                      <Text style={[styles.cardText1, {color: '#000000'}]}>
                        Telat Masuk (Hari Ini)
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 30,
                    marginLeft: 10,
                    marginRight: 10,
                    height: windowHeight * 0.1,
                    width: windowWidht * 0.45,
                  }}>
                  <TouchableOpacity>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        marginTop: windowHeight * 0.01,
                      }}>
                      <Text
                        style={{
                          fontSize: windowWidht * 0.08,
                          color: '#000000',
                          fontWeight: 'bold',
                          marginRight: windowWidht * 0.05,
                        }}>
                        {data && data.totalTepatMasuk}
                      </Text>
                      <Icon name="user" size={40} />
                    </View>
                    <View>
                      <Text style={[styles.cardText1, {color: '#000000'}]}>
                        Tepat Masuk (Hari Ini)
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 30,
                    marginLeft: 10,
                    marginRight: 10,
                    height: windowHeight * 0.1,
                    width: windowWidht * 0.45,
                  }}>
                  <TouchableOpacity>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        marginTop: windowHeight * 0.01,
                      }}>
                      <Text
                        style={{
                          fontSize: windowWidht * 0.08,
                          color: '#000000',
                          fontWeight: 'bold',
                          marginRight: windowWidht * 0.05,
                        }}>
                        {data && data.totalCepatPulang}
                      </Text>
                      <Icon name="user" size={40} />
                    </View>
                    <View>
                      <Text style={[styles.cardText1, {color: '#000000'}]}>
                        Cepat Pulang (Hari Ini)
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 30,
                    marginLeft: 10,
                    marginRight: 10,
                    height: windowHeight * 0.1,
                    width: windowWidht * 0.45,
                  }}>
                  <TouchableOpacity>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        marginTop: windowHeight * 0.01,
                      }}>
                      <Text
                        style={{
                          fontSize: windowWidht * 0.08,
                          color: '#000000',
                          fontWeight: 'bold',
                          marginRight: windowWidht * 0.05,
                        }}>
                        {data && data.totalTepatPulang}
                      </Text>
                      <Icon name="user" size={40} />
                    </View>
                    <View>
                      <Text style={[styles.cardText1, {color: '#000000'}]}>
                        Tepat Pulang (Hari Ini)
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
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
          </ScrollView>
        </SafeAreaView>
      </>
    );
};

export default Home;

const windowWidht = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
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
  button: {
    // Gaya tombol Anda yang sudah ada
    padding: 10,
    borderRadius: 5,
  },
  cardText: {
    textAlign: 'center',
    marginTop: 5,
    fontSize: windowWidht * 0.04,
    fontWeight: 'bold',
  },
  cardText1: {
    textAlign: 'center',
    marginTop: 5,
    fontSize: windowWidht * 0.035,
    fontWeight: 'bold',
  },
  btnRadius: {
    backgroundColor: '#D9D9D9',
    width: windowWidht * 0.15,
    height: windowWidht * 0.15,
    borderRadius: (windowWidht * 0.15) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRadius1: {
    width: windowWidht * 0.11,
    height: windowWidht * 0.15,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  iconRadius: {
    width: windowWidht * 0.18,
    height: windowWidht * 0.18,
    borderRadius: (windowWidht * 0.3) / 2,
    resizeMode: 'contain',
  },
  iconRadius11: {
    width: windowWidht * 0.18,
    height: windowWidht * 0.18,
    borderRadius: (windowWidht * 0.3) / 2,
    resizeMode: 'cover',
  },
  floatingView: {
    // borderWidth: 2,
    // borderColor: '#00000020',
    width: windowWidht * 0.675,
    height: windowHeight * 0.1,
    // backgroundColor: '#FFFFFF',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: -windowHeight * 0.01,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    height: windowHeight * 0.35,
    elevation: 5,
    backgroundColor: '#FFFFFF',
    paddingBottom: windowHeight * 0.02,
  },
  month1: {
    alignItems: 'center',
    marginRight: 'auto',
    marginTop: 'auto',
    marginLeft: windowWidht * 0.05,
  },
  month2: {
    alignItems: 'center',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginTop: 'auto',
  },
  month3: {
    alignItems: 'center',
    marginLeft: 'auto',
    marginTop: 'auto',
    marginRight: windowWidht * 0.05,
  },
  chart: {
    backgroundColor: '#FFE600',
    width: windowWidht * 0.22,
    height: windowHeight * 0.28 * 0.5,
  },
  textMonth: {
    color: '#FFFFFF',
    marginBottom: 'auto',
    marginLeft: 'auto',
    marginTop: 'auto',
    marginRight: 'auto',
  },
});
