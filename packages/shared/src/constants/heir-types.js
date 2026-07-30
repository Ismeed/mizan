"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HEIR_TYPES = void 0;
const inheritance_types_1 = require("../types/inheritance.types");
exports.HEIR_TYPES = [
    { type: inheritance_types_1.HeirType.HUSBAND, label: 'Husband (Zauj)', labelAr: 'زوج' },
    { type: inheritance_types_1.HeirType.WIFE, label: 'Wife (Zaujah)', labelAr: 'زوجة' },
    { type: inheritance_types_1.HeirType.SON, label: 'Son (Ibn)', labelAr: 'ابن' },
    { type: inheritance_types_1.HeirType.DAUGHTER, label: 'Daughter (Bint)', labelAr: 'بنت' },
    { type: inheritance_types_1.HeirType.FATHER, label: 'Father (Ab)', labelAr: 'أب' },
    { type: inheritance_types_1.HeirType.MOTHER, label: 'Mother (Umm)', labelAr: 'أم' },
    { type: inheritance_types_1.HeirType.PATERNAL_GRANDFATHER, label: 'Grandfather (Jadd)', labelAr: 'جد' },
    { type: inheritance_types_1.HeirType.PATERNAL_GRANDMOTHER, label: 'Grandmother (Jaddah)', labelAr: 'جدة' },
    { type: inheritance_types_1.HeirType.FULL_BROTHER, label: 'Full Brother (Akh Shaqiq)', labelAr: 'أخ شقيق' },
    { type: inheritance_types_1.HeirType.FULL_SISTER, label: 'Full Sister (Ukht Shaqiqah)', labelAr: 'أخت شقيقة' }
];
