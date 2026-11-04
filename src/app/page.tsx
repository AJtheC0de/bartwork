import { Intro } from "@/components/home/Intro";
import { Hero } from "@/components/home/Hero";
import { MeetArtist } from "@/components/home/MeetArtist";
import { Exhibition } from "@/components/home/Exhibition";
import { Details } from "@/components/home/Details";
import { Faith } from "@/components/home/Faith";
import { Story } from "@/components/home/Story";
import { SelectedWorks } from "@/components/home/SelectedWorks";
import { Support } from "@/components/home/Support";
import { FinalScene } from "@/components/home/FinalScene";

export default function Home() {
  return (
    <>
      <Intro />
      <Hero />
      <MeetArtist />
      <Exhibition />
      <Details />
      <Faith />
      <Story />
      <SelectedWorks />
      <Support />
      <FinalScene />
    </>
  );
}
