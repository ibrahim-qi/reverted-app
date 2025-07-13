import { LearningModule, Dua } from '../types';

export const LEARNING_MODULES: LearningModule[] = [
  {
    id: 'basics-1',
    title: 'The Five Pillars of Islam',
    description: 'Learn about the fundamental practices that form the foundation of Muslim life',
    category: 'basics',
    completed: false,
    progress: 0,
    lessons: [
      {
        id: 'shahada',
        title: 'Shahada - Declaration of Faith',
        content: `The Shahada is the declaration of faith and the first pillar of Islam. It states:

**Arabic:** أشهد أن لا إله إلا الله وأشهد أن محمدا رسول الله

**Transliteration:** Ash-hadu an la ilaha illa-llah wa ash-hadu anna Muhammadan rasulu-llah

**Translation:** I bear witness that there is no deity but Allah, and I bear witness that Muhammad is the messenger of Allah.

This declaration affirms:
• Monotheism (Tawhid) - belief in One God
• Muhammad ﷺ as the final messenger

By sincerely declaring the Shahada, one enters Islam.`,
        type: 'text',
        duration: 5,
        completed: false,
      },
      {
        id: 'salah',
        title: 'Salah - Prayer',
        content: `Salah is the second pillar of Islam. Muslims pray five times daily:

**Prayer Times:**
1. **Fajr** - Dawn prayer (2 rakats)
2. **Dhuhr** - Midday prayer (4 rakats)
3. **Asr** - Afternoon prayer (4 rakats)
4. **Maghrib** - Sunset prayer (3 rakats)
5. **Isha** - Night prayer (4 rakats)

Prayer connects us directly with Allah and brings peace, discipline, and remembrance of Allah throughout the day.`,
        type: 'text',
        duration: 10,
        completed: false,
      },
      {
        id: 'zakat',
        title: 'Zakat - Charity',
        content: `Zakat is the third pillar of Islam - obligatory charity.

**Key Points:**
• 2.5% of savings annually (above nisab threshold)
• Purifies wealth and soul
• Helps those in need
• Strengthens community bonds

**Who receives Zakat:**
The poor, the needy, those in debt, travelers in need, and others mentioned in the Quran.

Zakat teaches generosity and social responsibility.`,
        type: 'text',
        duration: 5,
        completed: false,
      },
      {
        id: 'sawm',
        title: 'Sawm - Fasting',
        content: `Sawm (fasting) during Ramadan is the fourth pillar.

**What is fasting:**
• Abstaining from food, drink, and marital relations
• From dawn (Fajr) to sunset (Maghrib)
• During the month of Ramadan

**Benefits:**
• Develops self-control and patience
• Increases empathy for the hungry
• Spiritual purification
• Community solidarity

Those who are ill, traveling, pregnant, or unable may be exempt.`,
        type: 'text',
        duration: 5,
        completed: false,
      },
      {
        id: 'hajj',
        title: 'Hajj - Pilgrimage',
        content: `Hajj is the fifth pillar - pilgrimage to Mecca.

**Requirements:**
• Once in lifetime for those who are able
• Physically and financially capable
• Performed during Dhul Hijjah month

**Key Rituals:**
• Ihram (sacred state)
• Tawaf (circling the Kaaba)
• Sa'i (walking between Safa and Marwa)
• Standing at Arafat

Hajj symbolizes unity, equality, and submission to Allah.`,
        type: 'text',
        duration: 5,
        completed: false,
      },
    ],
  },
  {
    id: 'prayer-1',
    title: 'How to Perform Wudu',
    description: 'Step-by-step guide to ritual purification before prayer',
    category: 'prayer',
    completed: false,
    progress: 0,
    lessons: [
      {
        id: 'wudu-intro',
        title: 'Introduction to Wudu',
        content: `Wudu (ablution) is ritual purification required before prayer.

**When Wudu is required:**
• Before each prayer
• Before touching the Quran
• After using the bathroom
• After deep sleep

**What breaks Wudu:**
• Using the bathroom
• Passing gas
• Deep sleep
• Bleeding

Let's learn the steps...`,
        type: 'text',
        duration: 5,
        completed: false,
      },
      {
        id: 'wudu-steps',
        title: 'Steps of Wudu',
        content: `**Perform Wudu in this order:**

1. **Intention (Niyyah)** - Make intention in your heart

2. **Say Bismillah** - "In the name of Allah"

3. **Wash hands** - 3 times to the wrists

4. **Rinse mouth** - 3 times

5. **Clean nose** - 3 times (sniff water and blow out)

6. **Wash face** - 3 times from hairline to chin

7. **Wash arms** - 3 times to the elbows (right then left)

8. **Wipe head** - Once from front to back

9. **Wipe ears** - Once inside and out

10. **Wash feet** - 3 times to ankles (right then left)

End with the dua: "Ash-hadu an la ilaha illa-llah wahdahu la sharika lah, wa ash-hadu anna Muhammadan abduhu wa rasuluh"`,
        type: 'text',
        duration: 10,
        completed: false,
      },
    ],
  },
  {
    id: 'prayer-2',
    title: 'How to Pray',
    description: 'Complete guide to performing the five daily prayers',
    category: 'prayer',
    completed: false,
    progress: 0,
    lessons: [
      {
        id: 'prayer-positions',
        title: 'Prayer Positions',
        content: `**The main positions in prayer:**

1. **Qiyam (Standing)**
   - Stand straight facing Qibla
   - Hands folded on chest

2. **Ruku (Bowing)**
   - Bow with back straight
   - Hands on knees

3. **Sujud (Prostration)**
   - Forehead, nose, palms, knees, toes touch ground
   - Most humble position

4. **Jalsa (Sitting)**
   - Sit between prostrations
   - Sit for Tashahhud

Each position has specific supplications.`,
        type: 'text',
        duration: 10,
        completed: false,
      },
      {
        id: 'prayer-recitations',
        title: 'What to Recite',
        content: `**Essential recitations in prayer:**

**Al-Fatihah (The Opening):**
بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
الرَّحْمَٰنِ الرَّحِيمِ
مَالِكِ يَوْمِ الدِّينِ
إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ
اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ
صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ

**In Ruku:** "Subhana Rabbi-al-Azeem" (3x)
**In Sujud:** "Subhana Rabbi-al-A'la" (3x)
**Tashahhud:** Recited in sitting position`,
        type: 'text',
        duration: 15,
        completed: false,
      },
    ],
  },
  {
    id: 'quran-1',
    title: 'Introduction to the Quran',
    description: 'Understanding the holy book of Islam',
    category: 'quran',
    completed: false,
    progress: 0,
    lessons: [
      {
        id: 'quran-basics',
        title: 'What is the Quran?',
        content: `The Quran is the holy book of Islam, revealed to Prophet Muhammad ﷺ over 23 years.

**Key Facts:**
• Direct word of Allah
• 114 chapters (Surahs)
• 6,236 verses (Ayahs)
• Revealed in Arabic
• Preserved unchanged

**Etiquette:**
• Be in state of Wudu
• Handle with respect
• Read with contemplation
• Seek to understand and implement

The Quran guides all aspects of life.`,
        type: 'text',
        duration: 10,
        completed: false,
      },
    ],
  },
];

