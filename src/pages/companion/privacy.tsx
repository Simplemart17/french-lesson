import Head from 'next/head';

const LAST_UPDATED = 'July 19, 2026';

interface Section {
  heading: string;
  paragraphs?: string[];
  list?: string[];
}

// Kept in sync with the in-app policy in the Companion app
// (app/(tabs)/profile/privacy-policy.tsx). Update both together.
const sections: Section[] = [
  {
    heading: '1. Who We Are',
    paragraphs: [
      'Companion ("we", "us", "our") is an AI-powered French language learning application. By using Companion, you agree to the collection and use of information described in this policy.',
    ],
  },
  {
    heading: '2. Information We Collect',
    paragraphs: [
      'Account information: your email address and display name when you create an account.',
      'Learning data: exercises you complete, scores, daily activity, streaks, and your CEFR level progress — used solely to personalise your learning experience.',
      'Voice recordings: audio captured during pronunciation assessments and voice conversation sessions. Audio is streamed to our secure servers for real-time processing and is not retained after the session ends.',
      'Conversation transcripts: text transcripts of your voice and text conversations with the AI companion, including corrections. These are stored to generate your learning summary and improve personalisation.',
      'Companion memory: facts and preferences extracted from your conversations (e.g. your name, topics you enjoy) to make future sessions more relevant.',
      'Error patterns: categories of recurring mistakes (e.g. "subject-verb agreement") used to generate targeted practice exercises.',
      'Device information: OS version and app version collected automatically by our error monitoring provider for crash reporting. No screenshots, transcripts, conversation content, or email are shared with the error monitor.',
    ],
  },
  {
    heading: '3. How We Use Your Information',
    paragraphs: ['We use your data exclusively to:'],
    list: [
      'Provide and personalise the language learning experience',
      'Track your progress and maintain your learning streak',
      'Generate AI-powered exercises, conversations, and feedback',
      'Assess your pronunciation and identify areas for improvement',
      'Remember preferences and facts to make conversations more natural',
      'Understand which features help learners improve, through anonymised usage analytics',
      'Detect and fix crashes and technical issues',
    ],
  },
  {
    heading: '4. Third-Party Services',
    paragraphs: [
      "Companion relies on the following third-party providers to deliver its features. Each provider's own privacy policy governs their data practices.",
      'Supabase (supabase.com): Our database and authentication provider. Your account data and learning history are stored on Supabase infrastructure.',
      "OpenAI (openai.com): Powers AI conversation, exercise generation, text-to-speech, and companion memory embeddings. Conversation content is sent to OpenAI's API for processing per their usage policies.",
      'Microsoft Azure Speech (azure.microsoft.com): Powers pronunciation assessment. Audio clips are transmitted to Azure for phoneme-level scoring.',
      'Expo Push Service (expo.dev): Delivers push notifications (streak, vocabulary, and daily practice reminders) to your device. Reminder notifications may include short study-progress snippets, such as a recurring French mistake you are working on — never your conversation content or personal facts you have shared with the Companion. You can disable each reminder type in Settings.',
      'PostHog (posthog.com): Product analytics. We send anonymised usage events (for example: a conversation was completed, an exercise was finished, and coarse score bands) tagged only with your opaque user ID — never your email, name, conversation content, or any French text you produce. Used to understand which features help learners and to operate feature flags.',
      'Sentry (sentry.io): Crash reporting and error monitoring. We send anonymised crash reports tagged only with your opaque user ID — never your email, screenshots, conversation transcripts, or French text content. Sentry may automatically collect device OS and app version for crash diagnostics.',
    ],
  },
  {
    heading: '5. Data Retention',
    paragraphs: [
      'Your data is retained for as long as your account is active. You may request deletion of your account and all associated data at any time by contacting us at privacy@companion.app. Upon deletion, your data is permanently removed from our systems within 30 days.',
    ],
  },
  {
    heading: '6. Data Security',
    paragraphs: [
      'All data in transit is encrypted using TLS. Data at rest is protected using industry-standard encryption provided by Supabase. Access to your data is restricted through Row-Level Security policies — each user can only access their own records. AI API keys are stored exclusively on our server infrastructure and are never transmitted to your device.',
    ],
  },
  {
    heading: "7. Children's Privacy",
    paragraphs: [
      'Companion is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.',
    ],
  },
  {
    heading: '8. Your Rights',
    paragraphs: ['Depending on your location, you may have the right to:'],
    list: [
      'Access the personal data we hold about you',
      'Correct inaccurate data',
      'Request deletion of your data',
      'Object to or restrict processing of your data',
      'Data portability',
    ],
  },
  {
    heading: '9. Changes to This Policy',
    paragraphs: [
      'We may update this Privacy Policy from time to time. We will notify you of significant changes through the app or via email. Continued use of Companion after changes take effect constitutes your acceptance of the updated policy.',
    ],
  },
  {
    heading: '10. Contact',
    paragraphs: [
      'If you have questions about this Privacy Policy or how we handle your data, please contact us at privacy@companion.app.',
    ],
  },
];

export default function CompanionPrivacyPolicyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy | Companion</title>
        <meta
          name="description"
          content="Privacy policy for the Companion AI French learning app: what data we collect, how we use it, and your rights."
        />
      </Head>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">Companion — Privacy Policy</h1>
          <p className="text-gray-600">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="p-6 mb-8 prose bg-white shadow-sm rounded-xl prose-gray max-w-none">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs?.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
              {section.list && (
                <ul>
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
