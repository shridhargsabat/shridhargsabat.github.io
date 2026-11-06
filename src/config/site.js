// SINGLE SOURCE OF TRUTH for owner identity, contact, appearance, section toggles.
// UI code must import from here. Never hard-code these values in index.html/app.js.
export const SITE = {
  referenceWebsite: 'https://touquirakhtar.com/',
  websiteUrl: 'https://shridhargsabat.github.io/',
  identity: {
    fullName: 'Shridhar Sabat',            // VERIFIED from current <title>
    displayName: 'SHRIDHAR SABAT',
    profession: 'Head - Vibe Coding & Infra (AVP)', // VERIFIED
    roleLine2: 'Secure Infrastructure & AI Innovation', // VERIFIED from hero
    location: '',                          // TODO-VERIFY: add only if owner confirms public city
    availability: '',                       // TODO-VERIFY with owner; empty = hidden
    headline: 'Orchestrating Secure Infrastructure & AI Innovation', // VERIFIED
    intro: 'AVP with designation Head - Vibe Coding & Infra, specializing in 16+ years of leadership bridging hybrid cloud, GRC, and agentic workflows.', // VERIFIED
    about: 'I serve as an Assistant Vice President (AVP) with the designation of Head - Vibe Coding & Infra, driving organizational IT infrastructure and information security engineering strategies to support continuous scaling. With over 16 years of leadership experience, I specialize in bridging the gap between hybrid cloud datacenters, corporate risk management, and cutting-edge agentic workflows utilizing scoped AI layers.', // VERIFIED from current #about
    portrait: './profile.jpg',             // VERIFIED asset in public/
    resume: '',                            // empty = hide "Download Resume"
    favicon: './favicon.png',              // VERIFIED asset in public/
  },
  contact: {
    email: 'shridhargsabat@gmail.com',     // VERIFIED from current contact mailto + display
    phone: '',                             // TODO-VERIFY: current site masks tel: href (+919****1683) — hidden until owner approves
    whatsapp: '',                          // international digits only, or hide
    instagram: '',
    youtube: '',
    linkedin: 'https://www.linkedin.com/in/shidhar-sabat-13408a132/', // VERIFIED
    github: 'https://github.com/shridhargsabat',                        // VERIFIED
    behance: '',
    dribbble: '',
    otherLinks: [],
  },
  appearance: {
    style: 'cinematic minimal, premium, editorial, refined typography',
    theme: 'dark',
    background: '#090909',
    text: '#f2efeb',
    accent: '#e32b3c',
    muted: '#a09c9a',
    displayFont: 'Anton',
    bodyFont: 'Manrope',
    accentFont: 'Caveat',
    animationIntensity: 'balanced',
    language: 'English',
  },
  preferences: {
    showAwards: false,
    showEducation: false,    // no verified education entries on current site
    showExperience: true,
    showBeforeAfter: false,  // true only with 2 real paired images
    showClientLogos: false,
    showTestimonials: false,
    showContactForm: true,   // mailto: fallback (no backend on static Pages)
    showDownloadResume: false,
    showProjectArchive: true,
  },
  motionStorageKey: 'shridhar-portfolio-motion', // site-specific persistence key
};

export const EASE = [0.22, 1, 0.36, 1]; // shared motion ease (spec §5)
