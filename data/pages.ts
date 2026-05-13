export const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Privacy', href: '/privacy' },
  { name: 'Disclaimer', href: '/disclaimer' }
];

export const heroContent = {
  title: 'OG Deliveries',
  subtitle:
    'Curated stories on delivery logistics, local commerce, and the partnerships that keep goods moving.',
  cta: 'Read today\'s highlights'
};

export const highlights = [
  {
    title: 'Scaling with headless CMS',
    body: 'Connect Contentful or Sanity to publish stories without touching the frontend.',
    tag: 'CMS Ready'
  },
  {
    title: 'Ad-first layout',
    body: 'Above-the-fold hero, in-article placements, and a sticky sidebar slot keep inventory visible.',
    tag: 'Monetization'
  },
  {
    title: 'Fast & secure delivery',
    body: 'Pre-rendered pages, CDN-friendly assets, and forced HTTPS give readers a secure experience.',
    tag: 'Performance'
  }
];

export const contactDetails = {
  email: 'press@ogdeliveries.com',
  phone: '+1 (555) 123-9876',
  address: '123 Logistics Way, Suite 404, Delivery City, DC 20001'
};

export const socialLinks = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com' },
  { label: 'X (Twitter)', href: 'https://x.com' },
  { label: 'YouTube', href: 'https://www.youtube.com' }
];

export const cmsNotes = {
  platform: 'Next.js + optional Contentful or Sanity integration',
  setup:
    'Provide CONTENTFUL_SPACE_ID and CONTENTFUL_DELIVERY_TOKEN or SANITY_STUDIO_PROJECT_ID to map entries to sections.',
  fallback:
    'Static fallback content keeps the site online even when the headless CMS is unavailable or unpublished.'
};

export const policyContent = {
  privacy: {
    headline: 'Privacy Policy',
    sections: [
      {
        title: 'Data we collect',
        body: 'Anonymous analytics, form submissions, and basic log data are used to improve the site experience.'
      },
      {
        title: 'Ad & affiliate disclosures',
        body: 'We use above-the-fold, in-article, and sidebar ad slots. Affiliate links are disclosed inline and in this policy.'
      },
      {
        title: 'Your controls',
        body: 'Readers can request data exports or removal by emailing privacy@ogdeliveries.com.'
      }
    ]
  },
  disclaimer: {
    headline: 'Affiliate & Editorial Disclaimer',
    sections: [
      {
        title: 'Affiliate relationships',
        body: 'Some product links may earn commissions. Recommendations remain editorially independent.'
      },
      {
        title: 'Advertiser placement',
        body: 'Ad slots are clearly labeled and kept distinct from editorial content.'
      },
      {
        title: 'No guarantees',
        body: 'Operational details and pricing can change. Please verify with partners before acting.'
      }
    ]
  }
};
