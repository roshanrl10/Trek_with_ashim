const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  key:            { type: String, default: 'main', unique: true },
  seoTitle:       { type: String, default: 'Trek with Ashim — Your Himalayan Guide' },
  seoDescription: { type: String, default: 'Explore Nepal with Ashim, your trusted trekking guide.' },
  heroTitle:      { type: String, default: 'Trek the Roof of the World' },
  heroSubtitle:   { type: String, default: 'Join Ashim for unforgettable Himalayan journeys' },
  heroImageUrl:      String,
  heroImagePublicId: String,
  heroImagePosition: { type: String, default: 'center center' },
  statYears:    { type: String, default: '10+' },
  statTreks:    { type: String, default: '200+' },
  statTrekkers: { type: String, default: '500+' },
  statRoutes:   { type: String, default: '15+' },
  whyTitle:    { type: String, default: 'Trek with Confidence' },
  whySubtitle: { type: String, default: 'The principles behind every trek' },
  ctaTitle:         { type: String, default: 'Ready for Your Adventure?' },
  ctaSubtitle:      { type: String, default: 'Contact Ashim to plan your perfect Himalayan journey' },
  ctaImageUrl:      String,
  ctaImagePublicId: String,
  ctaImagePosition: { type: String, default: 'center center' },
  footerTagline: { type: String, default: 'Your trusted trekking guide in Nepal.' },
  footerPhone:   { type: String, default: '+977 98XXXXXXXX' },
  footerEmail:   { type: String, default: 'ashim@trekwithashim.com' },
  footerAddress: { type: String, default: 'Thamel, Kathmandu, Nepal' },
  instagramUrl:   String,
  facebookUrl:    String,
  youtubeUrl:     String,
  whatsappNumber: String,
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);