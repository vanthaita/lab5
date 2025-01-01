// Tạ Văn Thái
// 22521377
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { View, TouchableOpacity } from 'react-native';

export default function TabLayout() {
  const router = useRouter();
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap;
          switch (route.name) {
            case 'index':
              iconName = focused ? 'map-marker' : 'map-marker-outline';
              break;
            case 'media':
              iconName = focused ? 'image' : 'image-outline';
              break;
            default:
              iconName = 'ellipse';
          }

          return (
            <View>
              <MaterialCommunityIcons name={iconName} size={size} color={color} />
            </View>
          );
        },
        tabBarStyle: { backgroundColor: 'white' },
      })}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'My Places',
          headerShown: true,
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: 'bold',
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                router.push('/places/places')
              }}
              style={{ marginRight: 15 }}
            >
              <Ionicons name="add" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="media"
        options={{
          title: 'Media',
        }}
      />
      
    </Tabs>
  );
}
