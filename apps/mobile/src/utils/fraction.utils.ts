export const formatFraction = (numerator: number, denominator: number): string => {
  const fractions: Record<string, string> = {
    '1/2': '½',
    '1/4': '¼',
    '1/8': '⅛',
    '2/3': '⅔',
    '1/3': '⅓',
    '1/6': '⅙',
  };

  const key = `${numerator}/${denominator}`;
  
  if (fractions[key]) {
    return fractions[key];
  }
  
  return key;
};
