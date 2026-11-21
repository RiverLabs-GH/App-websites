<script setup lang="ts">
import { markdownReader, okfReader } from './data/content'
import Navbar from './components/Navbar.vue'
import HeroSection from './components/HeroSection.vue'
import ProblemSection from './components/ProblemSection.vue'
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
    <ExperienceSection :data="markdownReader" tone="alt" />
    <ExperienceSection :data="okfReader" tone="plain" flip />
    <ProductShowcase />
    <FeatureSection />
    <DifferentiationSection />
    <PrivacySection />
    <FinalCTA />
  </main>
  <Footer />
</template>
