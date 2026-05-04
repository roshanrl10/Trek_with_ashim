const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  key:      { type: String, default: 'main', unique: true },
  heroTitle:    { type: String, default: 'Meet Ashim' },
  heroSubtitle: { type: String, default: 'Your trusted guide to Nepal\'s most breathtaking landscapes' },
  profileImageUrl:      String,
  profileImagePublicId: String,
  name:    { type: String, default: 'Ashim' },
  tagline: { type: String, default: 'A Life Lived in the Mountains' },
  bioParagraphs: {
    type: [String],
    default: [
      'I was born in a small village near the Langtang Valley, where the Himalayas were not a destination — they were home.',
      'After completing my guiding certification, I spent years learning every trail, teahouse, and weather pattern in Nepal.',
      'For me, trekking is not just about reaching a destination. It\'s about conversations, unexpected sunrises, and friendships formed on difficult passes.',
    ]
  },
  certifications: {
    type: [String],
    default: [
      'Nepal Mountaineering Association (NMA) Licensed Guide',
      'Wilderness First Responder (WFR) Certified',
      'High Altitude Trekking Certificate',
      'Tourism Board of Nepal Licensed',
      'English Speaking Trekking Guide',
    ]
  },
  timeline: {
    type: [{ year: String, event: String }],
    default: [
      { year: '2014', event: 'Started guiding in the Everest region' },
      { year: '2016', event: 'Completed first Manaslu Circuit guide' },
      { year: '2018', event: 'Obtained WFR certification' },
      { year: '2020', event: 'Guided 500th trekker on Annapurna Circuit' },
      { year: '2022', event: 'Launched Trek with Ashim platform' },
      { year: '2024', event: 'Over 200 successful treks completed' },
    ]
  },
  values: {
    type: [{ icon: String, title: String, desc: String }],
    default: [
      { icon: 'Shield', title: 'Safety First',    desc: 'Every decision on the trail prioritizes your safety.' },
      { icon: 'Heart',  title: 'Genuine Passion', desc: 'Born in the Himalayas — the mountains are a way of life.' },
      { icon: 'Users',  title: 'Personal Touch',  desc: 'Small groups mean personal attention for every trekker.' },
      { icon: 'Award',  title: 'Local Expertise', desc: 'Deep roots in mountain communities for authentic experiences.' },
    ]
  },
  yearsExp:   { type: String, default: '10+' },
  totalTreks: { type: String, default: '200+' },
  countries:  { type: String, default: '40+' },
  ctaTitle:    { type: String, default: 'Ready to Trek Together?' },
  ctaSubtitle: { type: String, default: 'Whether it\'s your first trek or your fiftieth, I\'ll make it unforgettable.' },
}, { timestamps: true });

module.exports = mongoose.model('About', aboutSchema);