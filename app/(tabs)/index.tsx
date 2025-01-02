import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import axiosInstance from '../axios';

type LocationType = {
  id: string;
  title: string;
  image: string;
  latitude: string;
  longitude: string;
  address?: string;
};

export default function LocationListScreen() {
  const [locations, setLocations] = useState<LocationType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axiosInstance.get('/places');
        setLocations(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching locations:', error);
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const renderItem = ({ item }: { item: LocationType }) => (
    <TouchableOpacity
      className="mb-3 flex-row items-center rounded-lg bg-white p-4 shadow-md"
      onPress={() => router.push(`/(route)/${item.id}`)}>
      <Image source={{ uri: item.image }} className="mr-4 h-20 w-20 rounded-md" />
      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-800">{item.title}</Text>
        {item.address && <Text className="text-sm text-gray-600">{item.address}</Text>}
        <Text className="text-sm text-gray-500">
          {parseFloat(item.latitude).toFixed(5)}, {parseFloat(item.longitude).toFixed(5)}
        </Text>
      </View>
      <Feather name="chevron-right" size={24} color="gray" />
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center">
      <Text className="text-lg text-gray-500">No locations yet.</Text>
      <TouchableOpacity className="mt-4 rounded-md bg-blue-500 p-3">
        <Text className="text-center font-semibold text-white">Add one!</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100 p-5">
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="gray" />
        </View>
      ) : (
        <FlatList
          data={locations}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
        />
      )}
    </View>
  );
}
