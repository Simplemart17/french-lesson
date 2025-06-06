import Head from 'next/head';

export default function TermsOfServicePage() {
  return (
    <>
      <Head>
        <title>Terms of Service | French Tutor AI</title>
        <meta name="description" content="Terms and conditions for using French Tutor AI's services" />
      </Head>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">Terms of Service</h1>
          <p className="text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="p-6 mb-8 prose bg-white shadow-sm rounded-xl prose-gray max-w-none">
          <h2>1. Introduction</h2>
          <p>
            Welcome to French Tutor AI. These Terms of Service (&quot;Terms&quot;) govern your access to and use of the French Tutor AI website and services (the &quot;Service&quot;). By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.
          </p>

          <h2>2. Accounts</h2>
          <p>
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
          </p>
          <p>
            You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
          </p>

          <h2>3. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are and will remain the exclusive property of French Tutor AI and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of French Tutor AI.
          </p>

          <h2>4. User Content</h2>
          <p>
            Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material (&quot;User Content&quot;). You are responsible for the User Content that you post on or through the Service, including its legality, reliability, and appropriateness.
          </p>
          <p>
            By posting User Content on or through the Service, you represent and warrant that: (i) the User Content is yours (you own it) or you have the right to use it and grant us the rights and license as provided in these Terms, and (ii) the posting of your User Content on or through the Service does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person.
          </p>

          <h2>5. Subscription and Payments</h2>
          <p>
            Some parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis, depending on the type of subscription plan you select. At the end of each period, your subscription will automatically renew under the same conditions unless you cancel it or French Tutor AI cancels it.
          </p>
          <p>
            You may cancel your subscription renewal either through your online account management page or by contacting our customer support team. A valid payment method is required to process the payment for your subscription. You shall provide French Tutor AI with accurate and complete billing information.
          </p>

          <h2>6. Free Trial</h2>
          <p>
            French Tutor AI may, at its sole discretion, offer a subscription with a free trial for a limited period of time. You may be required to enter your billing information in order to sign up for the free trial. If you do enter your billing information when signing up for a free trial, you will not be charged by French Tutor AI until the free trial has expired.
          </p>
          <p>
            At any time and without notice, French Tutor AI reserves the right to (i) modify the terms and conditions of the free trial offer, or (ii) cancel such free trial offer.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            In no event shall French Tutor AI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.
          </p>

          <h2>8. Disclaimer</h2>
          <p>
            Your use of the Service is at your sole risk. The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
          </p>
          <p>
            French Tutor AI, its subsidiaries, affiliates, and its licensors do not warrant that a) the Service will function uninterrupted, secure or available at any particular time or location; b) any errors or defects will be corrected; c) the Service is free of viruses or other harmful components; or d) the results of using the Service will meet your requirements.
          </p>

          <h2>9. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
          </p>

          <h2>10. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days&apos; notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>
          <p>
            By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Service.
          </p>

          <h2>11. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <p>
            Email: terms@frenchtutor.ai<br />
          </p>
        </div>
      </div>
    </>
  );
}
