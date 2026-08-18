import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Interview.css";

function Interview() {
  const location = useLocation();
  const navigate = useNavigate();

  const role = location.state?.role || "";
  const experience = location.state?.experience || "";
  const resumeText = location.state?.resumeText || "";
  const jobDescription =
    location.state?.jobDescription || "";

  const interviewQuestions =
    Array.isArray(location.state?.questions)
      ? location.state.questions
      : [];

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answer, setAnswer] = useState("");

  const [answers, setAnswers] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [isListening, setIsListening] =
    useState(false);

  const [interimTranscript, setInterimTranscript] =
    useState("");

  const recognitionRef = useRef(null);

  const speechSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window ||
      "webkitSpeechRecognition" in window);
  useEffect(() => {
    if (
      !role ||
      !experience ||
      !resumeText ||
      interviewQuestions.length === 0
    ) {
      navigate("/interview-setup", {
        replace: true,
      });
    }
  }, [
    role,
    experience,
    resumeText,
    interviewQuestions.length,
    navigate,
  ]);

  useEffect(() => {
    if (!speechSupported) {
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    
    recognition.onstart = () => {
      setIsListening(true);
      setInterimTranscript("");
    };
    // Speech result

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let liveTranscript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const transcript =
          event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          liveTranscript += transcript;
        }
      }

      setInterimTranscript(liveTranscript);

      if (finalTranscript.trim()) {
        setAnswer((previousAnswer) => {
          const previousText =
            previousAnswer.trim();

          const newText =
            finalTranscript.trim();

          if (!previousText) {
            return newText;
          }

          return `${previousText} ${newText}`;
        });

        setInterimTranscript("");
      }
    };


    recognition.onerror = (event) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      setIsListening(false);
      setInterimTranscript("");
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript("");
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {
        // Recognition may already be stopped.
      }

      recognitionRef.current = null;
    };
  }, [speechSupported]);

  const startListening = () => {
    if (!speechSupported) {
      return;
    }

    if (!recognitionRef.current) {
      return;
    }

    try {
      recognitionRef.current.start();
    } catch {
      // Browser throws if recognition is
      // already running.
      console.log(
        "Speech recognition is already running."
      );
    }
  };


  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Recognition may already be stopped.
      }
    }

    setIsListening(false);
    setInterimTranscript("");
  };

  const getUserEmail = () => {
    const storedUser =
      localStorage.getItem("hiremindUser");

    if (!storedUser) {
      return "";
    }

    if (storedUser.includes("@")) {
      return storedUser.toLowerCase();
    }
    try {
      const parsedUser =
        JSON.parse(storedUser);

      if (
        parsedUser &&
        typeof parsedUser === "object"
      ) {
        return (
          parsedUser.email ||
          parsedUser.userEmail ||
          ""
        ).toLowerCase();
      }
    } catch {
      // Stored value was not JSON.
    }

    return "";
  };

  const handleNext = async () => {
    const trimmedAnswer = answer.trim();
    if (!trimmedAnswer) {
      return;
    }
    stopListening();

    const updatedAnswers = [...answers];

    updatedAnswers[currentQuestion] =
      trimmedAnswer;

    setAnswers(updatedAnswers);

    setInterimTranscript("");

    const isLastQuestion =
      currentQuestion ===
      interviewQuestions.length - 1;

    if (!isLastQuestion) {
      setAnswer("");

      setCurrentQuestion(
        (previousQuestion) =>
          previousQuestion + 1
      );

      return;
    }

    try {
      setLoading(true);
      setError("");

      const userEmail = getUserEmail();

      console.log(
        "============="
      );

      console.log(
        "Submitting interview evaluation..."
      );

      console.log("Role:", role);
      console.log(
        "Experience:",
        experience
      );

      console.log(
        "Questions:",
        interviewQuestions.length
      );

      console.log(
        "Answers:",
        updatedAnswers.length
      );

      console.log(
        "Resume text length:",
        resumeText.length
      );

      console.log(
        "User email:",
        userEmail
      );

      console.log(
        "================="
      );


      const response = await fetch(
        "http://localhost:5000/api/interview/evaluate",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            userEmail,

            role,

            experience,

            jobDescription,

            resumeText,

            questions: interviewQuestions,

            answers: updatedAnswers,
          }),
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Server returned an invalid evaluation response."
        );
      }

      console.log(
        "Evaluation response:",
        data
      );


      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to evaluate interview."
        );
      }

      if (!data.results) {
        throw new Error(
          "Interview evaluation results were not returned."
        );
      }

      console.log(
        "Interview evaluation successful."
      );

      console.log(
        "Interview ID:",
        data.interviewId
      );
      navigate("/results", {
        state: {
          results: data.results,

          role,

          experience,

          interviewId:
            data.interviewId || null,
        },
      });
    } catch (err) {
      console.error(
        "Interview evaluation error:",
        err
      );

      setError(
        err.message ||
          "Unable to evaluate interview."
      );

      setLoading(false);
    }
  };

  if (
    !role ||
    !experience ||
    !resumeText ||
    interviewQuestions.length === 0
  ) {
    return (
      <main className="interview-page">
        <div className="interview-container">

          <div className="interview-complete">

            <div className="complete-icon">
              <i className="bi bi-exclamation-circle"></i>
            </div>

            <span className="interview-label">
              INTERVIEW ERROR
            </span>

            <h1>
              Unable to start interview
            </h1>

            <p>
              Your interview data is missing.
              Please start the interview again.
            </p>

            <div className="complete-actions">

              <button
                type="button"
                className="back-dashboard-btn"
                onClick={() =>
                  navigate(
                    "/interview-setup"
                  )
                }
              >
                Try Again
              </button>

            </div>

          </div>

        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="interview-page">
        <div className="interview-container">

          <div className="interview-complete">

            <div className="complete-icon">
              <i className="bi bi-stars"></i>
            </div>

            <span className="interview-label">
              AI INTERVIEW
            </span>

            <h1>
              Evaluating your interview...
            </h1>

            <p>
              HireMind AI is analyzing your
              answers and preparing your
              interview results.
            </p>

          </div>

        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="interview-page">
        <div className="interview-container">

          <div className="interview-complete">

            <div className="complete-icon">
              <i className="bi bi-exclamation-circle"></i>
            </div>

            <span className="interview-label">
              INTERVIEW ERROR
            </span>

            <h1>
              Something went wrong
            </h1>

            <p>
              {error}
            </p>

            <div className="complete-actions">

              <button
                type="button"
                className="back-dashboard-btn"
                onClick={() => {
                  setError("");
                }}
              >
                Go Back
              </button>

            </div>

          </div>

        </div>
      </main>
    );
  }

  const progress =
    ((currentQuestion + 1) /
      interviewQuestions.length) *
    100;
  const currentQuestionText =
    interviewQuestions[currentQuestion];

  return (
    <main className="interview-page">

      <div className="interview-container">
        <div className="interview-header">

          <div>

            <span className="interview-label">
              AI INTERVIEW
            </span>

            <h1>
              Let's get started
            </h1>

            <p>
              Answer naturally using your
              microphone or type your answer.
            </p>

          </div>

          <div className="question-counter">

            <strong>
              {currentQuestion + 1}
            </strong>

            <span>
              / {interviewQuestions.length}
            </span>

          </div>

        </div>

        <div className="interview-progress">

          <div
            className="interview-progress-bar"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

        <section className="question-card">

          <div className="question-top">

            <span>
              QUESTION {currentQuestion + 1}
            </span>

            <div className="question-icon">

              <i className="bi bi-stars"></i>

            </div>

          </div>

          <h2>
            {currentQuestionText}
          </h2>

          <div className="answer-section">

            <label htmlFor="answer">
              Your answer
            </label>

            <textarea
              id="answer"
              value={answer}
              onChange={(event) =>
                setAnswer(
                  event.target.value
                )
              }
              placeholder={
                isListening
                  ? "Listening... speak your answer"
                  : "Click Start Speaking or type your answer"
              }
              rows={8}
              disabled={loading}
            />

            {isListening && (
              <div className="live-speech">

                <span className="live-dot"></span>

                <div>

                  <strong>
                    Listening...
                  </strong>

                  <p>
                    {interimTranscript ||
                      "Speak your answer now..."}
                  </p>

                </div>

              </div>
            )}

            <div className="voice-controls">

              {!speechSupported ? (

                <div className="voice-not-supported">

                  <i className="bi bi-exclamation-circle"></i>

                  Voice input is not supported
                  in this browser. Please use
                  Chrome or Edge.

                </div>

              ) : !isListening ? (

                <button
                  type="button"
                  className="voice-btn"
                  onClick={startListening}
                  disabled={loading}
                >

                  <i className="bi bi-mic-fill"></i>

                  Start Speaking

                </button>

              ) : (

                <button
                  type="button"
                  className="voice-btn listening"
                  onClick={stopListening}
                  disabled={loading}
                >

                  <i className="bi bi-stop-fill"></i>

                  Stop Speaking

                </button>

              )}

            </div>

            <div className="answer-footer">

              <span>
                {answer.length} characters
              </span>

              <button
                type="button"
                className="next-question-btn"
                onClick={handleNext}
                disabled={
                  !answer.trim() ||
                  loading
                }>

                {currentQuestion ===
                interviewQuestions.length - 1
                  ? "Finish Interview"
                  : "Next Question"}

                <i className="bi bi-arrow-right"></i>

              </button>

            </div>

          </div>

        </section>

        <div className="interview-info">

          <div className="info-icon">

            <i className="bi bi-lightbulb"></i>

          </div>

          <div>

            <strong>
              Interview tip
            </strong>

            <p>
              Speak naturally and give
              specific examples from your
              experience whenever possible.
              Your speech will automatically
              be converted into text.
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}

export default Interview;