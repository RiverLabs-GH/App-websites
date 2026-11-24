<script setup lang="ts">
import { assistant, markdownReader, okfReader } from './data/content'
import Navbar from './components/Navbar.vue'
import HeroSection from './components/HeroSection.vue'
import ProblemSection from './components/ProblemSection.vue'
import AudienceSection from './components/AudienceSection.vue'
import ExperienceSection from './components/ExperienceSection.vue'
import ProductShowcase from './components/ProductShowcase.vue'
import FeatureSection from './components/FeatureSection.vue'
import DifferentiationSection from './components/DifferentiationSection.vue'
import PrivacySection from './components/PrivacySection.vue'
import FinalCTA from './components/FinalCTA.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <a class="skip-link" href="#main">Skip to content</a>
  <Navbar />
  <main id="main">
    <HeroSection />
    <ProblemSection />
    <AudienceSection />
    <ExperienceSection :data="markdownReader" tone="plain" />
    <ExperienceSection :data="okfReader" tone="alt" flip />
    <ExperienceSection :data="assistant" tone="plain" />
    <ProductShowcase />
    <FeatureSection />
    <DifferentiationSection />
    <PrivacySection />
    <FinalCTA />
  </main>
  <Footer />
</template>
