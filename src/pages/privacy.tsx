import Head from 'next/head';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy | French Tutor AI</title>
        <meta name="description" content="French Tutor AI's privacy policy and data protection practices" />
      </Head>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">Privacy Policy</h1>
          <p className="text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="p-6 mb-8 prose bg-white shadow-sm rounded-xl prose-gray max-w-none">
          <h2>Introduction</h2>
          <p>
            At French Tutor AI, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
          </p>
          <p>
            Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
          </p>

          <h2>Information We Collect</h2>
          <h3>Personal Data</h3>
          <p>
            We may collect personal identification information from you in a variety of ways, including, but not limited to:
          </p>
          <ul>
            <li>When you register on our site</li>
            <li>When you subscribe to our newsletter</li>
            <li>When you respond to a survey</li>
            <li>When you fill out a form</li>
            <li>When you use our learning tools and features</li>
          </ul>
          <p>
            The personal information we collect may include your name, email address, and other information you provide.
          </p>

          <h3>Learning Data</h3>
          <p>
            To provide personalized learning experiences, we collect data about your learning activities, including:
          </p>
          <ul>
            <li>Lesson completion and progress</li>
            <li>Quiz and exercise results</li>
            <li>Pronunciation recordings (when you use our speech recognition features)</li>
            <li>Writing samples (when you use our grammar correction tools)</li>
            <li>Learning preferences and settings</li>
          </ul>

          <h3>Usage Data</h3>
          <p>
            We may also collect information about how the website is accessed and used. This usage data may include information such as your computer&apos;s Internet Protocol address (IP address), browser type, browser version, the pages of our website that you visit, the time and date of your visit, the time spent on those pages, and other diagnostic data.
          </p>

          <h2>How We Use Your Information</h2>
          <p>We may use the information we collect from you for the following purposes:</p>
          <ul>
            <li>To provide and maintain our service</li>
            <li>To personalize your learning experience</li>
            <li>To improve our website and services</li>
            <li>To send periodic emails (if you have opted in)</li>
            <li>To respond to your inquiries and provide customer support</li>
            <li>To monitor the usage of our service</li>
            <li>To detect, prevent, and address technical issues</li>
          </ul>

          <h2>Data Security</h2>
          <p>
            We implement appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information, username, password, transaction information, and data stored on our site.
          </p>

          <h2>Third-Party Services</h2>
          <p>
            We may employ third-party companies and individuals to facilitate our service, provide the service on our behalf, perform service-related services, or assist us in analyzing how our service is used. These third parties have access to your personal information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
          </p>

          <h2>Your Data Protection Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal information, including:
          </p>
          <ul>
            <li>The right to access the personal information we have about you</li>
            <li>The right to request correction of inaccurate personal information</li>
            <li>The right to request deletion of your personal information</li>
            <li>The right to object to processing of your personal information</li>
            <li>The right to data portability</li>
            <li>The right to withdraw consent</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us using the information provided at the end of this policy.
          </p>

          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date at the top of this policy.
          </p>
          <p>
            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p>
            Email: privacy@frenchtutor.ai<br />
          </p>
        </div>
      </div>
    </>
  );
}
