import { StyleSheet, Text, View } from 'react-native'
import { Link, Redirect, router } from 'expo-router';
import React from 'react'

const Home = () => {
  return (
    <View>
      <Text onPress={() => router.push('/teacher/leave-history')}>
        Home Bilat
      </Text>

      <Text onPress={() => router.push('/(auth)/login')}>
        Login
      </Text>

      <Text onPress={() => router.push('/(auth)/register')}>
        Signup
      </Text>

      <View>
        <Text onPress={() => router.push('/(teacher)/dashboard')}>
          Teacher Dashboard
        </Text>
      </View>

      <View>
        <Text onPress={() => router.push('/(teacher)/file-leave')}>
          Teacher file leave
        </Text>
      </View>

      <View>
        <Text onPress={() => router.push('/(teacher)/leave-history')}>
          Teacher leave-history
        </Text>
      </View>

      <View>
        <Text onPress={() => router.push('/(teacher)/my-leaves')}>
          Teacher my-leaves
        </Text>
      </View>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({})