/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  ScrollView,
  Modal,
  ActivityIndicator
} from 'react-native';
import React, {useEffect} from 'react';
import {Dimensions} from 'react-native';
import axios from 'axios';
import {useState} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {logo_dinkes} from '../../assets';

const ArsipSPT = ({navigation}) => {

  const USER = useSelector(state => state.UserReducer);
  const TOKEN = useSelector(state => state.RefreshTokenReducer);
  const [date, setDate] = useState(new Date());
  const [date2, setDate2] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDatePickerVisibility(false);
    setDate(currentDate);
  };

  // menampilkan tanggal
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const onChangeDate2 = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDatePickerVisibility2(false);
    setDate2(currentDate);
  };

  // menampilkan tanggal
  const showDatePicker2 = () => {
    setDatePickerVisibility2(true);
  };

  const getData = async () => {
    setLoading(true);
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
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/pengajuan/Data-Pengajuan/${USER.userId}`,
        {
          headers: {
            Authorization: `Bearer ${newToken}`,
            otherHeader: 'foo',
            Accept: 'application/json',
          },
        },
      );

      let data = response.data;
      if (data.status == true) {
        console.log('data history api', data);
        setData(data.PengajuanById);
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
        console.error('Axios Error:', error.response?.data);
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
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

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
        nestedScrollEnabled={true}>
        <Image
          source={logo_dinkes}
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            resizeMode: 'contain',
            width: windowWidht * 0.4,
          }}
        />
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: '#000000',
            marginBottom: windowHeight * 0.01,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
          Arsip Berkas SPT
        </Text>
        <View
          style={{
            flexDirection: 'row',
            marginTop: windowHeight * 0.02,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
          <View
            style={{
              flexDirection: 'column',
              marginBottom: 20,
            }}>
            <TouchableOpacity style={styles.input} onPress={showDatePicker}>
              <Text style={styles.text}>{formatDate(date)}</Text>
            </TouchableOpacity>
            {isDatePickerVisible && (
                      <DateTimePicker
                      testID="dateTimePicker"
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
            <TouchableOpacity style={styles.input} onPress={showDatePicker2}>
              <Text style={styles.text}>{formatDate(date2)}</Text>
            </TouchableOpacity>
            {isDatePickerVisible2 && (
        <DateTimePicker
        testID="dateTimePicker"
        value={date}
        mode="date"
        is24Hour={true}
        display="default"
        onChange={onChangeDate2}
      />
      )}
          </View>
        </View>
        {data.length > 0 ? (
          <View>
            {data.map((dt, index) => (
              <View key={index}>
                <View
                  style={{
                    backgroundColor: '#1e4d49',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    borderRadius: 15,
                    height: windowHeight * 0.4,
                    width: windowWidht * 0.8,
                    marginBottom: windowHeight * 0.02,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: windowWidht * 0.75,
                      backgroundColor: '#DBE000',
                      marginTop: windowHeight * 0.02,
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      borderRadius: 10,
                      height: windowHeight * 0.04,
                      justifyContent: 'space-between',
                      paddingHorizontal: 15,
                    }}>
                    <Text
                      style={{
                        marginTop: windowHeight * 0.006,
                        fontSize: windowWidht * 0.035,
                        fontWeight: 'bold',
                      }}>
                      Tanggal :
                    </Text>
                    <Text
                      style={{
                        marginTop: windowHeight * 0.006,
                        fontSize: windowWidht * 0.035,
                        fontWeight: 'bold',
                      }}>
                      {dt.tanggal}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: windowWidht * 0.75,
                      backgroundColor: '#DBE000',
                      marginTop: windowHeight * 0.02,
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      borderRadius: 10,
                      height: windowHeight * 0.04,
                      justifyContent: 'space-between',
                      paddingHorizontal: 15,
                    }}>
                    <Text
                      style={{
                        marginTop: windowHeight * 0.006,
                        fontSize: windowWidht * 0.035,
                        fontWeight: 'bold',
                      }}>
                      Jam Upload :
                    </Text>
                    <Text
                      style={{
                        marginTop: windowHeight * 0.006,
                        fontSize: windowWidht * 0.035,
                        fontWeight: 'bold',
                      }}>
                      00: 00
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: windowWidht * 0.75,
                      backgroundColor: '#DBE000',
                      marginTop: windowHeight * 0.02,
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      borderRadius: 10,
                      height: windowHeight * 0.04,
                      justifyContent: 'space-between',
                      paddingHorizontal: 15,
                    }}>
                    <Text
                      style={{
                        marginTop: windowHeight * 0.006,
                        fontSize: windowWidht * 0.035,
                        fontWeight: 'bold',
                      }}>
                      File SPT :
                    </Text>
                    <Text
                      style={{
                        marginTop: windowHeight * 0.006,
                        fontSize: windowWidht * 0.035,
                        fontWeight: 'bold',
                      }}>
                      {dt.file}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: windowWidht * 0.75,
                      backgroundColor: '#DBE000',
                      marginTop: windowHeight * 0.02,
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      borderRadius: 10,
                      height: windowHeight * 0.04,
                      justifyContent: 'space-between',
                      paddingHorizontal: 15,
                    }}>
                    <Text
                      style={{
                        marginTop: windowHeight * 0.006,
                        fontSize: windowWidht * 0.035,
                        fontWeight: 'bold',
                      }}>
                      Judul Acara :
                    </Text>
                    <Text
                      style={{
                        marginTop: windowHeight * 0.006,
                        fontSize: windowWidht * 0.035,
                        fontWeight: 'bold',
                      }}>
                      {dt.judul_acara}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: windowWidht * 0.75,
                      backgroundColor: '#DBE000',
                      marginTop: windowHeight * 0.02,
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      borderRadius: 10,
                      height: windowHeight * 0.04,
                      justifyContent: 'space-between',
                      paddingHorizontal: 15,
                    }}>
                    <Text
                      style={{
                        marginTop: windowHeight * 0.006,
                        fontSize: windowWidht * 0.035,
                        fontWeight: 'bold',
                      }}>
                      Lama Acara :
                    </Text>
                    <Text
                      style={{
                        marginTop: windowHeight * 0.006,
                        fontSize: windowWidht * 0.035,
                        fontWeight: 'bold',
                      }}>
                      {dt.lama_acara}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: windowWidht * 0.75,
                      backgroundColor: '#DBE000',
                      marginTop: windowHeight * 0.02,
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      borderRadius: 10,
                      height: windowHeight * 0.04,
                      justifyContent: 'space-between',
                      paddingHorizontal: 15,
                    }}>
                    <Text
                      style={{
                        marginTop: windowHeight * 0.006,
                        fontSize: windowWidht * 0.035,
                        fontWeight: 'bold',
                      }}>
                      Lokasi Acara :
                    </Text>
                    <Text
                      style={{
                        marginTop: windowHeight * 0.006,
                        fontSize: windowWidht * 0.035,
                        fontWeight: 'bold',
                      }}>
                      {dt.lokasi_acara}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={{marginLeft: 'auto', marginRight: 'auto'}}>
            <Text>Tidak ADa Data</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
    </>
  );
};

export default ArsipSPT;

const windowWidht = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  listMenu: {
    marginVertical: windowHeight * 0.01,
    width: windowWidht * 0.8,
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
  input: {
    width: windowWidht * 0.4,
    height: windowHeight * 0.063,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginVertical: windowHeight * 0.01,
    borderRadius: 20,
  },
  text: {
    fontSize: 14,
    paddingTop: 10,
    paddingLeft: 10,
  },
});
