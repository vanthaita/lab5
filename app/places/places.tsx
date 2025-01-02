import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter, useFocusEffect } from 'expo-router';
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import axiosInstance from '../axios';
import { useLocation } from '../context/location';

type LocationType = {
  latitude: number;
  longitude: number;
};

export default function AddLocationScreen() {
  const [name, setName] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const { location, setLocation } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const resetForm = useCallback(() => {
    setName('');
    setImage(null);
  }, []);

  useFocusEffect(
    useCallback(() => {
      resetForm();
      return () => {
        resetForm();
      };
    }, [resetForm])
  );

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your camera.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your location.');
      return;
    }
    const currentLocation = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    });
  };

  const selectLocationOnMap = () => {
    if (location) {
      router.push({
        pathname: '/Map/map',
        params: {
          initialLatitude: location.latitude.toString(),
          initialLongitude: location.longitude.toString(),
        },
      });
    } else {
      router.push('/Map/map');
    }
  };

  const handleAddLocation = async () => {
    if (!name || !image || !location) {
      Alert.alert('Error', 'Please fill in all the fields.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(image);
      const blob = await response.blob();

      const fileType = blob.type.split('/')[1] || 'jpeg';
      const fileName = `uploaded_image.${fileType}`;

      const formData = new FormData();
      formData.append('title', name);
      formData.append('latitude', location.latitude.toString());
      formData.append('longitude', location.longitude.toString());
      const file: File = {
        uri: image,
        type: blob.type,
        name: fileName,
      } as unknown as File;
      formData.append('image', file);

      const apiResponse = await axiosInstance.post('/places/upload-place', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (apiResponse.status === 201 || apiResponse.status === 200) {
        resetForm();
        Alert.alert('Success', 'Place uploaded successfully!');
        router.back();
      } else {
        Alert.alert('Error', 'Failed to upload place.');
      }
    } catch (error) {
      console.error('Error uploading place:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white p-5">
      <Text className="mb-2 text-lg font-semibold">Location Name:</Text>
      <TextInput
        className="mb-4 rounded-md border border-gray-300 p-3"
        placeholder="Enter location name"
        value={name}
        onChangeText={setName}
      />

      <Text className="mb-2 text-lg font-semibold">Image:</Text>
      <View className="mb-4 flex-row justify-between">
        <TouchableOpacity className="rounded-md bg-blue-500 p-3" onPress={pickImage}>
          <Text className="text-center text-white">Pick Image</Text>
        </TouchableOpacity>
        <TouchableOpacity className="rounded-md bg-blue-500 p-3" onPress={takePhoto}>
          <Text className="text-center text-white">Take Photo</Text>
        </TouchableOpacity>
      </View>
      {image && <Image source={{ uri: image }} className="mb-4 h-48 w-full rounded-md" />}

      <Text className="mb-2 text-lg font-semibold">Location:</Text>
      <View className="mb-4 h-52 w-full overflow-hidden rounded-xl">
        {location && (
          <MapView
            style={StyleSheet.absoluteFillObject}
            showsUserLocation
            showsMyLocationButton
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}>
            <Marker coordinate={location} title="My Location" />
          </MapView>
        )}
      </View>
      <View className="mb-4 flex-row justify-between">
        <TouchableOpacity className="rounded-md bg-green-500 p-3" onPress={getCurrentLocation}>
          <Text className="text-center text-white">Locate Me</Text>
        </TouchableOpacity>
        <TouchableOpacity className="rounded-md bg-green-500 p-3" onPress={selectLocationOnMap}>
          <Text className="text-center text-white">Pick on Map</Text>
        </TouchableOpacity>
      </View>
      {location && (
        <Text className="mb-4 text-sm text-gray-600">
          Latitude: {location.latitude.toFixed(5)}, Longitude: {location.longitude.toFixed(5)}
        </Text>
      )}

      <TouchableOpacity
        className="rounded-md bg-orange-500 p-4"
        onPress={handleAddLocation}
        disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text className="text-center text-lg font-semibold text-white">Add Location</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
