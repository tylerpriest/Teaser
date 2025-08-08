import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - ADHD NSW',
  description: 'Privacy Policy for ADHD NSW directory and resources.',
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">Privacy Policy</h1>
        <div className="prose max-w-none">
          <p className="mb-6 text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              Information We Collect
            </h2>
            <p className="mb-4">
              We collect information you provide directly to us, such as when
              you contact us through our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              How We Use Your Information
            </h2>
            <p className="mb-4">
              We use the information we collect to provide, maintain, and
              improve our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
