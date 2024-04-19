/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  RefreshControl,
  TextInput,
  ScrollView,
  Modal,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {useSelector} from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import {useState} from 'react';
import {useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Picker } from '@react-native-picker/picker';
import {
  email,
  gender,
  home,
  key,
  location,
  logo_rsud,
  nama,
  phone,
  shift,
  user,
} from '../../assets';
import axios from 'axios';

const User = ({navigation}) => {
  const [visible, setVisible] = useState(true);
  const TOKEN = useSelector(state => state.RefreshTokenReducer);
  const USER = useSelector(state => state.UserReducer);
  const [data, setData] = useState({});
  const [refreshing, setRefreshing] = React.useState(false);
  const [dataShift, setDataShift] = useState([]);
  // const [imageUri, setImageUri] = useState('');
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    email: data.email,
    password: data.password,
    password2: data.password,
    hp: data.no_hp,
    alamat: data.alamat,
    nik: data.nik,
    nama: data.nama,
    puskesmas: data.id_puskesmas,
    gender: data.gender,
    shift: data.id_shift,
    agama: data.id_agama,
    status: data.status,
  });

  const getData = async () => {
    setLoading(true)
    try{
    const refreshResponse = await axios.get(
      `${process.env.EXPO_PUBLIC_API_URL}/auth/token`,
      {
        headers: {
          Cookie: `refreshToken=${TOKEN}`,
        },
      },
    );
    const newToken = refreshResponse.data.akses_token;
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/${process.env.EXPO_PUBLIC_API_MENU}/${USER.userId}`,
        {
          headers: {
            Authorization: `Bearer ${newToken}`,
            otherHeader: 'foo',
            Accept: 'application/json',
          },
        },
      );
      if (response.data.status != false) {
        console.log('data2', response.data.UsersById);
        setData(response.data.UsersById);
        // setLoading(false)
      } else {
        Alert.alert(response.data.message);
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
  setLoading(false)
  };

  const getDataShift = async () => {
    try{
    const refreshResponse = await axios.get(
      `${process.env.EXPO_PUBLIC_API_URL}/auth/token`,
      {
        headers: {
          Cookie: `refreshToken=${TOKEN}`,
        },
      },
    );
    const newToken = refreshResponse.data.akses_token;
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/${process.env.EXPO_PUBLIC_API_SHIFT}`,{},
        {
          headers: {
            Authorization: `Bearer ${newToken}`,
            otherHeader: 'foo',
            Accept: 'application/json',
          },
        },
      );
      if (response) {
        console.log('data shift api', response.data);
        setDataShift(response.data);
        // setLoading(false)
      } else {
        Alert.alert(response.data.message);
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
  };

  console.log('data shift', dataShift);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getData();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    getData();
    getDataShift();
  }, []);

  const editDataUser = async () => {
    if (form.shift == null || form.shift == '') {
      Alert.alert(
        'Silahkan Pilih data Shift',
        '',
        [
          {
            text: 'OK',
          },
        ],
        {cancelable: false},
      );
    } else {
      setLoading(true)
      try {
        // Refresh the token
        const refreshResponse = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/auth/token`,
          {
            headers: {
              Cookie: `refreshToken=${TOKEN}`,
            },
          },
        );

        const newToken = refreshResponse.data.akses_token;

        // Prepare form data with file and other field

        // Upload the file with the refreshed token
        const req = await axios.put(
          `${process.env.EXPO_PUBLIC_API_URL}/users/edit-users`,
          {
            id: USER.userId.toString(),
            nama: form.nama,
            email: form.email,
            nik: form.nik,
            no_hp: form.hp,
            alamat: form.alamat,
            gender: form.gender,
            id_puskesmas: form.puskesmas,
            id_agama: form.agama,
            id_shift: form.shift,
            status: form.status,
          },
          {
            headers: {
              Authorization: `Bearer ${newToken}`,
            },
          },
        );

        console.log('File uploaded successfully:', req.data);
        const {status, message} = req.data;
        if (status == false) {
          Alert.alert(
            message,
            '',
            [
              {
                text: 'OK',
              },
            ],
            {cancelable: false},
          );
        } else {
          Alert.alert(
            'Sukses Mengubah Profil Anda',
            '',
            [
              {
                text: 'OK',
              },
            ],
            {cancelable: false},
          );
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        Alert.alert('Gagal Mengubah Profil Anda');
      }
      setLoading(false)
    }
  };

  const editDataPassword = async () => {
    if (
      form.password == null ||
      form.password == '' ||
      form.password2 == null ||
      form.password2 == ''
    ) {
      Alert.alert(
        'Silahkan input password terlebih dahulu',
        '',
        [
          {
            text: 'OK',
          },
        ],
        {cancelable: false},
      );
    } else if (form.password === form.password2) {
      setLoading(true)
      try {
        // Refresh the token
        const refreshResponse = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/auth/token`,
          {
            headers: {
              Cookie: `refreshToken=${TOKEN}`,
            },
          },
        );

        const newToken = refreshResponse.data.akses_token;

        // Prepare form data with file and other field

        // Upload the file with the refreshed token
        const req = await axios.put(
          `${process.env.EXPO_PUBLIC_API_URL}/users/edit-password-users`,
          {
            id: USER.userId.toString(),
            password: form.password,
            password2: form.password2,
          },
          {
            headers: {
              Authorization: `Bearer ${newToken}`,
            },
          },
        );

        console.log('File uploaded successfully:', req.data);
        const {status, message} = req.data;
        if (status == false) {
          Alert.alert(
            message,
            '',
            [
              {
                text: 'OK',
              },
            ],
            {cancelable: false},
          );
        } else {
          Alert.alert(
            'Sukses Mengubah Profil Anda',
            '',
            [
              {
                text: 'OK',
              },
            ],
            {cancelable: false},
          );
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        Alert.alert('Gagal Mengubah Profil Anda');
      }
      setLoading(false)
    } else {
      Alert.alert(
        'Ubah Password Gagal',
        '',
        [
          {
            text: 'OK',
          },
        ],
        {cancelable: false},
      );
    }
  };

  const logout = async () => {
    setLoading(true)
    try {
      // Refresh the token
      const refreshResponse = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/token`,
        {
          headers: {
            Cookie: `refreshToken=${TOKEN}`,
          },
        },
      );

      const newToken = refreshResponse.data.akses_token;

      // Prepare form data with file and other field

      // Upload the file with the refreshed token
      const req = await axios.delete(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/logout`,
        {
          headers: {
            Authorization: `Bearer ${newToken}`,
            Cookie: `refreshToken=${TOKEN}`,
          },
        },
      );

      const {status} = req.data;
      if (status == true) {
        setLoading(false)
        AsyncStorage.clear();
        navigation.navigate('Login');
      } else {
        Alert.alert('Gagal Logout');
      }
    } catch (error) {
      console.error('Error Logout:', error);
      Alert.alert('Gagal Logout');
    }
    setLoading(false)
  };

  const getImageCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Izin kamera diperlukan untuk mengambil foto.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    console.log('upload foto', result)

    if (result.canceled == false) {
      // setImageUri(result.assets[0].uri);
      setLoading(true);
      try {
        // Refresh the token
        const refreshResponse = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/auth/token`,
          {
            headers: {
              Cookie: `refreshToken=${TOKEN}`,
            },
          },
        );

        const newToken = refreshResponse.data.akses_token;

        // Prepare form data with file and other fields
        const formData = new FormData();
        formData.append('id', USER.userId);
        formData.append('photo', {
          uri: result.assets[0].uri,
          type: result.assets[0].mimeType,
          name: result.assets[0].fileName, 
        });

        // Upload the file with the refreshed token
        const req = await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}/users/edit-foto-users`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${newToken}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        console.log('File uploaded successfully:', req.data);
        Alert.alert(
          'Sukses Mengganti Foto Profile',
          '',
          [
            {
              text: 'OK',
              onPress:() =>{
                getData()
              }
            },
          ],
          { cancelable: false },
        );
        setLoading(false)
      } catch (error) {
        console.error('Error uploading file:', error);
        Alert.alert('Gagal Mengganti Foto Profil');
        setLoading(false)
      }
    } else {
      Alert.alert('Mohon Lengkapi data');
      setLoading(false)
    }
  };

  const fotoUrl = `http://103.114.111.178:3035/uploads/img/profil/${data.foto}`;
  console.log('data foto', fotoUrl);
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
              <TouchableOpacity onPress={() => getImageCamera()}>
                {data.foto == '' ||
                data.foto == null ||
                data.foto == undefined ? (
                  <View style={styles.image}>
                    <Icon
                      name="camera-retro"
                      size={windowHeight * 0.08}
                      color="#000000"
                    />
                  </View>
                ) : (
                  <Image style={styles.image1} source={{uri: fotoUrl}} />
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.floatingScreen}>
              <View
                style={{
                  flexDirection: 'row',
                  width: windowWidht * 0.5,
                  marginHorizontal: windowWidht * 0.1,
                  marginBottom: 20,
                  marginTop: windowHeight * 0.03,
                }}>
                <Image
                  source={key}
                  style={{
                    width: windowWidht * 0.05,
                    height: windowHeight * 0.02,
                    resizeMode: 'contain',
                  }}
                />
                <TextInput
                  style={styles.formInput}
                  placeholder="Masukan Password"
                  secureTextEntry={visible}
                  onChangeText={item => setForm({...form, password: item})}
                />
                <TouchableOpacity
                  onPress={() => {
                    !visible ? setVisible(true) : setVisible(false);
                  }}>
                  {!visible && (
                    <Icon
                      name="eye-slash"
                      size={windowHeight * 0.03}
                      color="#000000"
                    />
                  )}
                  {visible && (
                    <Icon name="eye" size={windowHeight * 0.03} color="#000000" />
                  )}
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  width: windowWidht * 0.5,
                  marginHorizontal: windowWidht * 0.03,
                }}>
                <Image
                  source={key}
                  style={{
                    width: windowWidht * 0.05,
                    height: windowHeight * 0.02,
                    resizeMode: 'contain',
                  }}
                />
                <TextInput
                  style={styles.formInput}
                  placeholder="Konfirmasi Password"
                  secureTextEntry={visible}
                  onChangeText={item => setForm({...form, password2: item})}
                />
                <TouchableOpacity
                  onPress={() => {
                    !visible ? setVisible(true) : setVisible(false);
                  }}>
                  {!visible && (
                    <Icon
                      name="eye-slash"
                      size={windowHeight * 0.03}
                      color="#000000"
                    />
                  )}
                  {visible && (
                    <Icon name="eye" size={windowHeight * 0.03} color="#000000" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              width: windowWidht * 0.9,
              height: windowHeight * 0.29,
              borderRadius: 40,
              alignItems: 'flex-start',
              backgroundColor: '#dadf00',
              borderWidth: 1,
              marginBottom: 20,
              borderColor: 'rgba(0,0,0,0.5)',
            }}>
            <View
              style={{
                flexDirection: 'row',
                width: windowWidht * 0.5,
                marginHorizontal: windowWidht * 0.03,
                marginBottom: 20,
                marginTop: windowHeight * 0.03,
              }}>
              <Image
                source={user}
                style={{
                  width: windowWidht * 0.05,
                  height: windowHeight * 0.02,
                  resizeMode: 'contain',
                }}
              />
              <TextInput
                style={styles.formInput1}
                placeholder="Masukan Nik"
                defaultValue={data.nik}
                onChangeText={item => setForm({...form, nik: item})}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: windowWidht * 0.5,
                marginHorizontal: windowWidht * 0.03,
              }}>
              <Image
                source={nama}
                style={{
                  width: windowWidht * 0.05,
                  height: windowHeight * 0.02,
                  resizeMode: 'contain',
                }}
              />
              <TextInput
                style={styles.formInput1}
                placeholder="Masukkan nama"
                defaultValue={data.nama}
                onChangeText={item => setForm({...form, nama: item})}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: windowWidht * 0.5,
                marginHorizontal: windowWidht * 0.03,
                marginBottom: 20,
                marginTop: windowHeight * 0.03,
              }}>
              <Image
                source={home}
                style={{
                  width: windowWidht * 0.05,
                  height: windowHeight * 0.02,
                  resizeMode: 'contain',
                }}
              />
              <TextInput
                style={styles.formInput1}
                placeholder="Masukkan Alamat"
                defaultValue={data.alamat}
                onChangeText={item => setForm({...form, alamat: item})}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: windowWidht * 0.5,
                marginHorizontal: windowWidht * 0.03,
              }}>
              <Image
                source={phone}
                style={{
                  width: windowWidht * 0.05,
                  height: windowHeight * 0.02,
                  resizeMode: 'contain',
                }}
              />
              <TextInput
                style={styles.formInput1}
                placeholder="Masukkan No Hp"
                defaultValue={data.no_hp}
                onChangeText={item => setForm({...form, hp: item})}
              />
            </View>
          </View>
          <View
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              width: windowWidht * 0.9,
              height: windowHeight * 0.22,
              borderRadius: 40,
              alignItems: 'flex-start',
              backgroundColor: '#dadf00',
              borderWidth: 1,
              marginBottom: 20,
              borderColor: 'rgba(0,0,0,0.5)',
            }}>
            <View
              style={{
                flexDirection: 'row',
                width: windowWidht * 0.5,
                marginHorizontal: windowWidht * 0.03,
                marginBottom: 20,
                marginTop: windowHeight * 0.03,
              }}>
              <Image
                source={email}
                style={{
                  width: windowWidht * 0.05,
                  height: windowHeight * 0.02,
                  resizeMode: 'contain',
                }}
              />
              <TextInput
                style={styles.formInput1}
                placeholder="Masukan Email"
                defaultValue={data.email}
                onChangeText={item => setForm({...form, email: item})}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: windowWidht * 0.5,
                marginHorizontal: windowWidht * 0.03,
              }}>
              <Image
                source={location}
                style={{
                  width: windowWidht * 0.05,
                  height: windowHeight * 0.02,
                  resizeMode: 'contain',
                }}
              />
              <TextInput
                style={styles.formInput1}
                placeholder="masukkan nama puskesmas"
                defaultValue={data && data.puskesmas && data.puskesmas.nama}
                onChangeText={item => setForm({...form, puskesmas: item})}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: windowWidht * 0.5,
                marginHorizontal: windowWidht * 0.03,
                marginBottom: 20,
                marginTop: windowHeight * 0.03,
              }}>
              <Image
                source={gender}
                style={{
                  width: windowWidht * 0.05,
                  height: windowHeight * 0.02,
                  resizeMode: 'contain',
                }}
              />
              <TextInput
                style={styles.formInput1}
                placeholder="Masukkan Jenis Kelamin"
                defaultValue={data.gender}
                onChangeText={item => setForm({...form, gender: item})}
              />
            </View>
          </View>
          <View
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              width: windowWidht * 0.9,
              height: windowHeight * 0.08,
              borderRadius: 40,
              alignItems: 'flex-start',
              backgroundColor: '#dadf00',
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.5)',
            }}>
            <View
              style={{
                flexDirection: 'row',
                width: windowWidht * 0.5,
                marginHorizontal: windowWidht * 0.03,
                marginBottom: 20,
                marginTop: windowHeight * 0.03,
              }}>
              <Image
                source={shift}
                style={{
                  width: windowWidht * 0.05,
                  height: windowHeight * 0.02,
                  resizeMode: 'contain',
                }}
              />
          <Picker
          style={{
            border: 1,
            width: windowWidht * 0.4,
            marginTop: -windowHeight * 0.02,
            borderBottomColor: 'grey',
            marginLeft: windowWidht * 0.05,
            fontSize: 16,
          }}
          selectedValue={form.shift}
          onValueChange={(itemValue) => setForm({...form, shift: itemValue})}
        >
          {console.log('data shift dipilih',form.shift)}
          <Picker.Item label="Pilih Jadwal" value={null} />
          {dataShift.map(item => (
            <Picker.Item key={item.id} label={item.nama} value={item.id} />
          ))}
        </Picker>
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={{
                backgroundColor: '#dadf00',
                marginVertical: windowHeight * 0.01,
                width: windowWidht * 0.3,
                height: windowHeight * 0.06,
                borderWidth: 1,
                borderColor: '#00000030',
                marginStart: windowWidht * 0.06,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 30,
              }}
              onPress={() => {
                Alert.alert(
                  'Peringatan',
                  'Apakah Anda Yakin Mengubah Data Anda ?',
                  [
                    {
                      text: 'Batal',
                      style: 'cancel',
                    },
                    {
                      text: 'OK',
                      onPress: () => {
                        editDataUser();
                      },
                    },
                  ],
                  {cancelable: true},
                );
              }}>
              <Text style={styles.btnText}>Simpan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: '#dadf00',
                marginVertical: windowHeight * 0.01,
                width: windowWidht * 0.3,
                height: windowHeight * 0.06,
                borderWidth: 1,
                borderColor: '#00000030',
                marginStart: windowWidht * 0.01,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 30,
              }}
              onPress={() => {
                editDataPassword();
              }}>
              <Text style={styles.btnText}>Edit Password</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: 'red',
                marginVertical: windowHeight * 0.01,
                width: windowWidht * 0.3,
                height: windowHeight * 0.06,
                borderWidth: 1,
                borderColor: '#00000030',
                marginStart: windowWidht * 0.01,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 30,
              }}
              onPress={() => {
                Alert.alert(
                  'Peringatan',
                  'Apakah Anda Yakin Keluar Dari Aplikasi ?',
                  [
                    {
                      text: 'Batal',
                      style: 'cancel',
                    },
                    {
                      text: 'OK',
                      onPress: () => {
                        logout();
                      },
                    },
                  ],
                  {cancelable: true},
                );
              }}>
              <Text style={styles.btnText}>Logout</Text>
            </TouchableOpacity>
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

