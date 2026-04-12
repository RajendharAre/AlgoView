/**
 * SchemaMarkup Component
 * Adds JSON-LD structured data for better SEO and rich results
 * Renders schema.org markup for search engines
 */

export const SchemaMarkup = () => {
  // Organization schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AlgoView',
    url: 'https://algovieww.me',
    logo: 'https://algovieww.me/logo.png',
    description: 'Interactive Algorithm Visualizer and DSA Learning Platform',
    sameAs: ['https://twitter.com/algoview', 'https://github.com/algoview'],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'support@algovieww.me',
    },
  }

  // Web Application schema
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'AlgoView',
    url: 'https://algovieww.me',
    applicationCategory: 'EducationalApplication',
    description:
      'Learn data structures and algorithms visually with interactive step-by-step animations',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
      bestRating: '5',
      worstRating: '1',
    },
    creator: {
      '@type': 'Organization',
      name: 'AlgoView Team',
    },
  }

  // Educational platform schema
  const educationalSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalWebsiteType',
    name: 'AlgoView - Algorithm Learning Platform',
    url: 'https://algovieww.me',
    description:
      'Interactive platform to learn data structures and algorithms through visual animations',
    about: {
      '@type': 'Thing',
      name: 'Data Structures and Algorithms',
    },
    teaches: ['Sorting Algorithms', 'Graph Algorithms', 'Dynamic Programming', 'Data Structures'],
  }

  // FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is AlgoView?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'AlgoView is an interactive platform to learn data structures and algorithms visually through step-by-step animations, code examples, and tutorials.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is AlgoView free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, AlgoView offers free access to most features. We also offer premium features for enhanced learning experience.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I visualize different algorithms?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, AlgoView supports visualization for sorting algorithms, graph algorithms, dynamic programming, and many more with step-by-step animation controls.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does AlgoView help with interview preparation?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolutely! We provide interview preparation resources, LeetCode integration, practice problems, and detailed solutions.',
        },
      },
    ],
  }

  return (
    <>
      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Web Application Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />

      {/* Educational Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(educationalSchema) }}
      />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}

export default SchemaMarkup
