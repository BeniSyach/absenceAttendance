// 'use strict';
import React from 'react';
import {useEffect, useState} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import ImageResizer from 'react-native-image-resizer';
import RNFetchBlob from 'rn-fetch-blob';

// class CamDect extends PureComponent {
//   state = {
//     fd: true,
//     isFaceDetected: false,
//     btnAble: true,
//     test: "Off"
//   }

//   componentDidMount() {
//     // console.log(this.props.route.params.lat)
//     setInterval(() => {
//       this.setState({
//         btnAble: true,
//         test: "Off"
//       })
//     }, 1000)
//   }

const CamDect = ({navigation, route}) => {
  const [form, setForm] = useState({
    // lat: formParams.lat ? formParams.lat : '',
    // lng: formParams.lng ? formParams.lng : '',
    // customer_id: '',
    // dapertement_id: USER.dapertement_id,
    noWM1: '',
    brandWM1: '',
    standWM1: '',
    noWM2: '',
    brandWM2: '',
    standWM2: '',
    lat: '',
    lng: '',
  });

  // const [state, setState] = useState({
  //       fd: true,
  //       isFaceDetected: false,
  //       btnAble: true,
  //       test: "Off"
  //     })
  const [btnAble, setBtinAble] = useState(true);
  const [img, setImg] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(true);
  let camera = '';

  useEffect(() => {
    // if(isFocused){
    // setLoading(true)
    // LocationServicesDialogBox.checkLocationServicesIsEnabled({
    //     message: "<h2 style='color: #0af13e'>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
    //     ok: "YES",
    //     cancel: "NO",
    // }).then(function (success) {
    //     // setStatusGps(success.status)
    //     // Promise.all([API.categories(TOKEN), API.defcustomer(TOKEN), requestLocationPermission()]).then((res) => {
    //         // console.log('corrrrrr', res);
    //         // setCategories(res[0].data)
    //         // setDefcustomer_id(res[1].data)
    //         Geolocation.getCurrentPosition(
    //             (position) => {
    //                 // console.log('posisi',position);
    //                 // defaultLoc = {
    //                 //     latitude: position.coords.latitude,
    //                 //     longitude: position.coords.longitude,
    //                 // }
    //                 // positionNew = position
    //                 console.log('posisiisii ', (position.coords.latitude));
    //                 setForm({
    //                     ...form,
    //                     lat: position.coords.latitude,
    //                     lng: position.coords.longitude
    //                 })
    //                 console.log('lat : ',position.coords.latitude)
    //                 setLoading(false)
    //             },
    //             (error) => {
    //                 console.log("gagal",error);
    //                 setLoading(false)
    //             },
    //             { enableHighAccuracy: false, timeout: 120000, maximumAge: 1000, accuracy: 'high' },
    //         );
    //     // }).catch((e) => {
    //     //     // console.log(e);
    //     //     setLoading(false)
    //     // })
    // }).catch((error) => {
    // });
    //    }
  }, []);

  // useEffect(()=>{

  // })

  React.useEffect(() => {
    const timer = setInterval(() => {
      setBtinAble(true);
    }, 2000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const takePicture = async () => {
    const d = new Date();
    const nm = form.id + d.getHours() + d.getMinutes() + d.getSeconds();
    console.log('form : ', form);
    let gambar = [];
    console.log('tesss999');
    if (camera) {
      const options = {base64: true};
      const data = await camera.takePictureAsync(options);

      await ImageResizer.createResizedImage(
        data.uri,
        900,
        900,
        'JPEG',
        100,
        0,
        undefined,
        false,
        {},
      )
        .then(response => {
          RNFetchBlob.fs
            .readFile(response.path, 'base64')
            .then(data => {
              gambar = {
                uri: response.uri,
                base64: data,
                filename: '' + route.params.user_id + nm,
              };
              // console.log('tesss', response.uri, data);

              navigation.navigate(route.params.link, {
                highAccuracy: route.params.highAccuracy,
                lat: route.params.lat,
                lng: route.params.lng,
                radius: route.params.radius,
                user_id: route.params.user_id,
                image: gambar,
                fingerfrint: route.params.fingerfrint,
                selfie: route.params.selfie,
              });
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
      //         console.log('jjfffcc',gg)

      //         const d = new Date()
      //         const nm = 'oldimage'+form.id+d.getHours()+d.getMinutes()+d.getSeconds();
      // Marker1.markText({
      //   src: gg.uri,
      //   text: 'tanggal : ',
      //   // X: 30,
      //   // Y: 30,
      //   color: '#FFFFFF', // '#ff0000aa' '#f0aa'
      //   fontName: 'Arial-BoldItalicMT',
      //   fontSize: 14,
      //   // position : 'bottomCenter',
      //   X: 14,
      //   Y: 15,
      //   // textBackgroundStyle: {
      //   //       paddingX: 1,
      //   //       paddingY: 1,
      //   //     color: '#00000090' // '#0f0a'
      //   // },
      //   scale: 1,
      //   quality: 100,
      //   filename: nm.toString(),
      //   saveFormat: 'jpg',

      // }).then((res) => {
      //   console.log("the path is"+ res)

      //   // let result = FileSystem.readAsStringAsync(photo.uri, { encoding: 'base64' });
      //   let result = res[0]

      //   // launchImageLibraryAsync({
      //   //   // mediaTypes: res.MediaTypeOptions.Images,
      //   //   allowsEditing: true,
      //   //   aspect: [4, 4],
      //   //   quality: 1,
      //   //   base64:true
      //   // });

      //   console.log("the path 1"+ result)

      //   RNFS.readFile( res, 'base64').then(res1 => {
      // gambar = {"filename":nm.toString(), 'base64' : res1, uri : 'file:///'+res}
      // setImg({"filename":nm.toString(), 'base64' : res1, uri : res});

      // alert('gaga')

      // console.log('ddffff'+res1)

      // console.log('lll3333', data);
      // console.log("tesss123")

      // console.log('tesss',data);
      setLoading1(false);
      // });

      // setMarkResult(res)

      // console.log('ggff55', gambar);
      if (!loading1) {
      }
    }
  };

  if (Platform.OS === 'android') {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.front}
          flashMode={RNCamera.Constants.FlashMode.on}
          ratio={'4:4'}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          faceDetectionClassifications={
            RNCamera.Constants.FaceDetection.Classifications.all
          }
          faceDetectionLandmarks={
            RNCamera.Constants.FaceDetection.Landmarks.all
          }
          onFacesDetected={face => {
            // if (state.fd) {
            // this.setState({ fd: face.faces.length === 0, btnAble: false, test: "uuuu" });
            // this.setState({ test: "gggg" })
            setBtinAble(false);
            // setState({btnAble: false, test: "On"})
            // alert(JSON.stringify(face));

            // }
          }}
          // onFaceDetectionError={

          //   // this.setState({ test: "kkkk" })
          //   alert("test2")

          // }
          // onGoogleVisionBarcodesDetected={({ barcodes }) => {
          //   console.log(barcodes);
          // }}
        />
        {/* <Text style={{ backgroundColor: 'red', textAlign : 'center' }}>Arahkan Kamera Ke Wajah</Text> */}
        {/* {this.state.test == "On" && */}
        <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
          {/* <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture} disabled={this.state.btnAble}> */}
          {/* <TouchableOpacity onPress={takePicture.bind(this)} style={btnAble ?  styles.captureF : styles.capture } > */}
          <TouchableOpacity
            onPress={takePicture.bind(this)}
            style={btnAble ? styles.captureF : styles.capture}
            disabled={btnAble}>
            <Text style={{fontSize: 14}}> Ambil</Text>
          </TouchableOpacity>
        </View>
        {/* // } */}
        {/* {this.state.test == "Off" &&
 <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
 <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture} disabled={this.state.btnAble}>
   <Text style={{ fontSize: 14 }}> Arahkan Ke Wajah </Text>
 </TouchableOpacity>
</View>
        } */}
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.front}
          flashMode={RNCamera.Constants.FlashMode.on}
          ratio={'4:4'}
        />

        <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
          {/* <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture} disabled={this.state.btnAble}> */}
          {/* <TouchableOpacity onPress={takePicture.bind(this)} style={btnAble ?  styles.captureF : styles.capture } > */}
          <TouchableOpacity
            onPress={takePicture.bind(this)}
            style={styles.capture}>
            <Text style={{fontSize: 14}}> Ambil</Text>
          </TouchableOpacity>
        </View>
        {/* // } */}
        {/* {this.state.test == "Off" &&
<View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
<TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture} disabled={this.state.btnAble}>
 <Text style={{ fontSize: 14 }}> Arahkan Ke Wajah </Text>
</TouchableOpacity>
</View>
      } */}
      </View>
    );
  }
};

export default CamDect;

// }

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    // backgroundColor: colors.profileTabSelectedColor
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  captureF: {
    flex: 0,
    backgroundColor: '#d72503',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});
