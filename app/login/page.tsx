'use client';
import { signIn } from 'next-auth/react';
import Head from 'next/head';
import { FiArrowRight, FiBookOpen } from 'react-icons/fi';

export default function LoginPage() {
  const handleLogin = () => signIn('google', { callbackUrl: '/landing-page'});

  return (
    <>
      <Head>
        <title>Login | Oke News</title>
        <meta name="description" content="Login to access Bagas News content" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl bg-gray-800 border border-gray-700">
          <div className="p-8 sm:p-10">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <FiBookOpen className="text-white text-2xl" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-1">Oke News</h1>
              <p className="text-gray-400">Reliable reporting from around the globe</p>
            </div>

            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200"
              aria-label="Sign in with Google"
            >
              <svg 
                className="w-5 h-5" 
                aria-hidden="true" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="mt-6 text-center text-sm">
              <p className="text-gray-400">
                By continuing, you agree to our{' '}
                <a href="#" className="font-medium text-blue-400 hover:text-blue-300">Terms</a> and{' '}
                <a href="#" className="font-medium text-blue-400 hover:text-blue-300">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
