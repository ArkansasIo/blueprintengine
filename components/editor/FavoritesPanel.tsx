import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  Text,
  Alert,
  ScrollView,
  FlatList,
} from 'react-native';
import { useEditorStore } from '../../app/stores/editor-store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  getFavorites,
  removeFromFavorites,
  updateFavoriteUsage,
  FavoriteNode,
  addToFavorites,
} from '../../app/utils/favorites';

export default function FavoritesPanel() {
  const [visible, setVisible] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteNode[]>([]);
  const { selectedNodeId, nodes, addNode } = useEditorStore();

  useEffect(() => {
    if (visible) {
      loadFavorites();
    }
  }, [visible]);

  const loadFavorites = async () => {
    try {
      const list = await getFavorites();
      setFavorites(list.sort((a, b) => b.usageCount - a.usageCount));
    } catch (error) {
      Alert.alert('Error', 'Failed to load favorites');
    }
  };

  const handleAddToFavorites = async () => {
    if (!selectedNodeId) {
      Alert.alert('Error', 'Please select a node first');
      return;
    }

    try {
      const node = nodes.find((n) => n.id === selectedNodeId);
      if (!node) return;

      await addToFavorites(node);
      Alert.alert('Success', `"${node.label}" added to favorites`);
      loadFavorites();
    } catch (error) {
      Alert.alert('Error', 'Failed to add favorite');
    }
  };

  const handleUseFavorite = async (favorite: FavoriteNode) => {
    try {
      const newNode = {
        ...favorite.node,
        id: Math.random().toString(36).substr(2, 9),
        position: {
          x: Math.random() * 100,
          y: Math.random() * 100,
        },
      };
      addNode(newNode);
      await updateFavoriteUsage(favorite.id);
      Alert.alert('Success', `Created node from favorite`);
    } catch (error) {
      Alert.alert('Error', 'Failed to create node');
    }
  };

  const handleRemoveFavorite = async (id: string) => {
    try {
      await removeFromFavorites(id);
      loadFavorites();
    } catch (error) {
      Alert.alert('Error', 'Failed to remove favorite');
    }
  };

  return (
    <>
      <Pressable
        style={styles.button}
        onPress={() => setVisible(true)}
      >
        <MaterialCommunityIcons name="star-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>Favorites</Text>
      </Pressable>

      <Modal visible={visible} animationType="slide">
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Favorites</Text>
            <Pressable onPress={() => setVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.content}>
            {/* Add Current Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Add</Text>
              <Pressable
                style={[
                  styles.addButton,
                  !selectedNodeId && styles.addButtonDisabled,
                ]}
                onPress={handleAddToFavorites}
                disabled={!selectedNodeId}
              >
                <MaterialCommunityIcons
                  name="plus"
                  size={20}
                  color="#fff"
                />
                <Text style={styles.addButtonText}>
                  {selectedNodeId
                    ? 'Add Selected to Favorites'
                    : 'Select a Node First'}
                </Text>
              </Pressable>
            </View>

            {/* Favorite Nodes */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Saved Favorites ({favorites.length})
              </Text>

              {favorites.length > 0 ? (
                <FlatList
                  data={favorites}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <View style={styles.favoriteCard}>
                      <View style={styles.favoriteHeader}>
                        <View
                          style={[
                            styles.typeIndicator,
                            { backgroundColor: item.node.color || '#8b5cf6' },
                          ]}
                        />
                        <View style={styles.favoriteInfo}>
                          <Text style={styles.favoriteName}>
                            {item.name}
                          </Text>
                          <Text style={styles.favoriteMeta}>
                            {item.node.type} • {item.node.pins.length} pins • Used {item.usageCount}x
                          </Text>
                        </View>
                        <MaterialCommunityIcons
                          name="star"
                          size={20}
                          color="#f59e0b"
                        />
                      </View>

                      <View style={styles.favoriteActions}>
                        <Pressable
                          style={styles.useButton}
                          onPress={() => handleUseFavorite(item)}
                        >
                          <MaterialCommunityIcons
                            name="plus-circle"
                            size={18}
                            color="#06b6d4"
                          />
                          <Text style={styles.useButtonText}>Use</Text>
                        </Pressable>

                        <Pressable
                          style={styles.removeButton}
                          onPress={() => {
                            Alert.alert(
                              'Remove Favorite',
                              `Remove "${item.name}" from favorites?`,
                              [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                  text: 'Remove',
                                  style: 'destructive',
                                  onPress: () =>
                                    handleRemoveFavorite(item.id),
                                },
                              ]
                            );
                          }}
                        >
                          <MaterialCommunityIcons
                            name="star"
                            size={18}
                            color="#f59e0b"
                          />
                        </Pressable>
                      </View>
                    </View>
                  )}
                  keyExtractor={(item) => item.id}
                />
              ) : (
                <View style={styles.empty}>
                  <MaterialCommunityIcons
                    name="star-outline"
                    size={48}
                    color="#64748b"
                  />
                  <Text style={styles.emptyText}>No favorites yet</Text>
                  <Text style={styles.emptySubtext}>
                    Add your first favorite above
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#64748b',
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: '#1e293b',
  },
  buttonText: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  modal: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    marginTop: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    fontSize: 24,
    color: '#94a3b8',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#cbd5e1',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f59e0b',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },
  favoriteCard: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  favoriteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  favoriteInfo: {
    flex: 1,
  },
  favoriteName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  favoriteMeta: {
    fontSize: 11,
    color: '#94a3b8',
  },
  favoriteActions: {
    flexDirection: 'row',
    gap: 8,
  },
  useButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#0c4a6e',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#06b6d4',
    gap: 6,
  },
  useButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#06b6d4',
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#cbd5e1',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
});
