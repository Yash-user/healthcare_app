// app/components/ProfileHeader.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";

export default function ProfileHeader({ user = {}, onSettings = () => {}, onLogout = () => {} }) {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.topRight}>
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
          <Text style={styles.menuDots}>⋯</Text>
        </TouchableOpacity>
      </View>

      <Image source={{ uri: user.avatar || "https://i.pravatar.cc/150" }} style={styles.avatar} />
      <Text style={styles.name}>{user.name}</Text>
      {user.email ? <Text style={styles.sub}>{user.email}</Text> : null}
      {user.address ? <Text style={styles.meta}>📍 {user.address}</Text> : null}
      {user.contact ? <Text style={styles.meta}>📞 {user.contact}</Text> : null}

      <Modal transparent visible={menuVisible} animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuBox}>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); onSettings(); }}>
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); onLogout(); }}>
              <Text style={[styles.menuText, { color: "#d9534f" }]}>Log out</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", marginBottom: 12 },
  topRight: { position: "absolute", right: 6, top: Platform.OS === "ios" ? 12 : 6 },
  menuButton: { padding: 6 },
  menuDots: { fontSize: 22, color: "#333" },

  avatar: { width: 98, height: 98, borderRadius: 50, marginBottom: 8, backgroundColor: "#eee" },
  name: { fontSize: 20, fontWeight: "700", color: "#222", marginTop: 4 },
  sub: { fontSize: 13, color: "#6b6b6b", marginTop: 4 },
  meta: { fontSize: 13, color: "#6b6b6b", marginTop: 4 },

  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.15)" },
  menuBox: {
    position: "absolute",
    top: 50,
    right: 14,
    width: 150,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
  },
  menuItem: { paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: "#f2f2f2" },
  menuText: { fontSize: 15, color: "#222" },
});
