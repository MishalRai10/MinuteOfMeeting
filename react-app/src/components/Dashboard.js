import React, { useState, useRef, useEffect } from 'react';
import { FileText, Upload, Send, Loader, Copy, Trash, ClipboardList } from 'lucide-react';
import { generateSummary, sendEmail, uploadFile } from '../services/api.js';

const Dashboard = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);
  const [minutesText, setMinutesText] = useState('');
  const fileInputRef = useRef(null);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [emailData, setEmailData] = useState({ emails: '', subject: 'Meeting Minutes', message: '' });

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setSummary(null);

    try {
      const response = await uploadFile(file);
      if (response.success) {
        setSummary(response.minutes);
        setShowEmailPopup(true);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to process file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError('');
    setSummary(null);

    try {
      const response = await generateSummary(content);
      if (response.success) {
        setSummary(response.minutes);
        setShowEmailPopup(true);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to generate summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (minutesText) {
      navigator.clipboard.writeText(minutesText);
      alert('Minutes copied to clipboard!');
    }
  };

  const handleDelete = () => {
    setSummary(null);
    setMinutesText('');
    setContent('');
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSendEmail = async () => {
    try {
      const formData = new FormData();

      // Split emails and trim whitespace
      const emails = emailData.emails.split(',').map(e => e.trim());

      // Create the .txt file
      const minutesFile = new Blob([minutesText], { type: 'text/plain' });

      formData.append('emails', emails.join(','));
      formData.append('subject', 'Meeting Minutes');
      formData.append('message', 'Please find attached meeting minutes');
      formData.append('attachment', minutesFile, 'meeting_minutes.txt');

      await sendEmail(formData);
      setShowEmailPopup(false);
      alert('Email sent successfully!');
    } catch (error) {
      console.error('Email send failed:', error);
      alert('Failed to send email: ' + error.message);
    }
  };

  const cleanText = (text) => text.replace(/\*\*/g, '');

  useEffect(() => {
    if (summary) {

      const text = `
        Meeting Minutes
  
        Overview:
        ${summary.overview}
  
        Key Points:
        ${summary.keyPoints.map(cleanText).join('\n')}
  
        Action Items:
        ${summary.actionItems.map(cleanText).join('\n')}
      `;
      setMinutesText(text);
    }
  }, [summary]);

  return (
    <div className="w-full mt-9 mb-4 h-screen flex p-4 pb-6">
      {/* Left Panel: Input Section */}
      <div className="w-1/2 p-2 flex-grow">
        <div className="bg-white rounded-xl shadow-lg p-4 h-full flex flex-col">
          <div className="flex items-center mb-4">
            <FileText className="h-5 w-5 text-blue-600" />
            <h2 className="ml-2 text-lg font-semibold text-gray-900">Generate Meeting Minutes</h2>
          </div>

          <div className="mb-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex justify-center items-center py-2 px-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 focus:outline-none focus:border-blue-500 transition-colors"
            >
              <Upload className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-600 text-sm">Upload meeting transcript file</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".txt,.docx"
              className="hidden"
            />
          </div>

          <div className="mb-1 text-xs text-gray-700">Or paste meeting transcript:</div>
          <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-36 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 flex-grow text-sm"
              placeholder="Paste your meeting transcript here..."
            />

            {error && (
              <div className="mt-2 p-2 bg-red-50 rounded-md">
                <p className="text-xs text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="mt-2 w-full flex justify-center items-center py-2 px-3 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="-ml-1 mr-2 h-4 w-4" />
                  Generate Minutes
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Divider */}
      <div className="border-l border-gray-300 mx-2"></div>

      {/* Right Panel: Output Section */}
      <div className="w-1/2 p-2 flex-grow">
        <div className="bg-white rounded-xl shadow-lg p-4 h-full flex flex-col">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader className="animate-spin h-12 w-12 text-blue-600" />
              <p className="mt-2 text-sm text-gray-600">Generating minutes...</p>
            </div>
          ) : summary ? (
            <div className="flex flex-col overflow-y-auto">
              <div className="flex justify-end mb-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center px-2 py-1 text-xs text-gray-600 hover:text-gray-900 focus:outline-none"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center px-2 py-1 ml-2 text-xs text-gray-600 hover:text-gray-900 focus:outline-none"
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Meeting Minutes</h3>
                <div className="prose max-w-none">
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Overview</h4>
                    <p className="text-sm text-gray-700">
                      {cleanText(summary.overview).replace(/\s+/g, ' ')}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Key Points</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                      {summary.keyPoints.map((point, index) => (
                        <li key={index}>{cleanText(point)}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Action Items</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                      {summary.actionItems.map((item, index) => (
                        <li key={index}>{cleanText(item)}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <ClipboardList className="h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">Your minutes will appear here.</p>
            </div>
          )}
        </div>
      </div>
      {showEmailPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Send Meeting Minutes</h3>

            <input
              type="text"
              placeholder="Recipient emails (comma-separated)"
              className="w-full mb-2 p-2 border rounded"
              value={emailData.emails}
              onChange={(e) => setEmailData({ ...emailData, emails: e.target.value })}
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowEmailPopup(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
                disabled={loading}  // Add loading state if needed
              >
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;