export const ESSENTIAL_DUAS: Dua[] = [
  {
    id: 'dua-wakeup',
    title: 'Upon Waking Up',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: 'Alhamdu lillahil-ladhi ahyana ba\'da ma amatana wa ilayhin-nushur',
    translation: 'All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.',
    category: 'daily',
    occasion: 'When waking up',
  },
  {
    id: 'dua-sleep',
    title: 'Before Sleeping',
    arabic: 'اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا',
    transliteration: 'Allahumma bismika amutu wa ahya',
    translation: 'O Allah, with Your name I die and I live.',
    category: 'daily',
    occasion: 'Before going to sleep',
  },
  {
    id: 'dua-eating',
    title: 'Before Eating',
    arabic: 'بِسْمِ اللَّهِ',
    transliteration: 'Bismillah',
    translation: 'In the name of Allah.',
    category: 'daily',
    occasion: 'Before starting to eat',
  },
  {
    id: 'dua-after-eating',
    title: 'After Eating',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
    transliteration: 'Alhamdu lillahil-ladhi at\'amana wa saqana wa ja\'alana muslimin',
    translation: 'All praise is for Allah who gave us food and drink and made us Muslims.',
    category: 'daily',
    occasion: 'After finishing food',
  },
  {
    id: 'dua-leaving-home',
    title: 'Leaving Home',
    arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'Bismillahi tawakkaltu \'alallahi wa la hawla wa la quwwata illa billah',
    translation: 'In the name of Allah, I place my trust in Allah, and there is no power nor strength except with Allah.',
    category: 'daily',
    occasion: 'When leaving home',
  },
  {
    id: 'dua-entering-home',
    title: 'Entering Home',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلِجِ وَخَيْرَ الْمَخْرَجِ بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا',
    transliteration: 'Allahumma inni as\'aluka khayral-mawliji wa khayral-makhraji. Bismillahi walajna wa bismillahi kharajna wa \'ala Allahi rabbina tawakkalna',
    translation: 'O Allah, I ask You for the best of entrances and the best of exits. With Allah\'s name we enter and with Allah\'s name we exit, and upon our Lord we place our trust.',
    category: 'daily',
    occasion: 'When entering home',
  },
  {
    id: 'dua-bathroom-enter',
    title: 'Entering Bathroom',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
    transliteration: 'Allahumma inni a\'udhu bika minal-khubthi wal-khaba\'ith',
    translation: 'O Allah, I seek refuge with You from evil and evil creatures.',
    category: 'daily',
    occasion: 'Before entering bathroom',
  },
  {
    id: 'dua-bathroom-exit',
    title: 'Leaving Bathroom',
    arabic: 'غُفْرَانَكَ',
    transliteration: 'Ghufranak',
    translation: 'I seek Your forgiveness.',
    category: 'daily',
    occasion: 'After leaving bathroom',
  },
];

export const DAILY_VERSES = [
  {
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: 'Indeed, with hardship comes ease.',
    reference: 'Quran 94:6',
  },
  {
    arabic: 'وَتَوَكَّلْ عَلَى اللَّهِ ۚ وَكَفَىٰ بِاللَّهِ وَكِيلًا',
    translation: 'And rely upon Allah; and sufficient is Allah as Disposer of affairs.',
    reference: 'Quran 33:3',
  },
  {
    arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ',
    translation: 'So remember Me; I will remember you.',
    reference: 'Quran 2:152',
  },
];