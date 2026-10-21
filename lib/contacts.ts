export type ContactLine = { label: string; value: string; href: string }

export type Office = {
  id: string
  name: string
  court: string
  address: string
  lines: ContactLine[]
  mapEmbed: string
  directions: string
}

export const LAWYER_CONTACTS: ContactLine[] = [
  { label: 'Mobile', value: '+39 340 1462661', href: 'tel:+393401462661' },
  { label: 'Email', value: 'direzione@miolegale.it', href: 'mailto:direzione@miolegale.it' },
  { label: 'Email', value: 'lanciano@miolegale.it', href: 'mailto:lanciano@miolegale.it' },
  { label: 'PEC', value: 'pec@miolegale.eu', href: 'mailto:pec@miolegale.eu' },
]

export const QUICK_ACTIONS = {
  phone: 'tel:+393401462661',
  whatsapp: 'https://wa.me/393401462661',
  telegram: 'https://t.me/+393401462661',
  email: 'mailto:direzione@miolegale.it',
}

export const OFFICES: Office[] = [
  {
    id: 'pescara',
    name: 'Studio legale Pescara',
    court: 'Foro di Pescara',
    address: 'Viale Gabriele D’Annunzio n. 267 – 65127 Pescara',
    lines: [
      { label: 'Telefono', value: '+39 340 1462661', href: 'tel:+393401462661' },
      { label: 'Fax', value: '+39 085 7992721', href: 'tel:+390857992721' },
      { label: 'Email', value: 'info@miolegale.it', href: 'mailto:info@miolegale.it' },
    ],
    mapEmbed:
      'https://www.google.com/maps?q=Viale+Gabriele+D%27Annunzio+267,+65127+Pescara&z=15&output=embed',
    directions: 'https://www.google.com/maps/dir/?api=1&destination=Viale+Gabriele+D%27Annunzio+267+65127+Pescara',
  },
  {
    id: 'raiano',
    name: 'Studio legale Raiano',
    court: 'Foro di Sulmona',
    address: 'Via Palombaia, 38 – 67027 Raiano (L’Aquila)',
    lines: [
      { label: 'Telefono', value: '+39 0864 576767', href: 'tel:+390864576767' },
      { label: 'Telefono', value: '+39 0864 728531', href: 'tel:+390864728531' },
      { label: 'Fax', value: '+39 085 7992721', href: 'tel:+390857992721' },
      { label: 'Email', value: 'info@miolegale.it', href: 'mailto:info@miolegale.it' },
    ],
    mapEmbed:
      'https://www.google.com/maps?q=Via+Palombaia+38,+67027+Raiano+(AQ)&z=15&output=embed',
    directions: 'https://www.google.com/maps/dir/?api=1&destination=Via+Palombaia+38+67027+Raiano',
  },
]

export const TRUSTINDEX_LOADER = 'https://cdn.trustindex.io/loader.js?525b5db388b8844a2c54355abe'
