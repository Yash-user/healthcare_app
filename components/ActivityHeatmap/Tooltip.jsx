// app/components/ActivityHeatmap/Tooltip.jsx
import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable } from "react-native";

export const Tooltip = ({ content, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        onLongPress={() => setVisible(true)}
        activeOpacity={0.8}
        delayLongPress={200}
      >
        {children}
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
          <View style={styles.container}>
            <View style={styles.tooltip}>
              <Text style={styles.text}>{content}</Text>
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  container: { alignItems: "center", justifyContent: "center" },
  tooltip: {
    backgroundColor: "#111827",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    maxWidth: 260,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  text: { color: "#fff", fontSize: 13, textAlign: "center", lineHeight: 18 },
});