export default User;

const windowWidht = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  box: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: windowWidht * 0.8,
  },
  formInput: {
    borderBottomWidth: 1,
    width: windowWidht * 0.35,
    marginTop: -windowHeight * 0.02,
    borderBottomColor: 'grey',
    marginLeft: windowWidht * 0.05,
    fontSize: 16,
  },
  formInput1: {
    borderBottomWidth: 1,
    width: windowWidht * 0.7,
    marginTop: -windowHeight * 0.02,
    borderBottomColor: 'grey',
    marginLeft: windowWidht * 0.05,
    fontSize: 16,
  },
  floatingScreen: {
    // marginTop: windowHeight * 0.02,
    width: windowWidht * 0.6,
    height: windowHeight * 0.15,
    borderRadius: 40,
    alignItems: 'center',
    backgroundColor: '#dadf00',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.5)',
  },
  title1: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: windowHeight * 0.04,
    marginBottom: windowHeight * 0.02,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  title: {
    width: windowWidht * 0.2,
    fontWeight: 'bold',
    color: '#000000',
  },
  data: {
    width: windowWidht * 0.6,
    color: '#000000',
  },
  image: {
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidht * 0.3,
    height: windowHeight * 0.14,
    backgroundColor: '#FFFFFF',
    resizeMode: 'contain',
    borderRadius: 80,
    marginBottom: windowHeight * 0.03,
  },
  image1:{
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidht * 0.3,
    height: windowHeight * 0.14,
    backgroundColor: '#FFFFFF',
    resizeMode: 'cover',
    borderRadius: 80,
    marginBottom: windowHeight * 0.03,
  },
  label2: {
    margin: 5,
    fontSize: 25,
  },
  btnText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
