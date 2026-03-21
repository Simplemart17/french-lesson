import React from 'react';
import Head from 'next/head';
import Translator from '@/components/features/Translator';
import { useRouter } from 'next/router';

const TranslatorPage = () => {
  const router = useRouter();
  const { text } = router.query;

  return (
    <>
      <Head>
        <title>Translator | French Learning App</title>
        <meta name="description" content="Translate text between French and English to help with your language learning" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Translator</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-700 mb-6">
            Use this translator to help you understand French text or practice creating French sentences.
            You can translate between French and English, and save useful phrases to review later.
          </p>

          <Translator
            initialText={typeof text === 'string' ? text : ''}
            minHeight={200}
          />

          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Tips for using the translator</h2>

            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Type or paste text in the left box to translate automatically</li>
              <li>Click the swap button to switch between languages</li>
              <li>The translator will automatically detect the language of your text</li>
              <li>Use the &quot;Save&quot; button to save useful phrases for later review</li>
              <li>For better learning, try to translate by yourself first, then check your answer</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default TranslatorPage; 