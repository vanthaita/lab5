import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import axiosInstance from '../axios';

type MediaType = {
  id: string;
  uri: string;
  type: 'image' | 'video'; 
};

const Media = () => {
  const router = useRouter();
  const [media, setMedia] = useState<MediaType[]>([]); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axiosInstance.get('/places');
        const fetchedImages: MediaType[] = response.data.map(
          (item: { id: string; image: string }) => ({
            id: item.id,
            uri: item.image,
            type: 'image',
          })
        );
        setMedia(fetchedImages);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching images:', error);
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleCameraPress = () => {
    router.push('/(route)/camera');
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" color="gray" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <View className="flex-row items-center justify-between border-b border-gray-300 bg-white px-4 pb-2 pt-5">
        <Text className="text-2xl font-bold">Gallery</Text>
        <TouchableOpacity onPress={handleCameraPress}>
          <Ionicons name="camera-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="mt-2 flex-row flex-wrap justify-around px-2">
          {media.map((item) => (
            <View key={item.id} className="mb-3 w-[48%] bg-white shadow-md">
              {item.type === 'image' ? (
                <Image source={{ uri: item.uri }} className="h-36 w-full rounded-md" />
              ) : (
                <View className="h-36 w-full items-center justify-center rounded-md bg-gray-300">
                  <Text className="text-lg font-bold">Video</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Media;
