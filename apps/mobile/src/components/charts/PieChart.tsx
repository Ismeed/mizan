import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Path, G, Circle } from 'react-native-svg';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';

interface DataPoint {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: DataPoint[];
  size?: number;
}

export const PieChart: React.FC<PieChartProps> = ({ data, size = 200 }) => {
  const center = size / 2;
  const radius = size / 2;
  
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  let startAngle = 0;
  
  const createPath = (value: number, total: number, startAngle: number) => {
    const angle = (value / total) * 360;
    const endAngle = startAngle + angle;
    
    const x1 = center + radius * Math.cos((Math.PI * startAngle) / 180);
    const y1 = center + radius * Math.sin((Math.PI * startAngle) / 180);
    const x2 = center + radius * Math.cos((Math.PI * endAngle) / 180);
    const y2 = center + radius * Math.sin((Math.PI * endAngle) / 180);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    if (value === total) {
      return `M ${center}, ${center} m -${radius}, 0 a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 -${radius * 2},0`;
    }
    
    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${center}, ${center}`}>
          {data.map((item, index) => {
            if (item.value === 0) return null;
            const path = createPath(item.value, total, startAngle);
            const currentAngle = startAngle;
            startAngle += (item.value / total) * 360;
            
            return (
              <Path
                key={index}
                d={path}
                fill={item.color}
                stroke={colors.background}
                strokeWidth={2}
              />
            );
          })}
        </G>
        <Circle cx={center} cy={center} r={radius * 0.6} fill={colors.background} />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
