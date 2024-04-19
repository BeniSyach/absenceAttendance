import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeTabs from "./tab";
import SplashScreen from '../page/SplashScreen';
import Login from "../page/login/Login";
import ListAbsence from "../page/absensi/ListAbsenMasukPulang";
import Absensi from "../page/absensi";
import AbsensiPulang from "../page/absensi/absenPulang";
import Pengajuan from "../page/Pengajuan";
import ListHistory from "../page/history/ListHistory";
import ArsipSPT from "../page/arsipSPT";

const Stack = createNativeStackNavigator();

export default function Routes(){
    return(
        <NavigationContainer>
           <Stack.Navigator initialRouteName="SplashScreen">
                
                <Stack.Screen
                    name="SplashScreen"
                    component={SplashScreen}
                    options={{headerShown: false}}
                />

                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{headerShown: false}}
                />

                <Stack.Screen
                    name="ListAbsence"
                    component={ListAbsence}
                    options={{
                        headerShown: true,
                        title: 'Menu Absensi',
                        headerStyle: { 
                            backgroundColor: '#4DC2B7', 
                            borderBottomWidth: 0, 
                            borderBottomColor: 'transparent', 
                            elevation: 0 
                        },
                        headerTintColor: 'black',
                        headerShadowVisible: false, 
                        headerTitleStyle: { fontWeight: 'bold' }
                    }}
                />      
                                
                <Stack.Screen
                    name="Absence"
                    component={Absensi}
                    options={{
                        headerShown: true,
                        title: 'Absen Masuk',
                        headerStyle: { 
                            backgroundColor: '#4DC2B7', 
                            borderBottomWidth: 0, 
                            borderBottomColor: 'transparent', 
                            elevation: 0 
                        },
                        headerTintColor: 'black',
                        headerShadowVisible: false, 
                        headerTitleStyle: { fontWeight: 'bold' }
                    }}
                />  

                <Stack.Screen
                    name="AbsenceOff"
                    component={AbsensiPulang}
                    options={{
                        headerShown: true,
                        title: 'Absen Pulang',
                        headerStyle: { 
                            backgroundColor: '#4DC2B7', 
                            borderBottomWidth: 0, 
                            borderBottomColor: 'transparent', 
                            elevation: 0 
                        },
                        headerTintColor: 'black',
                        headerShadowVisible: false, 
                        headerTitleStyle: { fontWeight: 'bold' }
                    }}
                /> 

                <Stack.Screen
                    name="Request"
                    component={Pengajuan}
                    options={{
                        headerShown: true,
                        title: 'Pengajuan',
                        headerStyle: { 
                            backgroundColor: '#4DC2B7', 
                            borderBottomWidth: 0, 
                            borderBottomColor: 'transparent', 
                            elevation: 0 
                        },
                        headerTintColor: 'black',
                        headerShadowVisible: false, 
                        headerTitleStyle: { fontWeight: 'bold' }
                    }}
                /> 

                <Stack.Screen
                    name="ListHistory"
                    component={ListHistory}
                    options={{
                        headerShown: true,
                        title: 'Histori',
                        headerStyle: { 
                            backgroundColor: '#4DC2B7', 
                            borderBottomWidth: 0, 
                            borderBottomColor: 'transparent', 
                            elevation: 0 
                        },
                        headerTintColor: 'black',
                        headerShadowVisible: false, 
                        headerTitleStyle: { fontWeight: 'bold' }
                    }}
                /> 

                <Stack.Screen
                    name="Holiday"
                    component={ArsipSPT}
                    options={{
                        headerShown: true,
                        title: 'Arsip SPT',
                        headerStyle: { 
                            backgroundColor: '#4DC2B7', 
                            borderBottomWidth: 0, 
                            borderBottomColor: 'transparent', 
                            elevation: 0 
                        },
                        headerTintColor: 'black',
                        headerShadowVisible: false, 
                        headerTitleStyle: { fontWeight: 'bold' }
                    }}
                /> 

                <Stack.Screen name="Main" options={{headerShown: false}} component={HomeTabs} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}