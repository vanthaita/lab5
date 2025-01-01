import * as Location from 'expo-location';
import { useNavigation } from 'expo-router';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import MapView, { Region, PROVIDER_GOOGLE, Marker } from 'react-native-maps';

export default function App() {
  const navigation = useNavigation();
  const mapRef = useRef<MapView>(null);
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLocationAsync = async () => {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
      setLoading(false);
    };

    getLocationAsync();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={focusMap}>
          <View className="p-2.5">
            <Text>Choice</Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const focusMap = useCallback(() => {
    if (currentRegion) {
      mapRef.current?.animateToRegion(currentRegion, 1000);
    }
  }, [currentRegion]);

  const onRegionChangeComplete = useCallback((region: Region) => {
    console.log(region);
  }, []);

  const handleMapPress = useCallback(
    (event: { nativeEvent: { coordinate: any } }) => {
      const { coordinate } = event.nativeEvent;
      setCurrentRegion({
        ...coordinate,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    },
    [setCurrentRegion]
  );

  if (loading || !currentRegion) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">Loading map...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={currentRegion}
        showsUserLocation
        showsMyLocationButton
        provider={PROVIDER_GOOGLE}
        ref={mapRef}
        onRegionChangeComplete={onRegionChangeComplete}
        onPress={handleMapPress}>
        {currentRegion && <Marker coordinate={currentRegion} title="New Focus Location" />}
      </MapView>
      <TouchableOpacity
        onPress={focusMap}
        className="bg-lightblue absolute bottom-5 left-5 right-5 items-center rounded p-3">
        <Text className="text-base font-bold">Recenter Map</Text>
      </TouchableOpacity>
    </View>
  );
}
