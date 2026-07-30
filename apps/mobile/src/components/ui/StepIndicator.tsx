import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  labels,
}) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        {steps.map((step, index) => {
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;
          
          return (
            <React.Fragment key={step}>
              <View
                style={[
                  styles.stepCircle,
                  isCompleted && styles.completedCircle,
                  isActive && styles.activeCircle,
                ]}
              >
                <Text
                  style={[
                    styles.stepText,
                    (isCompleted || isActive) && styles.activeText,
                  ]}
                >
                  {step}
                </Text>
              </View>
              
              {index < totalSteps - 1 && (
                <View
                  style={[
                    styles.line,
                    isCompleted && styles.completedLine,
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
      
      {labels && labels.length === totalSteps && (
        <View style={styles.labelsContainer}>
          {labels.map((label, index) => (
            <Text
              key={index}
              style={[
                styles.label,
                (index + 1 === currentStep) && styles.activeLabel,
              ]}
              numberOfLines={1}
            >
              {label}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeCircle: {
    borderColor: colors.secondary,
    borderWidth: 2,
    backgroundColor: colors.surface,
  },
  completedCircle: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  stepText: {
    fontFamily: typography.bodySemiBold,
    fontSize: 12,
    color: colors.textSecondary,
  },
  activeText: {
    color: colors.primaryDark,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: spacing.xs,
  },
  completedLine: {
    backgroundColor: colors.secondary,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  label: {
    flex: 1,
    textAlign: 'center',
    fontFamily: typography.body,
    fontSize: 10,
    color: colors.textMuted,
  },
  activeLabel: {
    color: colors.secondary,
    fontFamily: typography.bodySemiBold,
  },
});
