import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Use - ADHD NSW',
  description: 'Terms of Use for ADHD NSW directory and resources.',
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">Terms of Use</h1>
        <div className="prose max-w-none">
          <p className="mb-6 text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using this website, you accept and agree to be
              bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Use License</h2>
            <p className="mb-4">
              Permission is granted to temporarily use ADHD NSW for personal,
              non-commercial transitory viewing only.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Contact Information</h2>
            <p>
              Questions about the Terms of Use should be sent to us via our
              contact page.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
