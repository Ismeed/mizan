export interface HeirReference {
  quran: string;
  hadith?: string;
  explanation: string;
  madhhabNote?: string;
}

export const HEIR_REFERENCES: Record<string, HeirReference> = {
  husband: {
    quran: 'Surah An-Nisā (4:12)',
    hadith: 'Sahih al-Bukhari 6734',
    explanation: 'The husband inherits 1/2 of the deceased wife\'s estate if she left no children, or 1/4 if she had children. This share is a fixed Quranic portion (Fard).',
  },
  wives: {
    quran: 'Surah An-Nisā (4:12)',
    explanation: 'The wife (or wives collectively) inherits 1/4 if there are no children, or 1/8 if children exist. If there are multiple wives, they share this fraction equally.',
  },
  sons: {
    quran: 'Surah An-Nisā (4:11)',
    explanation: 'Sons are the primary residuary heirs (Asabah). They inherit the remainder of the estate after fixed shares are distributed. A son receives double the share of a daughter.',
  },
  daughters: {
    quran: 'Surah An-Nisā (4:11)',
    explanation: 'One daughter receives 1/2 of the estate if there is no son. Two or more daughters together receive 2/3. When a son is present, daughters inherit alongside him as Asabah, each receiving half his share.',
  },
  father: {
    quran: 'Surah An-Nisā (4:11)',
    explanation: 'The father receives 1/6 as a fixed share when the deceased has a son. When only daughters exist, he receives 1/6 plus the residue. When there are no children, he is the residuary heir.',
  },
  mother: {
    quran: 'Surah An-Nisā (4:11)',
    explanation: 'The mother receives 1/3 if there are no children and fewer than two siblings. She receives 1/6 if children are present or if there are two or more siblings. The Al-Umariyyatan ruling applies in certain configurations.',
  },
  paternalGrandfathers: {
    quran: 'Surah An-Nisā (4:11)',
    hadith: 'Sunan Abu Dawud 2895',
    explanation: 'The paternal grandfather inherits when the father is absent, taking the father\'s position as both a Fard and Asabah heir. He is blocked by the presence of the father.',
  },
  paternalGrandmothers: {
    quran: 'Surah An-Nisā (4:11)',
    hadith: 'Sahih al-Bukhari 6734',
    explanation: 'The paternal grandmother receives 1/6, shared with the maternal grandmother if both are present. She is blocked by the mother or father.',
  },
  maternalGrandmothers: {
    quran: 'Surah An-Nisā (4:11)',
    hadith: 'Sunan Abu Dawud 2894',
    explanation: 'The maternal grandmother receives 1/6, shared with the paternal grandmother if both are present. She is blocked by the mother.',
  },
  fullBrothers: {
    quran: 'Surah An-Nisā (4:176)',
    explanation: 'Full brothers (sharing both father and mother with the deceased) are residuary heirs. They are blocked by sons, daughters, father, or paternal grandfather.',
  },
  fullSisters: {
    quran: 'Surah An-Nisā (4:176)',
    explanation: 'A full sister receives 1/2 alone, or 2/3 shared with other full sisters (no brothers). With a full brother, she becomes Asabah receiving half his share. She is blocked by sons, daughters, father, or grandfather.',
  },
  paternalHalfBrothers: {
    quran: 'Surah An-Nisā (4:176)',
    explanation: 'Paternal half-brothers (sharing only the father) are residuary heirs. They are blocked by full siblings, sons, daughters, father, and paternal grandfather.',
  },
  paternalHalfSisters: {
    quran: 'Surah An-Nisā (4:176)',
    explanation: 'A paternal half-sister receives up to 1/6 as a complement when a full sister has taken 1/2. She is blocked by sons, father, grandfather, or full siblings.',
  },
  maternalHalfSiblings: {
    quran: 'Surah An-Nisā (4:12)',
    explanation: 'Maternal half-siblings (uterine siblings, sharing only the mother) receive 1/6 per person or 1/3 shared among two or more. They are blocked by children, father, or grandfather.',
    madhhabNote: 'In Shafi\'i and Hanbali, the grandfather does not block maternal half-siblings.',
  },
  sonsOfFullBrothers: {
    quran: 'Surah An-Nisā (4:176)',
    hadith: 'Sahih al-Bukhari 6746',
    explanation: 'Sons of full brothers are residuary heirs in the absence of full brothers and paternal half-brothers. They follow the same Asabah rules in order of priority.',
  },
  sonsOfPatHalfBrothers: {
    quran: 'Surah An-Nisā (4:176)',
    explanation: 'Sons of paternal half-brothers inherit as residuary heirs (Asabah) when higher-priority Asabah heirs are absent.',
  },
  paternalUncles: {
    quran: 'Surah An-Nisā (4:176)',
    hadith: 'Sunan Abu Dawud 2905',
    explanation: 'Paternal uncles (brothers of the father) are residuary heirs when all preceding Asabah are absent. They follow the standard Asabah priority rules.',
  },
  sonsOfPatUncles: {
    quran: 'Surah An-Nisā (4:176)',
    explanation: 'Sons of paternal uncles inherit as the most distant recognised Asabah group. They receive the estate residue when no other Asabah heir is present.',
  },
};
