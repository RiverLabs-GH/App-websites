<script setup lang="ts">
import Navbar from './components/sections/Navbar.vue'
import Hero from './components/sections/Hero.vue'
import Problem from './components/sections/Problem.vue'
import Experiences from './components/sections/Experiences.vue'
import Tour from './components/sections/Tour.vue'
import Trust from './components/sections/Trust.vue'
import Features from './components/sections/Features.vue'
import Why from './components/sections/Why.vue'
import FinalCta from './components/sections/FinalCta.vue'
import Footer from './components/sections/Footer.vue'
import ReadingProgress from './components/ui/ReadingProgress.vue'
</script>

<template>
  <a class="skip" href="#main">Skip to content</a>
  <ReadingProgress />
  <Navbar />
  <main id="main">
    <Hero />
    <Problem />
    <Experiences />
    <Tour />
    <Trust />
    <Features />
    <Why />
    <FinalCta />
  </main>
  <Footer />
</template>
