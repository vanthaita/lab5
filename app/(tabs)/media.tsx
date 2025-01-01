import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';

const Media = () => {
  const router = useRouter();
  const mediaFiles = [
    {
      id: '1',
      type: 'image',
      uri: 'https://placekitten.com/200/300',
    },
    {
      id: '2',
      type: 'video',
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
    {
      id: '3',
      type: 'image',
      uri: 'https://placekitten.com/201/300',
    },
    {
      id: '4',
      type: 'video',
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    },
    {
      id: '5',
      type: 'image',
      uri: 'https://placekitten.com/202/300',
    },
    {
      id: '6',
      type: 'video',
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    },
    {
      id: '7',
      type: 'image',
      uri: 'https://placekitten.com/203/300',
    },
    {
      id: '8',
      type: 'video',
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    },
    {
      id: '9',
      type: 'image',
      uri: 'https://placekitten.com/204/300',
    },
    {
      id: '10',
      type: 'image',
      uri: 'https://placekitten.com/205/300',
    },
    {
      id: '11',
      type: 'image',
      uri: 'https://placekitten.com/206/300',
    },
    {
      id: '12',
      type: 'image',
      uri: 'https://placekitten.com/207/300',
    },
    {
      id: '13',
      type: 'image',
      uri: 'https://placekitten.com/208/300',
    },
    {
      id: '14',
      type: 'image',
      uri: 'https://placekitten.com/209/300',
    },
  ].sort(() => Math.random() - 0.5);

  const handleCameraPress = () => {
    router.push('/(route)/camera');
  };

  return (
    <View className="flex-1 bg-gray-100">
      <View className="flex-row items-center justify-between border-b border-gray-300 bg-white px-4 pb-2 pt-5">
        <Text className="text-2xl font-bold">Gallary</Text>
        <TouchableOpacity onPress={handleCameraPress}>
          <Ionicons name="camera-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="mt-2 flex-row flex-wrap justify-around px-2">
          {mediaFiles.map((file) => (
            <View key={file.id} className="mb-3 w-[48%] bg-white shadow-md">
              {file.type === 'image' ? (
                <Image source={{ uri: file.uri }} className="h-36 w-full rounded-md" />
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
