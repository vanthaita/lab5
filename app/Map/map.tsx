import * as Location from 'expo-location';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, TextInput } from 'react-native';
import MapView, { Region, PROVIDER_GOOGLE, Marker } from 'react-native-maps';

import { useLocation } from '../context/location';

type MapScreenParams = {
  initialLatitude?: string;
  initialLongitude?: string;
};

export default function MapScreen() {
  const navigation = useNavigation();
  const mapRef = useRef<MapView>(null);
  const [currentRegion, setCurrentRegion] = useState<Region | undefined>(undefined);
  const [markerCoordinate, setMarkerCoordinate] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [markerTitle, setMarkerTitle] = useState<string>('New Focus Location');
  const [searchAddress, setSearchAddress] = useState('');
  const { initialLatitude, initialLongitude } = useLocalSearchParams<MapScreenParams>();
  const { location, setLocation } = useLocation();
  const [draggedMarkerCoordinate, setDraggedMarkerCoordinate] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const fetchMarkerTitle = useCallback(
    async (latitude: number, longitude: number) => {
      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (reverseGeocode && reverseGeocode.length > 0) {
          const placeName = reverseGeocode[0].name || reverseGeocode[0].street || 'Unknown';
          setMarkerTitle(placeName);
        } else {
          setMarkerTitle('Location');
        }
      } catch (error) {
        console.error('Error fetching marker title:', error);
        setMarkerTitle('Location');
      }
    },
    [setMarkerTitle]
  );

  useEffect(() => {
    const getLocationAsync = async () => {
      let initialRegionFromParams: Region | null = null;

      if (initialLatitude && initialLongitude) {
        const latitude = parseFloat(initialLatitude);
        const longitude = parseFloat(initialLongitude);

        if (!isNaN(latitude) && !isNaN(longitude)) {
          initialRegionFromParams = {
            latitude,
            longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          };
          setCurrentRegion(initialRegionFromParams);
          setMarkerCoordinate({ latitude, longitude });
          setDraggedMarkerCoordinate({ latitude, longitude });
          fetchMarkerTitle(latitude, longitude);

          return;
        }
      }
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const initialLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };
      setCurrentRegion(initialLocation);
      setMarkerCoordinate(initialLocation);
      setDraggedMarkerCoordinate(initialLocation);
      fetchMarkerTitle(location.coords.latitude, location.coords.longitude);
    };

    getLocationAsync();
  }, [initialLatitude, initialLongitude, fetchMarkerTitle]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <View />,
    });
  }, [navigation]);

  const onRegionChange = useCallback(
    (region: Region) => {
      const { latitude, longitude } = region;
      setDraggedMarkerCoordinate({ latitude, longitude });
      setMarkerCoordinate({ latitude: region.latitude, longitude: region.longitude });
      fetchMarkerTitle(region.latitude, region.longitude);
    },
    [fetchMarkerTitle]
  );

  const handleAddressSearch = async () => {
    if (!searchAddress) return;
    try {
      const geocode = await Location.geocodeAsync(searchAddress);
      if (geocode && geocode.length > 0) {
        const { latitude, longitude } = geocode[0];
        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });
        setMarkerCoordinate({ latitude, longitude });
        setDraggedMarkerCoordinate({ latitude, longitude });
        fetchMarkerTitle(latitude, longitude);
      } else {
        setMarkerTitle('Address not found');
        setMarkerCoordinate(null);
        setDraggedMarkerCoordinate(null);
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      setMarkerTitle('Error searching address');
      setMarkerCoordinate(null);
      setDraggedMarkerCoordinate(null);
    }
  };
  const handleMarkerDragEnd = useCallback(
    (event: { nativeEvent: { coordinate: any } }) => {
      const { coordinate } = event.nativeEvent;
      setMarkerCoordinate(coordinate);
      setDraggedMarkerCoordinate(coordinate);
      fetchMarkerTitle(coordinate.latitude, coordinate.longitude);
      setCurrentRegion({
        ...coordinate,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    },
    [fetchMarkerTitle, setCurrentRegion, setMarkerCoordinate]
  );

  const handleSetLocation = useCallback(() => {
    if (markerCoordinate) {
      setLocation({
        latitude: markerCoordinate.latitude,
        longitude: markerCoordinate.longitude,
      });
    }
    navigation.goBack();
  }, [markerCoordinate, setLocation, navigation]);

  return (
    <View className="flex-1">
      <View className="p-4">
        <View className="mb-2 flex-row items-center space-x-2">
          <TextInput
            className="flex-1 rounded-md border border-gray-300 p-3"
            placeholder="Search address"
            value={searchAddress}
            onChangeText={setSearchAddress}
          />
          <TouchableOpacity className="rounded-md bg-blue-500 p-3" onPress={handleAddressSearch}>
            <Text className="text-center text-white">Search</Text>
          </TouchableOpacity>
        </View>
      </View>
      {currentRegion && (
        <MapView
          style={StyleSheet.absoluteFillObject}
          initialRegion={currentRegion}
          showsUserLocation
          showsMyLocationButton
          provider={PROVIDER_GOOGLE}
          ref={mapRef}
          onRegionChange={onRegionChange}>
          {draggedMarkerCoordinate && (
            <Marker
              coordinate={draggedMarkerCoordinate}
              title={markerTitle}
              draggable
              onDragEnd={handleMarkerDragEnd}
            />
          )}
        </MapView>
      )}
      <View className="absolute top-0 w-full flex-row justify-center space-x-2 p-4">
        {draggedMarkerCoordinate && (
          <View className="items-center">
            <Text className="font-bold">
              Latitude: {draggedMarkerCoordinate.latitude.toFixed(6)}
            </Text>
            <Text className="font-bold">
              Longitude: {draggedMarkerCoordinate.longitude.toFixed(6)}
            </Text>
          </View>
        )}
      </View>
      <View className="absolute bottom-0 w-full flex-row space-x-2 p-4">
        <TouchableOpacity
          onPress={handleSetLocation}
          className="flex-1 items-center rounded bg-green-500 p-3">
          <Text className="text-base font-bold">Set Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
