import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';

type LocationType = {
  id: number;
  name: string;
  image_uri: string;
  latitude: number;
  longitude: number;
  address?: string; // Add address field
};

export default function LocationListScreen() {
  const [locations, setLocations] = useState<LocationType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate data loading delay
    setTimeout(() => {
      setLocations(exampleLocations);
      setIsLoading(false);
    }, 500);
  }, []);

  const renderItem = ({ item }: { item: LocationType }) => (
    <TouchableOpacity
      className="mb-3 flex-row items-center rounded-lg bg-white p-4 shadow-md"
      onPress={() => router.push('/(route)/[planceId]')}
      >
      <Image source={{ uri: item.image_uri }} className="mr-4 h-20 w-20 rounded-md" />
      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
        {item.address && <Text className="text-sm text-gray-600">{item.address}</Text>}
        <Text className="text-sm text-gray-500">
          {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}
        </Text>
      </View>
      <Feather name="chevron-right" size={24} color="gray" />
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center">
      <Text className="text-lg text-gray-500">No locations yet.</Text>
      <TouchableOpacity
        className="mt-4 rounded-md bg-blue-500 p-3"
        // onPress={() => router.push('/AddLocation')}
        >
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
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
        />
      )}
    </View>
  );
}

const exampleLocations: LocationType[] = [
  {
    id: 1,
    name: 'Eiffel Tower',
    image_uri:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Tour_Eiffel_from_the_Trocadero_in_Paris_on_a_sunny_day.jpg/640px-Tour_Eiffel_from_the_Trocadero_in_Paris_on_a_sunny_day.jpg',
    latitude: 48.8584,
    longitude: 2.2945,
    address: 'Champ de Mars, 5 Av. Anatole France, 75007 Paris, France',
  },
  {
    id: 2,
    name: 'Times Square',
    image_uri:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Times_Square%2C_New_York_City_-_panoramio_%281%29.jpg/640px-Times_Square%2C_New_York_City_-_panoramio_%281%29.jpg',
    latitude: 40.758,
    longitude: -73.9855,
    address: 'Manhattan, New York, NY 10036, United States',
  },
  {
    id: 3,
    name: 'Sydney Opera House',
    image_uri:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Sydney_Opera_House_with_harbour_bridge.jpg/640px-Sydney_Opera_House_with_harbour_bridge.jpg',
    latitude: -33.8568,
    longitude: 151.2153,
    address: 'Bennelong Point, Sydney NSW 2000, Australia',
  },
  {
    id: 4,
    name: 'Great Wall of China',
    image_uri:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Great_Wall_of_China_at_Jinshanling-004.jpg/640px-Great_Wall_of_China_at_Jinshanling-004.jpg',
    latitude: 40.4319,
    longitude: 116.5704,
    address: 'Huairou District, China',
  },
  {
    id: 5,
    name: 'Machu Picchu',
    image_uri:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Machu_Picchu%2C_Peru.jpg/640px-Machu_Picchu%2C_Peru.jpg',
    latitude: -13.1631,
    longitude: -72.545,
    address: 'Aguas Calientes, Peru',
  },
];
