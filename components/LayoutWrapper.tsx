import { Inter } from 'next/font/google'
import SectionContainer from '../components/SectionContainer'
import Footer from '../components/Footer'
import { ReactNode } from 'react'
import Header from '../components/Header'
import Logo from './Logo'
import Link from 'next/link'
import siteMetadata from '../data/siteMetadata'
import headerNavLinks from '../data/headerNavLinks'
import ThemeSwitch from '../components/ThemeSwitch'
import MobileNav from '../components/MobileNav'

interface Props {
  children: ReactNode
}

const inter = Inter({
  subsets: ['latin'],
})

const LayoutWrapper = ({ children }: Props) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between py-10">
        <div>
          <Link href="/" aria-label={siteMetadata.headerTitle}>
            <div className="flex items-center justify-between">
              <div className="mr-3">
                <Logo />
              </div>
              {typeof siteMetadata.headerTitle === 'string' ? (
                <div className="hidden h-6 text-2xl font-semibold sm:block">
                  {siteMetadata.headerTitle}
                </div>
              ) : (
                siteMetadata.headerTitle
              )}
            </div>
          </Link>
        </div>
        <div className="flex items-center text-base leading-5">
          <div className="hidden sm:block">
            {headerNavLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="p-1 font-medium text-gray-900 sm:p-4 dark:text-gray-100"
              >
                {link.title}
              </Link>
            ))}
          </div>
          <ThemeSwitch />
          <MobileNav />
        </div>
      </header>
      <main className="mb-auto">{children}</main>
      <Footer />
    </div>
  )
}

export default LayoutWrapper
