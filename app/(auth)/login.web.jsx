import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  Image,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// hooks
import { useAuthContext } from "../../hooks/useAuthContext";
import { useLogin } from "../../hooks/useLogin";

export default function Login() {
  const { width } = useWindowDimensions();
  const isWide = width >= 900; // breakpoint for desktop layout
  const cardWidth = isWide ? Math.min(720, width * 0.8) : "92%";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login, error, isLoading } = useLogin();
  const { user } = useAuthContext();
  const passwordInputRef = useRef(null);

  // hover states (web)
  const [btnHover, setBtnHover] = useState(false);
  const [registerHover, setRegisterHover] = useState(false);
  const [eyeHover, setEyeHover] = useState(false);

  const handleLogin = async () => {
    await login(username, password);
  };

  useEffect(() => {
    if (user) {
      if (user.role === "teacher") {
        router.replace("/(tabs)/teacher/dashboard");
      } else if (user.role === "admin") {
        router.replace("/(adminTabs)/dashboard");
      } else {
        router.replace("/");
      }
    }
  }, [user]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.outerContainer, { backgroundColor: "#f4f6f9" }]}>
        <View style={[styles.headerContainer, isWide && { marginBottom: 40 }]}>
          <Text style={[styles.title, isWide && styles.titleWide]}>
            Welcome, cher!
          </Text>
        </View>

        <View
          style={[
            styles.card,
            {
              width: cardWidth,
              flexDirection: isWide ? "row" : "column",
              padding: isWide ? 32 : 20,
            },
          ]}
        >

          {isWide && (
            <View style={styles.illustrationWrap}>
              <Image
                source={require("../../assets/login-illustration.png")}
                style={styles.illustration}
                resizeMode="contain"
                accessibilityIgnoresInvertColors
              />
            </View>
          )}


          <View style={[styles.formWrap, isWide && { paddingLeft: 24 }]}>
            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Text style={[styles.label, isWide && styles.labelWide]}>Username</Text>
            <TextInput
              style={[styles.input, isWide && styles.inputWide]}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={[styles.label, isWide && styles.labelWide]}>Password</Text>
            <View style={[styles.passwordContainer, isWide && styles.inputWide]}>
              <TextInput
                style={[styles.passwordInput]}
                placeholder="Password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                ref={passwordInputRef}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Pressable
                onPress={() => setShowPassword((s) => !s)}
                onHoverIn={() => setEyeHover(true)}
                onHoverOut={() => setEyeHover(false)}
                style={({ pressed }) => [
                  styles.eyeButton,
                  pressed && { opacity: 0.7 },
                ]}
                android_ripple={{ color: "#00000010" }}
                accessibilityLabel={showPassword ? "Hide password" : "Show password"}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color={eyeHover ? "#111" : "#555"}
                />
              </Pressable>
            </View>

            <Pressable
              onPress={handleLogin}
              onHoverIn={() => setBtnHover(true)}
              onHoverOut={() => setBtnHover(false)}
              disabled={isLoading}
              style={({ pressed }) => [
                styles.button,
                isLoading && styles.buttonDisabled,
                btnHover && !isLoading && styles.buttonHover,
                pressed && { transform: [{ scale: 0.995 }] },
              ]}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Logging in..." : "Log In"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/register")}
              onHoverIn={() => setRegisterHover(true)}
              onHoverOut={() => setRegisterHover(false)}
              style={{ alignSelf: "center", marginTop: 12 }}
            >
              <Text
                style={[
                  styles.registerText,
                  registerHover && styles.registerHover,
                ]}
              >
                Don’t have an account? Register
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={{ height: 28 }} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  headerContainer: {
    marginBottom: 12,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#222",
    textAlign: "center",
    marginBottom: 8,
  },
  titleWide: {
    fontSize: 34,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 6,
    alignItems: "stretch",
    justifyContent: "center",
  },

  illustrationWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 8,
  },
  illustration: {
    width: 240,
    height: 240,
    opacity: 0.98,
  },

  formWrap: {
    flex: 1,
  },

  label: {
    color: "#444",
    marginBottom: 6,
    marginLeft: 4,
    fontSize: 13,
  },
  labelWide: {
    fontSize: 14,
  },

  input: {
    height: 48,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  inputWide: {
    height: 54,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 14,
    paddingRight: 8,
    backgroundColor: "#fff",
    height: 48,
  },

  passwordInput: {
    flex: 1,
    paddingHorizontal: 14,
    fontSize: 16,
    height: "100%",
  },

  eyeButton: {
    padding: 8,
    marginLeft: 4,
    cursor: Platform.OS === "web" ? "pointer" : "auto",
  },

  button: {
    backgroundColor: "#2E8B57",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 4,
    cursor: Platform.OS === "web" ? "pointer" : "auto",
  },
  buttonHover: {
    backgroundColor: "#278047",
  },
  buttonDisabled: {
    backgroundColor: "#9E9E9E",
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },

  error: {
    color: "#d32f2f",
    marginBottom: 12,
    textAlign: "center",
  },

  registerText: {
    color: "#1565C0",
    fontSize: 15,
    textDecorationLine: "underline",
  },
  registerHover: {
    textDecorationLine: "none",
    opacity: 0.85,
  },
});
