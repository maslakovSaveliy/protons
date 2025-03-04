import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import StyledComponentsRegistry from "@/lib/registry"
import GlobalStyles from "@/components/GlobalStyles"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Protons NFT",
  description: "Enter the journey into the Protons NFT universe",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <GlobalStyles />
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}

