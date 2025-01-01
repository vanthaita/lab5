import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';

const Place = () => {
  const { width, height } = useWindowDimensions();

  const initialPlaceData = {
    id: 5,
    name: 'Machu Picchu',
    image_uri:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Machu_Picchu%2C_Peru.jpg/640px-Machu_Picchu%2C_Peru.jpg',
    latitude: -13.1631,
    longitude: -72.545,
    address: 'Aguas Calientes, Peru',
  };
  const [currentPlace, setCurrentPlace] = useState(initialPlaceData);

  const handleChangeLocation = () => {
    // Simulate a change in location data
    const newLocation = {
      latitude: -10.1234,
      longitude: -70.5678,
      address: 'Some other location in Peru',
    };
    setCurrentPlace((prevState) => ({
      ...prevState,
      ...newLocation,
    }));
  };

  return (
    <ScrollView className="flex-1 bg-gray-100" contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ width, height }} className=" p-6">
        <Text className="mb-3 text-center text-3xl font-bold text-gray-800">
          {currentPlace.name}
        </Text>
        <Image
          className="mb-6 h-64 w-full rounded-md"
          source={{ uri: currentPlace.image_uri }}
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
