import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  Text,
  Alert,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native';
import { useEditorStore } from '../../app/stores/editor-store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  saveBookmark,
  getBookmarks,
  deleteBookmark,
  updateBookmarkUsage,
  Bookmark,
} from '../../app/utils/bookmarks';

export default function BookmarksManager() {
  const [visible, setVisible] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [bookmarkName, setBookmarkName] = useState('');
  const { nodes, addNode } = useEditorStore();

  useEffect(() => {
    if (visible) {
      loadBookmarks();
    }
  }, [visible]);

  const loadBookmarks = async () => {
    try {
      const list = await getBookmarks();
      setBookmarks(list.sort((a, b) => b.usageCount - a.usageCount));
    } catch (error) {
      Alert.alert('Error', 'Failed to load bookmarks');
    }
  };

  const handleSaveBookmark = async () => {
    if (!bookmarkName.trim()) {
      Alert.alert('Error', 'Please enter a bookmark name');
      return;
    }

    if (nodes.length === 0) {
      Alert.alert('Error', 'Please add nodes to save');
      return;
    }

    try {
      await saveBookmark(bookmarkName, nodes);
      Alert.alert('Success', 'Bookmark saved');
      setBookmarkName('');
      loadBookmarks();
    } catch (error) {
      Alert.alert('Error', 'Failed to save bookmark');
    }
  };

  const handleLoadBookmark = async (bookmark: Bookmark) => {
    try {
      bookmark.nodes.forEach((node) => addNode(node));
      await updateBookmarkUsage(bookmark.id);
      Alert.alert('Success', `Loaded "${bookmark.name}"`);
      setVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to load bookmark');
    }
  };

  const handleDeleteBookmark = async (id: string) => {
    try {
      await deleteBookmark(id);
      loadBookmarks();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete bookmark');
    }
  };

  return (
    <>
      <Pressable
        style={styles.button}
        onPress={() => setVisible(true)}
      >
        <MaterialCommunityIcons name="bookmark-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>Bookmarks</Text>
      </Pressable>

      <Modal visible={visible} animationType="slide">
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Bookmarks</Text>
            <Pressable onPress={() => setVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.content}>
            {/* Save Current Configuration */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Save Current Configuration</Text>
              <View style={styles.saveRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Bookmark name"
                  placeholderTextColor="#64748b"
                  value={bookmarkName}
                  onChangeText={setBookmarkName}
                />
                <Pressable
                  style={styles.saveButton}
                  onPress={handleSaveBookmark}
                >
                  <MaterialCommunityIcons
                    name="plus"
                    size={20}
                    color="#fff"
                  />
                </Pressable>
              </View>
            </View>

            {/* Saved Bookmarks */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Saved Bookmarks ({bookmarks.length})
              </Text>
              {bookmarks.length > 0 ? (
                <FlatList
                  data={bookmarks}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <View style={styles.bookmarkCard}>
                      <Pressable
                        style={styles.bookmarkContent}
                        onPress={() => handleLoadBookmark(item)}
                      >
                        <View>
                          <Text style={styles.bookmarkName}>{item.name}</Text>
                          <Text style={styles.bookmarkMeta}>
                            {item.nodes.length} node(s) • Used {item.usageCount} time(s)
                          </Text>
                        </View>
                        <MaterialCommunityIcons
                          name="chevron-right"
                          size={20}
                          color="#64748b"
                        />
                      </Pressable>

                      <Pressable
                        style={styles.deleteButton}
                        onPress={() => {
                          Alert.alert(
                            'Delete Bookmark',
                            `Remove "${item.name}"?`,
                            [
                              { text: 'Cancel', style: 'cancel' },
                              {
                                text: 'Delete',
                                style: 'destructive',
                                onPress: () => handleDeleteBookmark(item.id),
                              },
                            ]
                          );
                        }}
                      >
                        <MaterialCommunityIcons
                          name="trash-can-outline"
                          size={18}
                          color="#ef4444"
                        />
                      </Pressable>
                    </View>
                  )}
                  keyExtractor={(item) => item.id}
                />
              ) : (
                <View style={styles.empty}>
                  <MaterialCommunityIcons
                    name="bookmark-outline"
                    size={48}
                    color="#64748b"
                  />
                  <Text style={styles.emptyText}>No bookmarks yet</Text>
                  <Text style={styles.emptySubtext}>
                    Save your first configuration above
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
  saveRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#e2e8f0',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkCard: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#334155',
  },
  bookmarkContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  bookmarkName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  bookmarkMeta: {
    fontSize: 12,
    color: '#94a3b8',
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#334155',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
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
