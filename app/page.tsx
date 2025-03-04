"use client"

import Header from "@/components/Header"
import MonitorsBlock from "@/components/MonitorsBlock"
import EnterJourneyBlock from "@/components/EnterJourneyBlock"
import { useRef, useEffect } from "react"
import styled from "styled-components"

const Main = styled.main`
  width: 100%;
  min-height: 100vh;
  background-color: #0a0a0a;
  color: white;
  overflow-x: hidden;
`

export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <Main>
      <Header />
      <MonitorsBlock />
      <div ref={scrollRef}>
        <EnterJourneyBlock />
      </div>
    </Main>
  )
}

