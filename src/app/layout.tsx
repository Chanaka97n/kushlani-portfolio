import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kushlani Pathirana | Environmental Scientist & Researcher",
  description:
    "Portfolio of Kushlani Pathirana – Research Assistant specializing in environmental chemistry, water treatment, nanocomposite membranes for desalination, and river health assessment. Based in Sri Lanka.",
  keywords: [
    "Kushlani Pathirana",
    "Environmental Scientist",
    "Water Treatment Research",
    "Nanocomposite Membranes",
    "Desalination",
    "Environmental Chemistry",
    "University of Peradeniya",
    "NIFS Sri Lanka",
    "Graphene Oxide Membrane",
    "Water Quality Analysis",
  ],
  authors: [{ name: "Kushlani Pathirana" }],
  openGraph: {
    title: "Kushlani Pathirana | Environmental Scientist & Researcher",
    description:
      "Research Assistant focused on environmental chemistry, water treatment, and sustainable water management.",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
