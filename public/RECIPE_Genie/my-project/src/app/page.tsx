import React from "react"
import Head from "next/head"
import HeroSection from "../../components/HeroSection"
import { AboutSection } from "../../components/AboutSection"
import { RecipeSection } from "../../components/RecipeSection"

export default function Home() {
  return (
    <>
      <Head>
        <title>Recipe_Genie</title>
      </Head>
      <main className="mx-auto max-w-3xl px-4 sm:px-6 md:max-w-5xl ">
        <HeroSection />
        <AboutSection />
        <RecipeSection />
        <p><time dateTime="2025-01-16" suppressHydrationWarning></time></p>
      </main>
    </>
  );
}