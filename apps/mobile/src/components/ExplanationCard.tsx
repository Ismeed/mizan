import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RenderedExplanation } from '@mizan/shared';
import { RTLText } from './RTLText';
import { Colors } from '../constants/colors';

export interface ExplanationCardProps {
  explanation: RenderedExplanation;
  onViewEvidence?: (evidenceId: string) => void;
  onAskAI?: (explanation: RenderedExplanation) => void;
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({
  explanation,
  onViewEvidence,
  onAskAI,
}) => {
  const [expanded, setExpanded] = useState(false);

  const { content, language, madhhab, evidence } = explanation;

  return (
    <View style={styles.card}>
      {/* Header with Madhhab Badge */}
      <View style={styles.header}>
        <Text style={styles.title}>{content.title}</Text>
        {madhhab.madhhabId && (
          <View style={styles.madhhabBadge}>
            <Text style={styles.madhhabText}>{madhhab.madhhabId}</Text>
          </View>
        )}
      </View>

      {/* Fallback Notice */}
      {language.fallbackUsed && (
        <View style={styles.fallbackNotice}>
          <Text style={styles.fallbackText}>
            Notice: Displaying approved English translation ({language.fallbackReason})
          </Text>
        </View>
      )}

      {/* Short or Full Content */}
      <RTLText style={styles.explanationText}>
        {expanded ? content.full : content.short}
      </RTLText>

      {/* Actions Row */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => setExpanded(!expanded)}>
          <Text style={styles.actionText}>{expanded ? 'Show Less' : 'Read Full Explanation'}</Text>
        </TouchableOpacity>

        {evidence.length > 0 && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => onViewEvidence && onViewEvidence(evidence[0].evidenceId)}
          >
            <Text style={styles.actionText}>View Evidence</Text>
          </TouchableOpacity>
        )}

        {onAskAI && (
          <TouchableOpacity style={[styles.actionBtn, styles.aiBtn]} onPress={() => onAskAI(explanation)}>
            <Text style={styles.aiBtnText}>Ask MIZAN AI</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors?.gold?.main || '#D4AF37',
    flex: 1,
  },
  madhhabBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  madhhabText: {
    fontSize: 12,
    color: Colors?.gold?.main || '#D4AF37',
    fontWeight: '600',
  },
  fallbackNotice: {
    backgroundColor: 'rgba(234, 179, 8, 0.1)',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  fallbackText: {
    fontSize: 12,
    color: '#EAB308',
  },
  explanationText: {
    fontSize: 14,
    color: '#E2E8F0',
    lineHeight: 20,
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  actionBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  aiBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  aiBtnText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
});
