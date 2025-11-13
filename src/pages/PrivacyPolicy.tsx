import React, { useState } from 'react';

// Define the structure for the Table of Contents
interface TocItem {
  id: string;
  label: string;
}

// Rename to match the style of Terms.tsx and accept onBack if used as a page
const PrivacyPolicyPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  // --- TOC Data Structure ---
  const toc: TocItem[] = [
    { id: 'governing-law', label: '1. Governing Law & Acceptance' },
    { id: 'application', label: '2. Application of Policy' },
    { id: 'definitions', label: '3. Key Definitions (Personal & Sensitive Data)' },
    { id: 'info-you-provide', label: '4. Information You Provide to Us' },
    { id: 'info-we-collect-auto', label: '5. Information We Automatically Collect' },
    { id: 'use-of-info', label: '6. How We Use the Information' },
    { id: 'sharing-info', label: '7. How We Share Any Information' },
    { id: 'third-party-links', label: '8. Third-Party Links and Services' },
    { id: 'cookies', label: '9. Cookies and Tracking' },
    { id: 'security', label: '10. Security Precautions' },
    { id: 'permissible-age', label: '11. Permissible Age' },
    { id: 'data-retention', label: '12. Data Retention' },
    { id: 'consent-rights', label: '13. Your Consent and Rights' },
    { id: 'grievance-officer', label: '14. Grievance Officer & Contact' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Offset by a bit to account for sticky headers/TOC
      const yOffset = -80; 
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // --- Theme/Styling Placeholders (Copied from Terms.tsx) ---
  const styles = {
    container: 'bg-[var(--arz-background, #f8f8f8)] text-[var(--arz-text, #333)] min-h-screen py-10',
    contentWrapper: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row',
    tocContainer: 'lg:w-1/4 lg:sticky top-20 h-fit lg:mr-8 p-4 bg-white shadow-lg rounded-xl',
    termsBody: 'lg:w-3/4 bg-white p-6 md:p-10 shadow-lg rounded-xl',
    mainHeading: 'text-4xl font-extrabold text-[var(--arz-primary, #4a00e0)] mb-6',
    sectionHeading: 'text-3xl font-bold text-[var(--arz-primary, #4a00e0)] mt-12 mb-6',
    subHeading: 'text-2xl font-bold text-[var(--arz-text, #333)] mt-8 mb-4 border-b pb-2',
    paragraph: 'mb-4 leading-relaxed',
    list: 'list-disc ml-6 space-y-2',
    orderedList: 'list-decimal ml-6 space-y-2',
    strong: 'font-semibold text-[var(--arz-primary, #4a00e0)]',
    highlightNote: 'px-4 py-3 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 my-4 text-sm',
    tocLink: 'block py-1 text-sm text-gray-600 hover:text-[var(--arz-primary, #4a00e0)] transition-colors cursor-pointer',
  };

  // Helper function for the main content
  const P: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <p className={styles.paragraph}>{children}</p>
  );

  return (
    <div className={styles.container}>
      {/* Ensure your Arz background/theme colors are set in your global CSS or as CSS variables */}
      <style jsx global>{`
        :root {
          /* Example of how to define your brand colors for this component to use */
          --arz-primary: #4a00e0; /* Your brand primary color */
          --arz-background: #f4f7f9; /* Light background */
          --arz-text: #1a1a1a; /* Dark text */
        }
      `}</style>
      
      {/* Optional: Back Button when viewed as a standalone page */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <button 
            onClick={onBack} 
            className="text-sm font-semibold text-[var(--arz-primary, #4a00e0)] hover:text-black transition-colors"
        >
            &larr; Back to Home
        </button>
      </div>

      <div className={styles.contentWrapper}>

        {/* --- Table of Contents (TOC) --- */}
        <div className={styles.tocContainer}>
          <h3 className="text-xl font-bold mb-4">Table of Contents</h3>
          <ul className="space-y-1">
            {toc.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.id);
                  }}
                  className={styles.tocLink}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t pt-4 text-xs text-gray-500">
            <P>Version: November 2025</P>
          </div>
        </div>

        {/* --- Privacy Policy Body --- */}
        <div className={styles.termsBody}>
          <h1 className={styles.mainHeading}>Arz Privacy Policy</h1>
          <P>
            The Arz application and website (“Platform”) are made available to you by Arz Private Limited (hereinafter may be referred to as the “Company”, “we”, “us”, and “our”) respect your privacy and is committed to protecting it through its compliance with its privacy policy.
          </P>
          <P>
            This policy describes: (i) the type of information that the Company may collect from you when you access or use its Services; and (ii) the Company’s practices for collecting, using, maintaining, protecting and disclosing that information.
          </P>

          {/* 1. Governing Law & Acceptance */}
          <h2 id="governing-law" className={styles.sectionHeading}>1. Governing Law & Acceptance</h2>
          <P>
            This Privacy Policy is published in accordance with the (Indian) Information Technology Act, 2000 and the rules/regulations framed thereunder.
          </P>
          <div className={styles.highlightNote}>
            <strong>Please do not avail our Services if you do not agree to our Privacy Policy.</strong> By using our Services, you expressly consent to the Company's collection, use, disclosure and retention of your Personal Information as described here.
          </div>
          <P>
            This policy may change from time to time. Your continued use of the Company's Services after any change is deemed to be acceptance of those changes.
          </P>

          {/* 2. Application of Policy */}
          <h2 id="application" className={styles.sectionHeading}>2. Application of Policy</h2>
          <P>
            This policy specifically addresses the information collected through the company's services, including email, text, and other electronic communications associated with those services.
          </P>
          <P>
            It <span className={styles.strong}>does not extend</span> to information provided to or collected by third parties that users may use in connection with the Company's services.
          </P>

          {/* 3. Key Definitions */}
          <h2 id="definitions" className={styles.sectionHeading}>3. Key Definitions (Personal & Sensitive Data)</h2>
          <ul className={styles.list}>
            <li>
              <span className={styles.strong}>“Personal Information”</span>: Any information that relates to a natural person, which, either directly or indirectly, is capable of identifying the person concerned.
            </li>
            <li>
              <span className={styles.strong}>“Sensitive Personal Data or Information”</span>: Personal Information relating to: password; financial information (bank account, cards, etc.); physical, physiological and mental health condition; sexual orientation; medical records and history; and biometric information. (Note: excludes data freely available in the public domain).
            </li>
            <li>
              <span className={styles.strong}>“Personally Identifiable Information”</span>: Information that can be used to identify you (e.g., name, email, contact number, occupation, date of birth, Aadhaar, PAN, GSTIN, login password, gender, etc.).
            </li>
            <li>
              <span className={styles.strong}>“Non-Personal Information”</span>: Information that cannot be used to identify you (e.g., web pages viewed).
            </li>
          </ul>
          <P className={styles.highlightNote}>
            <strong>Accuracy Note:</strong> Inaccurate information may affect your ability to use the Services. You are responsible for ensuring the accuracy of the Personally Identifiable Information you submit.
          </P>

          {/* 4. Information You Provide to Us */}
          <h2 id="info-you-provide" className={styles.sectionHeading}>4. Information You Provide to Us</h2>
          <P>The Company collects the following categories of information directly from you:</P>
          <ol className={styles.orderedList}>
            <li>
              <span className={styles.strong}>Your account information:</span> Full name, email address, postal code, password, gender, mobile phone number, and profile picture. (Also includes data fetched via third-party sign-in like Facebook/Google).
            </li>
            <li>
              <span className={styles.strong}>Your preferences:</span> Time zone and language settings.
            </li>
            <li>
              <span className={styles.strong}>Your content:</span> Reviews, photographs, comments, lists, followers, ordering history, special requests, and contact information of people you notify of orders.
            </li>
            <li>
              <span className={styles.strong}>Your searches and activities:</span> Search terms and results selected.
            </li>
            <li>
              <span className={styles.strong}>Your browsing information:</span> Duration of use, features used, and ads clicked.
            </li>
            <li>
              <span className={styles.strong}>Your communications:</span> Messages between you and other users/Hosts/customers, participation in surveys/contests, and requests for features.
            </li>
            <li>
              <span className={styles.strong}>Your transactional information:</span> Transaction details, PAN, billing, and payment card/details to process requests.
            </li>
            <li>
              <span className={styles.strong}>Your Public Posts ("User Contributions"):</span> Information like ratings, reviews, tips, photos, to be published on public areas of the Services. <span className={styles.strong}>(Posted at your own risk).</span>
            </li>
            <li>
              <span className={styles.strong}>Verification/Safety Data (for trips, hosting):</span> A clear <span className={styles.strong}>selfie photograph</span> and a valid <span className={styles.strong}>government-issued identification document</span> (PAN Card, Passport, or Driving License). This is securely stored, encrypted, and used only for verification.
            </li>
            <li>
              <span className={styles.strong}>Your phone number and name:</span> Visible on the Platform to other users, hosts, and venue providers for contact related to services/goods.
            </li>
          </ol>

          {/* 5. Information We Automatically Collect */}
          <h2 id="info-we-collect-auto" className={styles.sectionHeading}>5. Information We Automatically Collect</h2>
          <P>This information is collected automatically as you navigate or use the Services:</P>
          <ul className={styles.list}>
            <li><span className={styles.strong}>Usage information:</span> Traffic data, location data, logs, and resources accessed.</li>
            <li><span className={styles.strong}>Computer and device information:</span> IP address, operating systems, browser type, device type, unique device identifier, and mobile network info.</li>
            <li><span className={styles.strong}>Stored information and files:</span> Access to metadata associated with files on your mobile device (e.g., photographs, contacts).</li>
            <li><span className={styles.strong}>Location information:</span> Real-time device location, as permitted by you.</li>
            <li><span className={styles.strong}>Mobile device IDs:</span> Unique identifiers used to recognize you for tracking and advertising purposes.</li>
            <li><span className={styles.strong}>Your activity on the Services:</span> Search queries, comments, pages viewed, and error logs.</li>
            <li><span className={styles.strong}>Applications:</span> Information about other applications on your mobile phone for personalization.</li>
          </ul>

          {/* 6. How We Use the Information */}
          <h2 id="use-of-info" className={styles.sectionHeading}>6. How We Use the Information</h2>
          <P>We use the collected information for various purposes, including:</P>
          <ul className={styles.list}>
            <li><span className={styles.strong}>Service Provision:</span> To take, handle, and fulfil orders, deliver products/services, and process payments.</li>
            <li><span className={styles.strong}>Improvement:</span> To analyze performance, fix errors, and improve the usability and effectiveness of the Services.</li>
            <li><span className={styles.strong}>Personalization:</span> To recommend features, events, and services that might interest you, and personalize your experience.</li>
            <li><span className={styles.strong}>Legal Compliance:</span> To comply with laws, e.g., collecting PAN/Aadhaar from hosts for identity verification.</li>
            <li><span className={styles.strong}>Communication:</span> To communicate with you via phone, e-mail, or chat regarding the Services.</li>
            <li><span className={styles.strong}>Advertising:</span> To display interest-based ads (Note: We do not use personally identifying information for this).</li>
            <li><span className={styles.strong}>Security:</span> Fraud prevention, credit risk assessment, and protecting the security of users and the Company.</li>
            <li><span className={styles.strong}>Research and Auditing:</span> To conduct research on user base, analyze usage patterns, and for internal auditing.</li>
          </ul>

          {/* 7. How We Share Any Information */}
          <h2 id="sharing-info" className={styles.sectionHeading}>7. How We Share Any Information</h2>
          <h3 className={styles.subHeading}>General Disclosures</h3>
          <ul className={styles.list}>
            <li>To our shareholders, investors, and any entities under common ownership or control.</li>
            <li>To contractors, advertisers/service providers (e.g., logistics, payment collection, analytics), credit agencies, and other third parties bound by confidentiality.</li>
            <li>To third parties to market their products or services to you, provided they keep Personal Information confidential.</li>
            <li>Internally to employees and representatives on a strictly "need to know" basis.</li>
          </ul>

          <h3 className={styles.subHeading}>Specific Disclosures</h3>
          <ul className={styles.list}>
            <li><span className={styles.strong}>Service Providers:</span> Sharing information with outside vendors for emails, messages, push notifications, voice recognition, analytics, payment processing, and hosting services.</li>
            <li><span className={styles.strong}>Hosts/Organizers:</span> Sharing information with event or trip hosts/organizers to the extent necessary for bookings, attendance, and communication.</li>
            <li><span className={styles.strong}>Other Users:</span> Your username is visible for social interaction. Your profile picture is only visible after you have mutually connected ("friends"). <span className={styles.strong}>We do not disclose your contact number, government identification, or other sensitive personal information to any user</span>, unless required by law or for a safety dispute.</li>
            <li><span className={styles.strong}>Legal Purposes:</span> Sharing information with law enforcement, government agencies, courts, or other organizations to comply with legal processes (subpoena, court order), investigate illegal activities, or protect the rights and safety of the Company/users/public.</li>
            <li><span className={styles.strong}>Business Transfer:</span> Disclosure or transfer of User Information to a third party as part of a reorganization or sale of assets or business.</li>
            <li><span className={styles.strong}>Consent:</span> In any other circumstances where we have your explicit consent.</li>
          </ul>

          {/* 8. Third-Party Links and Services */}
          <h2 id="third-party-links" className={styles.sectionHeading}>8. Third-Party Links and Services</h2>
          <P>
            The Services may contain links to third-party websites. Your use of these features may result in the collection, processing, or sharing of information about you. We are <span className={styles.strong}>not responsible</span> for the content or privacy practices of these third-party websites or services. We strongly encourage you to read their privacy policies.
          </P>

          {/* 9. Cookies and Tracking */}
          <h2 id="cookies" className={styles.sectionHeading}>9. Cookies and Tracking</h2>
          <P>
            We may use ‘cookies’ (alphanumeric identifiers with a small amount of data) stored on your device's hard drive to offer certain features and collect information. We also use cookies from third-party partners for marketing and promotional purposes. Most web browsers are set to accept cookies by default.
          </P>

          {/* 10. Security Precautions */}
          <h2 id="security" className={styles.sectionHeading}>10. Security Precautions</h2>
          <P>
            We maintain reasonable physical, electronic, and managerial procedures to safeguard and prevent unauthorized access to your information. We follow generally accepted industry standards to protect Personal Information.
          </P>
          <P className={styles.highlightNote}>
            Users must accept the <span className={styles.strong}>inherent security implications of data transmission over the internet</span>, which cannot always be guaranteed as completely secure. You should not share your username, password, or other security information with anyone.
          </P>

          {/* 11. Permissible Age */}
          <h2 id="permissible-age" className={styles.sectionHeading}>11. Permissible Age</h2>
          <P>
            The Services are <span className={styles.strong}>not intended for users under the age of 18</span> (Permissible Age). If you are under 18, you must use the Services under the supervision of your parent or legal guardian. If we become aware that a person submitting Personal Information is under 18, we will delete the account and related information as soon as possible.
          </P>

          {/* 12. Data Retention */}
          <h2 id="data-retention" className={styles.sectionHeading}>12. Data Retention</h2>
          <P>
            A user can close an account or request the deletion of Personal Information by contacting the Grievance Officer. We reserve the right to retain your Personal Information as required by applicable laws or for the purpose it was collected. We may also retain your data in anonymised form for analytical and research purposes.
          </P>

          {/* 13. Your Consent and Rights */}
          <h2 id="consent-rights" className={styles.sectionHeading}>13. Your Consent and Rights</h2>
          <ul className={styles.list}>
            <li><span className={styles.strong}>Consent:</span> By accessing or using the Services, you consent to the collection, use, storage, disclosure, and processing of your information in accordance with this Privacy Policy.</li>
            <li><span className={styles.strong}>Right to Withdraw:</span> You have the right to <span className={styles.strong}>withdraw your consent</span> at any time by writing to the Grievance Officer. Withdrawal will not be retrospective. Note that we may discontinue services if consent is withdrawn.</li>
            <li><span className={styles.strong}>Right to Access/Correct:</span> You can <span className={styles.strong}>access, modify, correct, and delete</span> the Personal Information provided by emailing the Company at [thearzkaro.com].</li>
          </ul>

          {/* 14. Grievance Officer & Contact */}
          <h2 id="grievance-officer" className={styles.sectionHeading}>14. Grievance Officer & Contact</h2>
          <P>In accordance with Indian IT laws, the contact details for the Grievance Officer are:</P>
          <div className="bg-gray-50 p-4 rounded-lg my-4 border border-gray-200">
            <P><span className={styles.strong}>Name:</span> Mehak Anand</P>
            <P><span className={styles.strong}>Email id:</span> <a href="mailto:thearzkaro@gmail.com" className="text-blue-600 hover:underline">thearzkaro@gmail.com</a></P>
          </div>
          <P>For any queries relating to the processing/usage of information or the Company's Privacy Policy, you may email the contact provided above.</P>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;