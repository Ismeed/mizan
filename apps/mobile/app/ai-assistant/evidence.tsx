import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AIEvidenceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const evidenceId = (params.evidenceId as string) || 'QURAN-004-011-011';
  const evidenceType = (params.evidenceType as string) || 'QURAN';
  const canonicalRef = (params.canonicalReference as string) || 'Surah An-Nisa (4:11)';
  const madhhab = (params.madhhab as string) || 'HANAFI';
  const ruleId = (params.ruleId as string) || 'MIRATH-FIXED_SHARE-CHILDREN-001';

  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: `Assalamu Alaikum! This reference (${canonicalRef}) was used to support the rule [${ruleId}] in your calculation under the ${madhhab} madhhab. How can I assist you in understanding this evidence?`,
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    if (!question.trim()) return;
    const userMsg = question.trim();
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setQuestion('');
    setLoading(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Regarding your question on "${userMsg}": Under the ${madhhab} school, this evidence establishes fixed Quranic shares (Fard) deterministically. The AI assistant strictly explains approved evidence and does not alter calculation results or invent rulings.`,
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#062C22" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#D4AF37" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>AI Evidence Assistant</Text>

        </View>
        <View style={styles.madhhabBadge}>
          <Text style={styles.madhhabBadgeText}>{madhhab}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContainer}>
        {/* Evidence Card */}
        <View style={styles.evidenceCard}>
          <View style={styles.cardHeader}>
            <View style={styles.typeBadge}>
              <Ionicons
                name={evidenceType === 'QURAN' ? 'book-outline' : 'ribbon-outline'}
                size={16}
                color="#D4AF37"
              />
              <Text style={styles.typeBadgeText}>{evidenceType}</Text>
            </View>
            <Text style={styles.evidenceIdText}>{evidenceId}</Text>
          </View>

          <Text style={styles.canonicalRef}>{canonicalRef}</Text>

          {/* Arabic Text Display */}
          <View style={styles.arabicBox}>
            <Text style={styles.arabicText}>
              يُوصِيكُمُ اللَّهُ فِي أَوْلَادِكُمْ ۖ لِلذَّكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ
            </Text>
          </View>

          {/* Approved Translation */}
          <View style={styles.translationBox}>
            <Text style={styles.translationLabel}>Approved Translation (Sahih International):</Text>
            <Text style={styles.translationText}>
              "Allah instructs you concerning your children: for the male, what is equal to the share of two females..."
            </Text>
          </View>

          {/* Applied Rule Context */}
          <View style={styles.ruleContextBox}>
            <Text style={styles.ruleContextLabel}>Linked Calculation Decision:</Text>
            <Text style={styles.ruleContextValue}>Rule: {ruleId}</Text>
            <Text style={styles.ruleContextDesc}>
              Determines fixed shares for children according to classical Islamic jurisprudence.
            </Text>
          </View>
        </View>

        {/* Chat Stream */}
        <View style={styles.chatSection}>
          <Text style={styles.chatSectionTitle}>Scholar-Guided QA</Text>
          {messages.map((m, idx) => (
            <View
              key={idx}
              style={[
                styles.messageBubble,
                m.role === 'user' ? styles.userBubble : styles.assistantBubble,
              ]}
            >
              <Text style={styles.messageText}>{m.content}</Text>
            </View>
          ))}
          {loading && (
            <View style={[styles.messageBubble, styles.assistantBubble]}>
              <ActivityIndicator color="#D4AF37" size="small" />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.textInput}
          placeholder="Ask about this evidence..."
          placeholderTextColor="#8F9E99"
          value={question}
          onChangeText={setQuestion}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={20} color="#062C22" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#041E17',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
    backgroundColor: '#062C22',
  },
  backButton: {
    padding: 6,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F4F6F5',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#D4AF37',
  },
  madhhabBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderColor: '#D4AF37',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  madhhabBadgeText: {
    color: '#D4AF37',
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
  evidenceCard: {
    backgroundColor: '#0A3A2F',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  typeBadgeText: {
    color: '#D4AF37',
    fontSize: 11,
    fontWeight: '700',
  },
  evidenceIdText: {
    color: '#8F9E99',
    fontSize: 11,
    fontFamily: 'Platform',
  },
  canonicalRef: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F4F6F5',
    marginBottom: 12,
  },
  arabicBox: {
    backgroundColor: '#04221B',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    borderRightWidth: 3,
    borderRightColor: '#D4AF37',
  },
  arabicText: {
    fontSize: 22,
    color: '#F4F6F5',
    textAlign: 'right',
    lineHeight: 36,
  },
  translationBox: {
    marginBottom: 12,
  },
  translationLabel: {
    fontSize: 11,
    color: '#D4AF37',
    fontWeight: '600',
    marginBottom: 4,
  },
  translationText: {
    fontSize: 14,
    color: '#E0E6E4',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  ruleContextBox: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 6,
    padding: 10,
    marginTop: 4,
  },
  ruleContextLabel: {
    fontSize: 11,
    color: '#8F9E99',
    fontWeight: '600',
  },
  ruleContextValue: {
    fontSize: 13,
    color: '#D4AF37',
    fontWeight: '700',
    marginTop: 2,
  },
  ruleContextDesc: {
    fontSize: 12,
    color: '#B0C2BC',
    marginTop: 2,
  },
  chatSection: {
    marginTop: 8,
  },
  chatSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D4AF37',
    marginBottom: 12,
  },
  messageBubble: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    maxWidth: '85%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#D4AF37',
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#0E483B',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  messageText: {
    fontSize: 14,
    color: '#F4F6F5',
    lineHeight: 20,
  },
  inputBar: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#062C22',
    borderTopWidth: 1,
    borderTopColor: 'rgba(212, 175, 55, 0.2)',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#041E17',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#F4F6F5',
    fontSize: 14,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
