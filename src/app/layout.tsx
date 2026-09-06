import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK"],
});

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ibm-sans",
  weight: ["400", "500"],
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ibm-mono",
  weight: ["400", "500"],
});

export const viewport: Viewport = {
  themeColor: "#100e0b",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.currentRole.title} at ${site.currentRole.company}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.domain,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.domain,
    title: site.name,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  jobTitle: site.currentRole.title,
  worksFor: {
    "@type": "Organization",
    name: site.currentRole.company,
    url: site.currentRole.companyUrl,
  },
  sameAs: [site.links.github.href, site.links.linkedin.href],
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "University of California, Berkeley",
    },
    {
      "@type": "CollegeOrUniversity",
      name: "Orange Coast College",
    },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: site.location,
    addressCountry: "US",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
