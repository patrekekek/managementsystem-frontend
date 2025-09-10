import { StyleSheet, Text, View } from 'react-native'
import { Link, Redirect, router } from 'expo-router';
import React from 'react'

const Home = () => {
  return (
    <View>
      <Text
        onPress={() => router.push('/teacher/leave-history')}
      >Home Bilat</Text>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({})