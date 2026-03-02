import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  aiBlueprintChat,
  ChatMessage,
  ChatConversation,
  ProjectContext,
} from '../../app/utils/ai-blueprint-chat';

export default function AIBlueprintChat() {
  const [visible, setVisible] = useState(false);
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [showProjectSetup, setShowProjectSetup] = useState(true);
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');

  // Initialize chat on open
  const handleOpenChat = () => {
    setVisible(true);
    if (!conversation) {
      setShowProjectSetup(true);
    }
  };

  // Start new project
  const handleStartProject = () => {
    if (!projectName.trim()) {
      Alert.alert('Error', 'Please enter a project name');
      return;
    }

    const projectContext: ProjectContext = {
      name: projectName,
      type: 'Game',
      description: projectDesc,
      platforms: ['PC', 'Console'],
      targetAudience: 'Players',
      features: [],
      technicalStack: ['UE5', 'Blueprint'],
    };

    const newConversation = aiBlueprintChat.initializeConversation(projectName, projectContext);
    setConversation(newConversation);
    setMessages(newConversation.messages);
    setShowProjectSetup(false);
  };

  // Handle sending message
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !conversation) {
      return;
    }

    const userInput = inputValue;
    setInputValue('');
    setLoading(true);

    try {
      const response = await aiBlueprintChat.processUserMessage(userInput);
      const updatedConversation = aiBlueprintChat.getCurrentConversation();

      if (updatedConversation) {
        setConversation(updatedConversation);
        setMessages(updatedConversation.messages);
      }

      // Auto-scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      Alert.alert('Error', `Failed to process message: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // Render message bubble
  const renderMessageBubble = (message: ChatMessage) => {
    const isUser = message.role === 'user';

    return (
      <View
        key={message.id}
        style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.assistantBubble,
        ]}
      >
        {!isUser && (
          <MaterialCommunityIcons
            name="robot"
            size={16}
            color="#06b6d4"
            style={styles.messageIcon}
          />
        )}
        <Text
          style={[
            styles.messageText,
            isUser ? styles.userText : styles.assistantText,
          ]}
        >
          {message.content}
        </Text>
        {message.metadata?.blueprintGenerated && (
          <Pressable
            style={styles.blueprintBadge}
            onPress={() => {
              Alert.alert(
                'Blueprint Created',
                `Blueprint: ${message.metadata?.blueprintGenerated?.name}\n\nVariables: ${message.metadata?.blueprintGenerated?.variables.length}\nFunctions: ${message.metadata?.blueprintGenerated?.functions.length}`
              );
            }}
          >
            <MaterialCommunityIcons name="cube-outline" size={14} color="#fff" />
            <Text style={styles.blueprintBadgeText}>View Blueprint</Text>
          </Pressable>
        )}
      </View>
    );
  };

  // Project setup screen
  if (showProjectSetup && visible) {
    return (
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.setupContainer}>
            <Pressable
              style={styles.closeButton}
              onPress={() => {
                setVisible(false);
                setShowProjectSetup(true);
              }}
            >
              <MaterialCommunityIcons
                name="close"
                size={24}
                color="#94a3b8"
              />
            </Pressable>

            <MaterialCommunityIcons
              name="robot-excited"
              size={64}
              color="#06b6d4"
              style={styles.setupIcon}
            />

            <Text style={styles.setupTitle}>Create New Project</Text>
            <Text style={styles.setupDesc}>
              Tell me about your project and I'll help you generate blueprints
            </Text>

            <TextInput
              style={styles.setupInput}
              placeholder="Project Name (e.g., Fantasy RPG)"
              placeholderTextColor="#64748b"
              value={projectName}
              onChangeText={setProjectName}
            />

            <TextInput
              style={[styles.setupInput, styles.descriptionInput]}
              placeholder="Project Description (optional)"
              placeholderTextColor="#64748b"
              value={projectDesc}
              onChangeText={setProjectDesc}
              multiline
            />

            <Pressable
              style={styles.startButton}
              onPress={handleStartProject}
            >
              <MaterialCommunityIcons
                name="play-circle-outline"
                size={20}
                color="#fff"
              />
              <Text style={styles.startButtonText}>Start Chatting</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <>
      <Pressable style={styles.button} onPress={handleOpenChat}>
        <MaterialCommunityIcons name="robot" size={20} color="#06b6d4" />
        <Text style={styles.buttonText}>AI Chat</Text>
      </Pressable>

      <Modal visible={visible} animationType="slide">
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitle}>
              <MaterialCommunityIcons
                name="robot-happy"
                size={24}
                color="#06b6d4"
              />
              <View>
                <Text style={styles.title}>Blueprint AI</Text>
                <Text style={styles.subtitle}>
                  {conversation?.title || 'New Project'}
                </Text>
              </View>
            </View>
            <Pressable
              onPress={() => {
                setVisible(false);
                setShowProjectSetup(true);
                aiBlueprintChat.clearConversation();
                setConversation(null);
                setMessages([]);
              }}
            >
              <MaterialCommunityIcons
                name="close"
                size={24}
                color="#94a3b8"
              />
            </Pressable>
          </View>

          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
          >
            {messages.map((message) => renderMessageBubble(message))}
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#06b6d4" />
                <Text style={styles.loadingText}>AI is thinking...</Text>
              </View>
            )}
          </ScrollView>

          {/* Input Area */}
          <View style={styles.inputArea}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Describe your blueprint..."
                placeholderTextColor="#64748b"
                value={inputValue}
                onChangeText={setInputValue}
                onSubmitEditing={handleSendMessage}
                editable={!loading}
              />
              <Pressable
                style={[
                  styles.sendButton,
                  (!inputValue.trim() || loading) && styles.sendButtonDisabled,
                ]}
                onPress={handleSendMessage}
                disabled={!inputValue.trim() || loading}
              >
                <MaterialCommunityIcons
                  name="send"
                  size={20}
                  color={!inputValue.trim() || loading ? '#475569' : '#06b6d4'}
                />
              </Pressable>
            </View>

            {/* Suggestions */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.suggestionsContainer}
            >
              {[
                '⚔️ Create Warrior Character',
                '🎯 Combat System',
                '⚡ Fire Spell Ability',
                '📦 Inventory System',
                '📋 Quest System',
              ].map((suggestion, idx) => (
                <Pressable
                  key={idx}
                  style={styles.suggestionChip}
                  onPress={() => setInputValue(suggestion)}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
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
    borderColor: '#06b6d4',
    borderRadius: 6,
    backgroundColor: '#0c4a6e',
    gap: 6,
  },
  buttonText: {
    color: '#06b6d4',
    fontSize: 12,
    fontWeight: '600',
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

  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },

  subtitle: {
    fontSize: 12,
    color: '#94a3b8',
  },

  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },

  messagesContent: {
    paddingVertical: 16,
    gap: 12,
  },

  messageBubble: {
    maxWidth: '85%',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },

  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#06b6d4',
    borderBottomRightRadius: 4,
  },

  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#1e293b',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  messageIcon: {
    marginRight: 4,
  },

  messageText: {
    fontSize: 13,
    lineHeight: 18,
  },

  userText: {
    color: '#ffffff',
  },

  assistantText: {
    color: '#e2e8f0',
    flex: 1,
  },

  blueprintBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0c4a6e',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 8,
    gap: 4,
    alignSelf: 'flex-start',
  },

  blueprintBadgeText: {
    fontSize: 11,
    color: '#06b6d4',
    fontWeight: '600',
  },

  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },

  loadingText: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 12,
  },

  inputArea: {
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    padding: 12,
    gap: 12,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 12,
  },

  input: {
    flex: 1,
    color: '#e2e8f0',
    paddingVertical: 10,
    fontSize: 14,
  },

  sendButton: {
    padding: 8,
  },

  sendButtonDisabled: {
    opacity: 0.5,
  },

  suggestionsContainer: {
    flexGrow: 0,
  },

  suggestionChip: {
    backgroundColor: '#1e293b',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },

  suggestionText: {
    fontSize: 11,
    color: '#cbd5e1',
  },

  // Project setup styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  setupContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 24,
    gap: 16,
  },

  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },

  setupIcon: {
    alignSelf: 'center',
    marginBottom: 8,
  },

  setupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },

  setupDesc: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
  },

  setupInput: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#e2e8f0',
    fontSize: 14,
  },

  descriptionInput: {
    height: 80,
    textAlignVertical: 'top',
  },

  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#06b6d4',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 8,
  },

  startButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
