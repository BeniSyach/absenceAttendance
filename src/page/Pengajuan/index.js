/* eslint-disable no-undef */
import {
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator
} from 'react-native';
import React, {useState} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {logo_rsud, pengajuan} from '../../assets';
import {useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';

// eslint-disable-next-line react/prop-types
const Pengajuan = ({navigation}) => {
  
  const TOKEN = useSelector(state => state.RefreshTokenReducer);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [isDatePickerVisible, setShowDatepicker] = useState(false);
  const USER = useSelector(state => state.UserReducer);
  const [isTimePickerVisible, setShowTimepicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  console.log('data user', USER);
  const [form, setForm] = useState({
    judul_acara: null,
    start: null,
    time: null,
    hari: null,
  });

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Memastikan format dua digit untuk bulan
    const day = String(date.getDate()).padStart(2, '0'); // Memastikan format dua digit untuk tanggal
  
    return `${year}-${month}-${day}`;
  };

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatepicker(false);
    setDate(currentDate);
  };

  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimepicker(false);
    setTime(currentTime);
  };

  // menampilkan tanggal
  const showDatePicker = () => {
    setShowDatepicker(true);
  };

  // menampilkan jam
  const showTimePicker = () => {
    setShowTimepicker(true);
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf', 
      });
      console.log('data file', result.canceled)
      if (result.canceled == false) {
        console.log(
          'data file',
          result.assets[0],
          result.assets[0].uri,
          result.assets[0].mimeType, // mime type
          result.assets[0].name,
          result.assets[0].size,
        );
        setSelectedFile(result.assets[0]);
      } else {
        console.log('Pembatalan pemilihan dokumen');
      }

    } catch (error) {
      console.log('Error:', error);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      Alert.alert('File Belum Di Pilih');
    } else {
      setLoading(true)
      try {
        // Refresh the token
        const refreshResponse = await axios.get(
          // eslint-disable-next-line no-undef
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
        formData.append('user_id', USER.userId);
        formData.append('tanggal', formatDate(date));
        formData.append('waktu', formatTime(time));
        formData.append('judul', form.judul_acara);
        // formData.append('judul', form.judul_acara); mau dibikin lokasi
        formData.append('hari', form.hari);
        formData.append('file', {
          uri: selectedFile.uri,
          type: selectedFile.mimeType,
          name: selectedFile.name,
        });

        // Upload the file with the refreshed token
        const response = await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}/pengajuan/Tambah-Pengajuan`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${newToken}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        console.log('File uploaded successfully:', response.data);
        Alert.alert(
          'Sukes Mengirim Data SPT',
          '',
          [
            {
              text: 'OK',
              onPress: () => {
                // eslint-disable-next-line react/prop-types
                navigation.replace('Main');
              },
            },
          ],
          {cancelable: false},
        );
      } catch (error) {
        console.error('Error uploading file:', error.message);
        Alert.alert('Gagal Mengirim Data SPT');
      }
      setLoading(false)
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
      <View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: windowHeight * 0.06,
            marginBottom: windowHeight * 0.03,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={pengajuan}
            style={{width: 50, height: 70, marginEnd: 10}}
          />
          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: '#000000',
              marginTop: 10, // Sesuaikan sesuai kebutuhan
            }}>
            Upload Berkas SPT
          </Text>
        </View>
        <View
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            width: windowWidht * 0.9,
            height: windowHeight * 0.65,
            borderRadius: 40,
            alignItems: 'flex-start',
            backgroundColor: '#dadf00',
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: windowHeight * 0.02,
            }}>
            <View
              style={{
                flexDirection: 'column',
                marginStart: windowHeight * 0.02,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  paddingTop: 10,
                  paddingLeft: 10,
                }}>
                Tanggal
              </Text>
              <TouchableOpacity style={styles.input} onPress={showDatePicker}>
                <Text style={styles.text}>{formatDate(date)}</Text>
              </TouchableOpacity>
              {isDatePickerVisible && (
              <DateTimePicker
              testID="datePicker"
              value={date}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onChangeDate}
            />
              )}
            </View>

            <View
              style={{
                flexDirection: 'column',
                marginBottom: 20,
                marginStart: windowHeight * 0.01,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  paddingTop: 10,
                  paddingLeft: 10,
                }}>
                Jam/Waktu
              </Text>
              <TouchableOpacity style={styles.input} onPress={showTimePicker}>
                <Text style={styles.text}>{formatTime(time)}</Text>
              </TouchableOpacity>
              {isTimePickerVisible && (
              <DateTimePicker
              testID="dateTimePicker"
              value={time}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onChangeTime}
            />
              )}
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
            <View
              style={{
                flexDirection: 'column',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  paddingTop: 10,
                  paddingLeft: 10,
                }}>
                Judul Acara
              </Text>
              <TextInput
                style={{
                  width: windowWidht * 0.8,
                  height: windowHeight * 0.063,
                  borderWidth: 1,
                  backgroundColor: '#FFFFFF',
                  marginLeft: windowWidht * 0.03,
                  paddingVertical: 5,
                  paddingHorizontal: 15,
                  borderRadius: 20,
                  marginRight: 'auto',
                  fontSize: 18,
                }}
                placeholder="Masukkan Judul Acara"
                onChangeText={text => setForm({...form, judul_acara: text})}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              // marginLeft: 'auto',
              // marginRight: 'auto',
            }}>
            <View
              style={{
                flexDirection: 'column',
                marginStart: windowHeight * 0.02,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  paddingTop: 10,
                  paddingLeft: 10,
                }}>
                Lama Acara
              </Text>
              <TextInput
                style={{
                  width: windowWidht * 0.2,
                  height: windowHeight * 0.063,
                  borderWidth: 1,
                  backgroundColor: '#FFFFFF',
                  marginLeft: windowWidht * 0.03,
                  paddingVertical: 5,
                  borderRadius: 20,
                  marginRight: 'auto',
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  fontSize: 18,
                }}
                maxLength={2}
                keyboardType="numeric"
                placeholder="Hari"
                onChangeText={text => setForm({...form, hari: text})}
              />
            </View>
          </View>
          <View
            style={{
              backgroundColor: '#4DC2B7',
              marginVertical: windowHeight * 0.01,
              width: windowWidht * 0.3,
              height: windowHeight * 0.06,
              borderWidth: 1,
              borderColor: '#00000030',
              marginStart: 30,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 30,
            }}>
            <TouchableOpacity style={styles.btnText} onPress={pickDocument}>
              <Text style={styles.btnText}>Upload File</Text>
            </TouchableOpacity>
          </View>
          {selectedFile && (
            <View
              style={{
                backgroundColor: '#4DC2B7',
                marginVertical: windowHeight * 0.01,
                width: windowWidht * 0.6,
                height: windowHeight * 0.06,
                borderWidth: 1,
                borderColor: '#00000030',
                marginStart: 30,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 30,
              }}>
              <Text style={styles.btnText}>Nama File: {selectedFile.name}</Text>
              {/* <Button title="Upload File" onPress={uploadFile} /> */}
            </View>
          )}
          <TouchableOpacity
            style={{
              backgroundColor: '#4DC2B7',
              marginVertical: windowHeight * 0.01,
              width: windowWidht * 0.3,
              height: windowHeight * 0.06,
              borderWidth: 1,
              borderColor: '#00000030',
              marginStart: 'auto',
              marginEnd: 30,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 30,
            }}
            onPress={() => {
              uploadFile();
            }}>
            <Text style={styles.btnText}>Simpan</Text>
          </TouchableOpacity>
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
        </View>
      </View>
    </SafeAreaView>
    </>
  );
};

export default Pengajuan;

const windowWidht = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  input: {
    width: windowWidht * 0.4,
    height: windowHeight * 0.06,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginVertical: windowHeight * 0.01,
    borderRadius: 20,
  },
  text: {
    fontSize: 18,
    paddingTop: 10,
    paddingLeft: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  listMenu: {
    marginVertical: windowHeight * 0.01,
    width: windowWidht * 0.4,
    height: windowHeight * 0.06,
    borderWidth: 1,
    borderColor: '#00000030',
    marginStart: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  formInput1: {
    borderBottomWidth: 1,
    width: windowWidht * 0.7,
    marginTop: -windowHeight * 0.02,
    borderBottomColor: 'grey',
    marginLeft: windowWidht * 0.05,
    fontSize: 16,
  },
});
