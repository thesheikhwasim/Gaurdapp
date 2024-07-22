import React, { useState, useEffect, useRef } from 'react';
import { IonButtons, IonLoading, IonContent, IonGrid, IonRow, IonCol, IonHeader, IonLabel, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import { useParams } from 'react-router';
import axios from 'axios';
import './Page.css';
// import { GoogleMap } from '@capacitor/google-maps';
import {
    GoogleMap,
    useJsApiLoader,
    Polyline,
    Marker,
} from "@react-google-maps/api";
import { Geolocation } from '@capacitor/geolocation';
import { useTranslation } from 'react-i18next';


const GetRequests: React.FC = () => {
    // useAuth(); // Enforce login requirement
    const [requestData, setRequestData] = useState<any>(null);
    const [loggedInUser, setLoggedInUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [ProfileData, setProfileData] = useState<any>({});
    const [latlongMarkers, setLatLongMarkers] = useState([{}]);
    const [mapLoad, setMapLoad] = useState(false);
    const [currentLatLong, setCurrentLatLong]= useState({})
    const { t } = useTranslation();


    const token = localStorage.getItem('token');
    useEffect(() => {
        // Call API to fetch user profile data
        const storedData = localStorage.getItem('loggedInUser');
        const storedToken = localStorage.getItem('token');

        if (storedData) {
            setLoggedInUser(JSON.parse(storedData));
        }
        if (storedToken) {
            Geolocation.getCurrentPosition()
            .then((position) => {
              if (position && position.coords.latitude) {
                  let tempCurObj = {
                      lat: parseFloat(position?.coords?.latitude),
                      lng: parseFloat(position?.coords?.longitude)
                  }
                setCurrentLatLong(tempCurObj);
                fetchProfileData(storedToken);
                getOPdashboard();
              }
            })
            .catch((error) => {
              console.log("get current lat long error");
            });
        }
    }, []);

    const fetchProfileData = async (token: string) => {
        const url = 'https://guard.ghamasaana.com/guard_new_api/profile.php';
        const formData = new FormData();
        formData.append('action', 'profile_data');
        formData.append('token', token);

        try {
            const response = await axios.post(url, formData);
            if (response.data && response.data.employee_data) {
                setProfileData(response.data.employee_data);
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
        } finally {
            setLoading(false);
        }
    };

    function getOPdashboard(dataParam = 0) {
        const tokenData = localStorage.getItem('token');
        let URL = "https://guard.ghamasaana.com/guard_new_api/op_ongoing_duty.php";
        let formData = new FormData();
        formData.append('action', "op_duty_ongoing");
        formData.append('token', tokenData);
        formData.append('latitude', '22.31');
        formData.append('longitude', '22.31');
        // return false;
        axios.post(URL, formData)
          .then(response => {
            if (response?.data && response?.data?.success) {
              manipulateForLatLongSet(response?.data?.employee_data?.site_route);
            }
          })
          .catch(error => {
            alert('error')
          });
      }

      function manipulateForLatLongSet(allDataParams: object){
        console.log("YOU NEED TO MANIPULATE THIS::::: ", allDataParams);
        const output = []

        for (const singleData of allDataParams) {
            console.log("SingleData::: ", singleData);
            if(singleData?.site_latitude != "" && singleData?.site_longitute != ""){
                let newKeyVal = {
                    lat: parseFloat(singleData?.site_latitude),
                    lng: parseFloat(singleData?.site_longitute),
                    site_name: singleData?.site_name
                }
                output.push(newKeyVal)
            }
        }
        console.log("output----->>>>>>>>>>>>> ",output);
        setLatLongMarkers(output);
        setMapLoad(true);
      }

    const { name } = useParams<{ name: string; }>();


    return (
        <IonPage>
            <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonImg className='header-image' src="./assets/imgs/logo.jpg" alt="header" style={{ display: 'flex', height: '60px', width: '100%' }} />
        </IonToolbar>
      </IonHeader>
      <div className="content">
          <div className="header_title">
            <IonTitle className="header_title ion-text-center">{t('Welcome')} {loggedInUser?.full_name}</IonTitle>
          </div>
        </div>
            <div className='managerMapView'>
                <div>Map with Guard Markers</div>
                {mapLoad && <GoogleMapPolyline customMarkers={latlongMarkers}
                    currentLatLong={currentLatLong}
                />}
            </div>
        </IonPage>
    );
};

export default GetRequests;


const containerStyle = {
    width: '100%',
    height: '400px'
};

const center = {
    lat: -3.745,
    lng: -38.523
};

// latitude: 28.5053906
// longitude: 77.3216623

const GoogleMapPolyline = (props:any) => {
    const [path, setPath] = useState([{}]);
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyC2wtQLe_g17Kim5fquySnPT3z3qtM79oA',
    });

    useEffect(() => {
        //   const localData = localStorage.getItem("googleMapPolyline");
        //   if (localData) {
        //     const parsedData = JSON.parse(localData);
        //     setPath(parsedData);
        //   }
        const latLng = JSON.parse(JSON.stringify(path));
        let mergedData = latLng.concat(props.customMarkers);

        setTimeout(() => {
            setPath(mergedData);
        },3000)
    }, []);

    const addPointToPath = (e) => {
        try {
            const latLng = { lat: e.latLng.lat(), lng: e.latLng.lng() };
            // const latLng2 = { lat: (e.latLng.lat() + 1), lng: e.latLng.lng() };

            console.log("latLng", latLng);
            // console.log("latLng2", latLng2);
            const mergedData = [...path, latLng];
            console.log("mergedData", mergedData);
            setPath(mergedData);
            localStorage.setItem("googleMapPolyline", JSON.stringify(mergedData));
        } catch (error) {
            console.error("addPointToPath error", error);
        }
    };

    // const removeItem = (index) => {
    //   const arr = [...path];
    //   arr.splice(index, 1);
    //   setPath(arr);
    //   localStorage.setItem("googleMapPolyline", JSON.stringify(arr));
    // };

    const showDetailsOfPlace = (param, param2) => {
console.log("param ---- ---- --- ", param, param2)
    }

    return isLoaded ? (
        <>
            <GoogleMap
                // onClick={addPointToPath}
                mapContainerStyle={{ width: "100%", height: "calc(100vh - 200px)" }}
                center={props?.currentLatLong}
                zoom={11}
            >
                {/* =====Polyline===== */}
                <Polyline
                path={path}
                options={{
                  strokeColor: "#FF0000",
                  strokeOpacity: 1,
                  strokeWeight: 2,
                }}
              />

                {/* =====Marker===== */}
                {path.map((item, i) => (
                    <Marker key={i} position={item}
                    onClick={() => showDetailsOfPlace(i,item)}
                    />
                ))}
            </GoogleMap>
        </>
    ) : (
        <></>
    );
};

