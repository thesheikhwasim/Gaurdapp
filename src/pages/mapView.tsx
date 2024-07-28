import React, { useState, useEffect, useRef } from 'react';
import { IonButtons, IonLoading, IonContent, IonGrid, IonRow, IonCol, IonHeader, IonLabel, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonModal, IonButton, IonIcon } from '@ionic/react';
import { useParams } from 'react-router';
import axios from 'axios';
import './Page.css';
import {
    GoogleMap,
    useJsApiLoader,
    Polyline,
    Marker,
    InfoWindow,
    useLoadScript,
} from "@react-google-maps/api";
import { Geolocation } from '@capacitor/geolocation';
import { useTranslation } from 'react-i18next';
import { closeOutline } from 'ionicons/icons';
import CustomHeader from './CustomHeader';


const GetRequests: React.FC = () => {

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyC2wtQLe_g17Kim5fquySnPT3z3qtM79oA" // Add your API key
    });
    // useAuth(); // Enforce login requirement
    const [requestData, setRequestData] = useState<any>(null);
    const [loggedInUser, setLoggedInUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [ProfileData, setProfileData] = useState<any>({});
    const [latlongMarkers, setLatLongMarkers] = useState([{}]);
    const [mapLoad, setMapLoad] = useState(false);
    const [currentLatLong, setCurrentLatLong] = useState({})
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

    function manipulateForLatLongSet(allDataParams: object) {
        console.log("YOU NEED TO MANIPULATE THIS::::: ", allDataParams);
        const output = []

        for (const singleData of allDataParams) {
            console.log("SingleData::: ", singleData);
            if (singleData?.site_latitude != "" && singleData?.site_longitute != ""
                && singleData?.site_latitude != null && singleData?.site_longitute != null
            ) {
                let newKeyVal = {
                    lat: parseFloat(singleData?.site_latitude),
                    lng: parseFloat(singleData?.site_longitute),
                    siteData: singleData
                }
                output.push(newKeyVal)
            }
        }
        console.log("output----->>>>>>>>>>>>> ", output);
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
                    <CustomHeader />
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
            <div className='managerMapView'>
                {mapLoad && <GoogleMapPolyline customMarkers={latlongMarkers}
                    currentLatLong={currentLatLong}
                />}
            </div>
            </IonContent>
        </IonPage>
    );
};

export default GetRequests;

const GoogleMapPolyline = (props: any) => {
    const [activeMarker, setActiveMarker] = useState(null);
    const [activeMarkerSiteData, setActiveMarkerSiteData] = useState(null);
    const [path, setPath] = useState([{}]);
    const [mapModal, setMapModal] = useState(false);
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyC2wtQLe_g17Kim5fquySnPT3z3qtM79oA',
    });

    useEffect(() => {
        const latLng = JSON.parse(JSON.stringify(path));
        let mergedData = latLng.concat(props.customMarkers);

        setTimeout(() => {
            console.log("mergedData======================", mergedData);
            setPath(mergedData);
        }, 3000)
    }, []);

    const handleActiveMarker = (marker, siteDataParam) => {
        console.log("marker--", marker);
        console.log("siteDataParam--", siteDataParam);
        if (marker === activeMarker) {
            return;
        }
        setActiveMarker(marker);
        setActiveMarkerSiteData(siteDataParam);
        setMapModal(true);
    };

    return isLoaded ? (
        <>
            <GoogleMap
                mapContainerStyle={{ width: "100%", height: "calc(100vh - 100px)" }}
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
                        onClick={() => handleActiveMarker(i, item)}
                    />
                ))}
            </GoogleMap>
            <IonModal isOpen={mapModal} onDidDismiss={() => setMapModal(false)} initialBreakpoint={0.25} breakpoints={[0, 0.25, 0.5, 0.75]}>
                <IonContent className="ion-padding">
                    <div className='shift-details-column marker-guard-modal'>
                        <IonButtons slot="end" className='ionBtn-Container'>
                            <IonButton onClick={() => setMapModal(false)} className='ionBtn-Div'>
                                <IonIcon className='ionBtn-Icon' icon={closeOutline} size="large"></IonIcon>
                            </IonButton>
                        </IonButtons>
                        <p><strong>Site Name: </strong><span>{activeMarkerSiteData?.siteData?.site_name}</span></p>
                        <p><strong>Site City: </strong>{activeMarkerSiteData?.siteData?.site_city}</p>
                        <p><strong>Site State: </strong>{activeMarkerSiteData?.siteData?.site_state}</p>
                        <p><strong>Site Category: </strong>{activeMarkerSiteData?.siteData?.site_category}</p>
                    </div>
                </IonContent>
            </IonModal>
        </>
    ) : (
        <></>
    );
};
