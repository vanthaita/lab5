import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import axiosInstance from '../axios';

type LocationType = {
  id: string;
  title: string;
  image: string;
  latitude: string;
  longitude: string;
  address?: string;
};

const Place = () => {
  const { width, height } = useWindowDimensions();
  const { placeId } = useLocalSearchParams();
  const [currentPlace, setCurrentPlace] = useState<LocationType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await axiosInstance.get(`/places/${placeId}`);
        setCurrentPlace(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching place:', error);
        setIsLoading(false);
      }
    };

    fetchPlace();
  }, [placeId]);

  const handleChangeLocation = () => {
    if (currentPlace) {
      router.push({
        pathname: '/Map/map',
        params: {
          initialLatitude: currentPlace.latitude,
          initialLongitude: currentPlace.longitude,
        },
      });
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" color="gray" />
      </View>
    );
  }

  if (!currentPlace) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-lg">Place not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100" contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ width, height }} className=" p-6">
        <Text className="mb-3 text-center text-3xl font-bold text-gray-800">
          {currentPlace.title}
        </Text>
        <Image
          className="mb-6 h-64 w-full rounded-md"
          source={{ uri: currentPlace.image }}
          resizeMode="cover"
        />
        <View className="mb-4">
          <Text className="text-lg font-semibold text-gray-700">Address:</Text>
          <Text className="text-base text-gray-600">{currentPlace.address}</Text>
        </View>
        <View className="mb-4">
          <Text className="text-lg font-semibold text-gray-700">Latitude:</Text>
          <Text className="text-base text-gray-600">{currentPlace.latitude}</Text>
        </View>
        <View className="mb-4">
          <Text className="text-lg font-semibold text-gray-700">Longitude:</Text>
          <Text className="text-base text-gray-600">{currentPlace.longitude}</Text>
        </View>
        <TouchableOpacity
          className="mt-6 w-2/3 self-center rounded-md bg-blue-500 px-4 py-3"
          onPress={handleChangeLocation}>
          <Text className="text-center text-lg text-white">Change Location</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Place;
