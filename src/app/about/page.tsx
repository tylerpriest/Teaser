import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us - ADHD NSW',
  description:
    'Learn about ADHD NSW - your trusted guide to ADHD support services and professionals across New South Wales.',
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">About ADHD NSW</h1>
        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Our Mission</h2>
            <p className="mb-4">
              ADHD NSW is dedicated to connecting individuals and families with
              trusted ADHD professionals and resources across New South Wales.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">What We Do</h2>
            <p className="mb-4">
              We maintain a comprehensive directory of ADHD specialists,
              including psychiatrists, psychologists, and other healthcare
              professionals who specialize in ADHD diagnosis and treatment.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Our Commitment</h2>
            <p className="mb-4">
              We are committed to providing accurate, up-to-date information to
              help you make informed decisions about ADHD care in New South
              Wales.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
