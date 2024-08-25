import { useState, useEffect } from 'react';
import { isPlatform } from '@ionic/react';

import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

export function usePhotoGallery() {

  const [photos, setPhotos] = useState({
    filepath: null,
    webviewPath: null,
  });

  useEffect(() => {
    // Load data from local storage when the component mounts
    const storedData = localStorage.getItem('photosData');
    if (storedData) {
      setPhotos(JSON.parse(storedData));
    }
  }, []);

  const saveToStorage = (newPhotos) => {
    // Save data to local storage
    localStorage.setItem('photosData', JSON.stringify(newPhotos));
  };

  const takePhoto = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera, // Camera, Photos or Prompt!
      quality: 90,
    });

    const fileName = "myPhotoGuard" + '.jpeg';
    // const savedFileImage = await savePicture(photo, fileName);
    // const newPhotos = [
    //   {
    //     filepath: fileName,
    //     webviewPath: photo.webPath,
    //   },
    //   ...photos,
    // ];

    const newPhotos = {
      filepath: fileName,
      webviewPath: photo,
    };
    setPhotos(newPhotos);
    saveToStorage(newPhotos);
    return photo;
  };

  const savePicture = async (photo: Photo, fileName: string): Promise<UserPhoto> => {
    const base64Data = await base64FromPath(photo.webPath!);
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    // Use webPath to display the new image instead of base64 since it's
    // already loaded into memory
    return {
      filepath: fileName,
      webviewPath: photo.webPath,
    };
  };


  return {
    photos,
    takePhoto,
  };
}

export function usePhotoGalleryWithPrompt() {

  const [photos, setPhotos] = useState({
    filepath: null,
    webviewPath: null,
  });

  useEffect(() => {
    // Load data from local storage when the component mounts
    const storedData = localStorage.getItem('photosData');
    if (storedData) {
      setPhotos(JSON.parse(storedData));
    }
  }, []);

  const saveToStorage = (newPhotos) => {
    // Save data to local storage
    localStorage.setItem('photosData', JSON.stringify(newPhotos));
  };

  const takePhotoWithPrompt = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt, // Camera, Photos or Prompt!
      quality: 90,
    });

    const fileName = "myPhotoGuard" + '.jpeg';
    // const savedFileImage = await savePicture(photo, fileName);
    // const newPhotos = [
    //   {
    //     filepath: fileName,
    //     webviewPath: photo.webPath,
    //   },
    //   ...photos,
    // ];

    const newPhotos = {
      filepath: fileName,
      webviewPath: photo,
    };
    setPhotos(newPhotos);
    saveToStorage(newPhotos);
    return photo;
  };

  const savePicture = async (photo: Photo, fileName: string): Promise<UserPhoto> => {
    const base64Data = await base64FromPath(photo.webPath!);
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    // Use webPath to display the new image instead of base64 since it's
    // already loaded into memory
    return {
      filepath: fileName,
      webviewPath: photo.webPath,
    };
  };


  return {
    photos,
    takePhotoWithPrompt,
  };
}

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

export async function base64FromPath(path: string): Promise<string> {
  const response = await fetch(path);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject('method did not return a string');
      }
    };
    reader.readAsDataURL(blob);
  });
}