import { HeirType } from '../types/inheritance.types';

export const HEIR_TYPES = [
  { type: HeirType.HUSBAND, label: 'Husband (Zauj)', labelAr: 'زوج' },
  { type: HeirType.WIFE, label: 'Wife (Zaujah)', labelAr: 'زوجة' },
  { type: HeirType.SON, label: 'Son (Ibn)', labelAr: 'ابن' },
  { type: HeirType.DAUGHTER, label: 'Daughter (Bint)', labelAr: 'بنت' },
  { type: HeirType.FATHER, label: 'Father (Ab)', labelAr: 'أب' },
  { type: HeirType.MOTHER, label: 'Mother (Umm)', labelAr: 'أم' },
  { type: HeirType.PATERNAL_GRANDFATHER, label: 'Grandfather (Jadd)', labelAr: 'جد' },
  { type: HeirType.PATERNAL_GRANDMOTHER, label: 'Grandmother (Jaddah)', labelAr: 'جدة' },
  { type: HeirType.FULL_BROTHER, label: 'Full Brother (Akh Shaqiq)', labelAr: 'أخ شقيق' },
  { type: HeirType.FULL_SISTER, label: 'Full Sister (Ukht Shaqiqah)', labelAr: 'أخت شقيقة' }
];
