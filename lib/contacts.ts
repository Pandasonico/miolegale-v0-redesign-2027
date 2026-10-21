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
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d756534.2406749041!2d13.077880240197846!3d42.209916033024406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1331a63b025fc5ad%3A0x19656072fe8792f3!2sAvvocato%20Gianluca%20Lanciano%20-%20Patrocinante%20in%20Cassazione%20-%20Studio%20Legale%20a%20Pescara!5e0!3m2!1sit!2sit!4v1777310471410!5m2!1sit!2sit',
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
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d189127.53228080663!2d13.574114254533143!3d42.21192917663601!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x133038d43e422227%3A0x36fdada3858fd05b!2sAvv.%20Gianluca%20Lanciano!5e0!3m2!1sit!2sit!4v1777310390360!5m2!1sit!2sit',
    directions: 'https://www.google.com/maps/dir/?api=1&destination=Via+Palombaia+38+67027+Raiano',
  },
]

export const TRUSTINDEX_LOADER = 'https://cdn.trustindex.io/loader.js?525b5db388b8844a2c54355abe'
