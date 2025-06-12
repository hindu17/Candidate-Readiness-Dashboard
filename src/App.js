import React, { useState } from 'react';

const App = () => {
  const [cvText, setCvText] = useState('');
  const [jdText, setJdText] = useState('');
  const [originalScore, setOriginalScore] = useState(null);
  const [optimizedScore, setOptimizedScore] = useState(null);
  const [optimizedCvText, setOptimizedCvText] = useState('');
  const [skillGaps, setSkillGaps] = useState([]);
  const [loading, setLoading] = useState(false);

  const callGeminiAPI = async (prompt) => {
    const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      return result?.candidates?.[0]?.content?.parts?.[0]?.text || "Error: Invalid response from AI.";
    } catch (err) {
      return `Error calling AI: ${err.message}`;
    }
  };

 const handleMatchScore = async () => {
  setLoading(true);

  const matchScorePrompt = `Analyze the following Candidate CV and Job Description.
CV: ${cvText}
Job Description: ${jdText}

Provide a score for how well the CV matches the JD out of 100.
Then, provide an optimized version of the CV that is better tuned to the Job Description.
Finally, give a new score for the optimized CV out of 100.

Format your response clearly with these exact sections:
Original CV Match Score: [Score]%
Optimized CV Text: [Optimized CV Content]
Optimized CV Match Score: [Score]%`;

 const result = await callGeminiAPI(matchScorePrompt);
 console.log("🔍 Gemini Match Score Response:", result);


  // ✅ Improved regex
  const match = result.match(
    /Original CV Match Score:\s*(\d+)%[\s\S]*?Optimized CV Text:\s*([\s\S]*?)Optimized CV Match Score:\s*(\d+)%/
  );

  if (match) {
    setOriginalScore(match[1]);
    setOptimizedCvText(match[2].trim());
    setOptimizedScore(match[3]);
  } else {
    setOriginalScore("Error");
    setOptimizedScore("Error");
    setOptimizedCvText("Failed to parse AI response");
  }

 

    const skillGapsPrompt = `Based on the following Candidate CV and Job Description, identify 3-5 key skill gaps.
  CV: ${cvText}
  Job Description: ${jdText}

  For each skill gap, suggest a very brief mini-assignment or learning snippet (1-2 sentences) to help close that gap.

  Format your response clearly with these exact sections:
  Skill Gaps:
  - [Skill 1]: [Mini-assignment/Learning snippet]
  - [Skill 2]: [Mini-assignment/Learning snippet]`;

    const skillsResult = await callGeminiAPI(skillGapsPrompt);
    const gaps = skillsResult.match(/- (.*?): (.*?)(?=\n- |$)/g);
    setSkillGaps(gaps?.map(gap => {
      const [, skill, desc] = gap.match(/- (.*?): (.*)/);
      return { skill, desc, result: null };
    }) || []);

    setLoading(false);
  };

  const handleDownload = () => {
    const blob = new Blob([optimizedCvText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'optimized_cv.txt';
    link.click();
  };

  const simulateSubmission = (index) => {
    const updatedGaps = [...skillGaps];
    updatedGaps[index].result = {
      assignmentResult: "Submitted Successfully",
      feedback: "Great effort! You're on the right track."
    };
    setSkillGaps(updatedGaps);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-indigo-700">SKANJO CV Matcher</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <textarea
          className="w-full h-52 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Paste Candidate CV..."
          value={cvText}
          onChange={(e) => setCvText(e.target.value)}
        />
        <textarea
          className="w-full h-52 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Paste Job Description (JD)..."
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
        />
      </div>

      <div className="flex justify-center">
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 disabled:opacity-50"
          onClick={handleMatchScore}
          disabled={loading || !cvText || !jdText}
        >
          {loading ? 'Processing...' : 'Match & Score CV'}
        </button>
      </div>

      {originalScore && (
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <div className="grid md:grid-cols-2 gap-6 text-lg">
            <p><strong className="text-gray-700">Original CV Match Score:</strong> <span className="text-indigo-600">{originalScore}%</span></p>
            <p><strong className="text-gray-700">Optimized CV Match Score:</strong> <span className="text-green-600">{optimizedScore}%</span></p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Optimized CV Text</h3>
            <pre className="bg-gray-100 border p-4 rounded-lg h-64 overflow-auto whitespace-pre-wrap text-gray-800">{optimizedCvText}</pre>
            <button
              onClick={handleDownload}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded transition-all"
            >
              Download Optimized CV
            </button>
          </div>
        </div>
      )}

      {skillGaps.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          <h3 className="text-2xl font-semibold text-purple-700">Skill Gaps & Assignments</h3>
          {skillGaps.map((gap, i) => (
            <div key={i} className="bg-gray-50 border p-4 rounded-lg space-y-2">
              <p><strong>{gap.skill}:</strong> {gap.desc}</p>
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded transition"
                onClick={() => simulateSubmission(i)}
              >
                Simulate Submission
              </button>
              {gap.result && (
                <div className="mt-2 text-green-800 text-sm">
                  <p><strong>Result:</strong> {gap.result.assignmentResult}</p>
                  <p><strong>Feedback:</strong> {gap.result.feedback}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
