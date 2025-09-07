// components/ProfileHeader.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
} from "react-native";

export default function ProfileHeader({ user, onSettings = () => {}, onLogout = () => {} }) {
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleSettings = () => {
    closeMenu();
    onSettings();
  };

  const handleLogout = () => {
    closeMenu();
    onLogout();
  };

  return (
    <View style={styles.header}>
      {/* three-dots button (top-right) */}
      <View style={styles.menuButtonWrap}>
        <TouchableOpacity onPress={openMenu} style={styles.menuButton}>
          <Text style={styles.menuDots}>⋯</Text>
        </TouchableOpacity>
      </View>

      <Image source={{ uri: user?.avatar }} style={styles.avatar} />
      <Text style={styles.name}>{user?.name}</Text>
      {user?.email ? <Text style={styles.email}>{user.email}</Text> : null}
      {user?.private?.address ? (
        <Text style={styles.info}>📍 {user.address}</Text>
      ) : null}
      {user?.private?.contact ? (
        <Text style={styles.info}>📞 {user.contact}</Text>
      ) : null}

      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <Pressable style={styles.backdrop} onPress={closeMenu}>
          <View style={styles.menuBox}>
            <TouchableOpacity style={styles.menuItem} onPress={handleSettings}>
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Text style={[styles.menuText, styles.logoutText]}>Log out</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 10,
    width: "100%",
  },
  menuButtonWrap: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
  },
  menuButton: {
    padding: 8,
  },
  menuDots: {
    fontSize: 22,
    color: "#444",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: { fontSize: 22, fontWeight: "700", color: "#333" },
  email: { fontSize: 14, color: "gray", marginTop: 2 },
  info: { fontSize: 13, color: "#555", marginTop: 4 },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  menuBox: {
    position: "absolute",
    top: 50, // adjust if you have a status bar/safe area
    right: 12,
    width: 160,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  menuText: {
    fontSize: 15,
    color: "#222",
  },
  logoutText: {
    color: "#d9534f",
  },
});
