import React, { useState, useRef, useEffect } from 'react';
import {
  View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, Text, Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeScreen } from '../../src/components/layout/SafeScreen';
import { Header } from '../../src/components/layout/Header';
import { ChatBubble } from '../../src/components/ai/ChatBubble';
import { TypingIndicator } from '../../src/components/ai/TypingIndicator';
import { SourceCitation } from '../../src/components/ai/SourceCitation';
import { QuickPrompt } from '../../src/components/ai/QuickPrompt';
import { colors } from '../../src/constants/colors';
import { typography } from '../../src/constants/typography';
import { spacing, borderRadius } from '../../src/constants/spacing';
import { useAI } from '../../src/hooks/useAI';

const QUICK_PROMPTS = [
  "How do I use this app?",
  "What is the Nisab for gold?",
  "Who inherits if a man leaves a wife and 2 daughters?",
  "How do I change my Madhhab?",
  "Is zakat due on a rented house?",
  "Where can I find saved PDF reports?",
];

export default function AIAssistantScreen() {
  const { messages, isTyping, sendMessage } = useAI();
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', scrollToBottom);
    return () => {
      showSub.remove();
    };
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <SafeScreen edges={['top', 'left', 'right']} withBottomTabBar={true}>
      <Header title="AI Assistant" showBack={false} />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 20}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatContainer}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <View>
              <ChatBubble
                message={item.content}
                isUser={item.role === 'user'}
                timestamp={new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              />
              {item.sources && item.sources.map((source: any, index: number) => (
                <SourceCitation
                  key={index}
                  source={source.source}
                  reference={source.reference}
                />
              ))}
            </View>
          )}
          ListHeaderComponent={() => (
            <View style={styles.quickPromptsContainer}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={QUICK_PROMPTS}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <QuickPrompt text={item} onPress={handleQuickPrompt} />
                )}
                contentContainerStyle={styles.quickPromptsList}
              />
            </View>
          )}
          ListFooterComponent={() => (isTyping ? <TypingIndicator /> : null)}
        />

        <View style={styles.inputOuterContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Ask something..."
              placeholderTextColor={colors.textMuted}
              multiline
              maxLength={500}
              onFocus={scrollToBottom}
            />
            <TouchableOpacity
              style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!input.trim() || isTyping}
            >
              <Ionicons
                name="send"
                size={20}
                color={input.trim() ? colors.primaryDark : colors.textMuted}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.disclaimer}>
            Educational guidance. Consult a scholar for formal fatwas.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  quickPromptsContainer: {
    marginBottom: spacing.lg,
  },
  quickPromptsList: {
    paddingRight: spacing.md,
  },
  inputOuterContainer: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.md,
    paddingBottom: spacing.xs,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingTop: 12,
    paddingBottom: 12,
    minHeight: 48,
    maxHeight: 120,
    fontFamily: typography.body,
    fontSize: 16,
    color: colors.white,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
    marginBottom: 0,
  },
  sendButtonDisabled: {
    backgroundColor: colors.surfaceElevated,
  },
  disclaimer: {
    fontFamily: typography.body,
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: 6,
    backgroundColor: colors.surface,
  },
});
