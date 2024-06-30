import React, { useState, useEffect } from 'react';
import { IonButtons, IonLoading, IonContent, IonGrid, IonRow, IonCol, IonHeader, IonLabel, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import { useParams } from 'react-router';
import axios from 'axios';
import './Page.css';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const GetRequests: React.FC = () => {
    // useAuth(); // Enforce login requirement

    const [requestData, setRequestData] = useState<any>(null);
    const [loggedInUser, setLoggedInUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [ProfileData, setProfileData] = useState<any>({});

    const token = localStorage.getItem('token');
    useEffect(() => {
        // Call API to fetch user profile data
        const storedData = localStorage.getItem('loggedInUser');
        const storedToken = localStorage.getItem('token');

        if (storedData) {
            setLoggedInUser(JSON.parse(storedData));
        }
        if (storedToken) {
            fetchProfileData(storedToken);
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

    const { name } = useParams<{ name: string; }>();

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonImg className='header-image' src="./assets/imgs/logo.jpg" alt="header" style={{ display: 'flex', height: '60px', width: '100%' }} />
                    <IonTitle>{name}</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                {loading ? (
                    <IonLoading isOpen={loading} message={'Loading...'} />
                ) : (
                    <>
                        <div className="header_title">
                            <IonTitle className="header_title ion-text-center">Your Map</IonTitle>
                        </div>
                        <IonCard className='shift-details-card-content'>

                            <IonLabel><div className='notFoundIdCard'>
                                <div className='managerMapView'>
                                    test <MyComponent />
                                </div>
                            </div></IonLabel>
                        </IonCard>
                        <div className='footer'>
                            <IonTitle className='footer ion-text-center'>Helpline | +91 90999 XXXXX</IonTitle>
                        </div>
                    </>
                )}
            </IonContent>
        </IonPage>
    );
};

export default GetRequests;


const containerStyle = {
    width: '400px',
    height: '400px'
};

const center = {
    lat: -3.745,
    lng: -38.523
};

function MyComponent() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "YOUR_API_KEY"
    })

    const [map, setMap] = React.useState(null)

    const onLoad = React.useCallback(function callback(map) {
        // This is just an example of getting and using the map instance!!! don't just blindly copy!
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);

        setMap(map)
    }, [])

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, [])

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            { /* Child components, such as markers, info windows, etc. */}
            <></>
        </GoogleMap>
    ) : <></>
}

