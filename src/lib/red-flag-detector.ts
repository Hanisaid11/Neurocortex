export interface RedFlag {
  keywords: string[];
  title: string;
  protocol: string[];
}

export const RED_FLAGS: RedFlag[] = [
  {
    keywords: ['thunderclap', 'worst headache', 'sudden severe headache'],
    title: 'Suspected Subarachnoid Hemorrhage (SAH)',
    protocol: [
      'Stat CT Head Non-Contrast',
      'Maintain systolic BP < 140 mmHg (Nimodipine/Labetalol)',
      'Stat Neurosurgery Consult',
      'Assess for hydrocephalus/ventriculostomy needs'
    ]
  },
  {
    keywords: ['blown pupil', 'anisocoria', 'fixed and dilated'],
    title: 'Brain Herniation Syndrome',
    protocol: [
      'Stat Osmotherapy (Mannitol 20% 1g/kg or 3% Saline)',
      'Head of bed elevated to 30 degrees',
      'Brief hyperventilation (PaCO2 30-35 mmHg)',
      'Stat imaging and immediate surgical decompression'
    ]
  },
  {
    keywords: ['sudden weakness', 'hemiparesis', 'speech arrest', 'focal deficit'],
    title: 'Acute Ischemic Stroke / ICH',
    protocol: [
      'Activate Stroke Protocol',
      'Stat CTA/CTP for large vessel occlusion assessment',
      'Assess for IV tPA vs Thrombectomy candidacy',
      'Serial NIHSS neuro-checks'
    ]
  }
];

export function detectRedFlags(text: string): RedFlag | null {
  const lowercaseText = text.toLowerCase();
  for (const flag of RED_FLAGS) {
    if (flag.keywords.some(k => lowercaseText.includes(k))) {
      return flag;
    }
  }
  return null;
}
