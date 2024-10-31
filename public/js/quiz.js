window.addEventListener("DOMContentLoaded", (e) => {
 
  const answers = document.querySelectorAll(".question__answer");

  const questions = document.querySelectorAll(".question__list");

  const secondSpans = document.querySelectorAll(".second");
  const minuteSpans = document.querySelectorAll(".minute");

  showTempPopup("Quiz has started!");

  let hasQuizFinished = false;

  const setQuizResult = () => {
    fetch(`/quiz`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answers: selectedAnswers }),
    })
      .then((res) => res.json())
      .then((data) => {
        styleCorrectAnswers(data.answers);
        showTempPopup(data.message);
      })
      .catch((err) => console.log(err));
  };

  const styleCorrectAnswers = (answers) => {
    answers.forEach((answer) => {
      questions.forEach(question => {
        if (answer.id === question.dataset.id) {
          question.children[answer.correct].classList.add('correct')
          if (answer.answer !== '-1' && answer.answer !== answer.correct + '') {
            question.children[parseInt(answer.answer)].classList.add('incorrect')
          }
        }
      })
    });
  };

  const updateElByPadding = (node, value) => {
    node.forEach((el) => (el.innerText = (value + "").padStart(2, "0")));
  };

  const defaultDuration = 10;
  let second = (defaultDuration * questions.length) % 60;
  let minute = Math.floor((defaultDuration * questions.length) / 60);

  updateElByPadding(secondSpans, second);
  updateElByPadding(minuteSpans, minute);

  const intervalID = setInterval(() => {
    if (hasQuizFinished) clearInterval(intervalID);

    second--;
    if (minute === 0 && second === 10) showTempPopup("Last 10 seconds!");
    if (minute === 0 && second === 5) showTempPopup("Last 5 seconds!");
    if (second <= 0) {
      if (minute > 0) {
        second = 59;
        minute--;
      } else {
        clearInterval(intervalID);
        setQuizResult();
      }
    }
    updateElByPadding(secondSpans, second);
    updateElByPadding(minuteSpans, minute);
  }, 1000);

  const selectedAnswers = [];

  const totalAnsweredSpans = document.querySelectorAll(".total-answered");
  const totalQuestionSpans = document.querySelectorAll(".total-questions");

  updateElByPadding(totalQuestionSpans, questions.length);

  const updateQuizState = () => {
    let totalSelectedAnswers = 0;
    selectedAnswers.forEach((answer) =>
      answer.answer !== "-1" ? totalSelectedAnswers++ : null
    );
    updateElByPadding(totalAnsweredSpans, totalSelectedAnswers);

  };
  updateQuizState();

  questions.forEach((question) =>
    selectedAnswers.push({
      id: question.dataset.id,
      answer: "-1",
    })
  );

  const clearSelection = (parentEl) => {
    for (child of parentEl.children) {
      child.classList.remove("question__answered");
    }
  };

  answers.forEach((answer) =>
    answer.addEventListener("click", (e) => {

      const parentEl = e.target.parentElement;

      if (e.target.classList.contains("question__answered")) {
        e.target.classList.remove("question__answered");

        selectedAnswers.forEach((selectedAnswer) =>
          parentEl.dataset.id === selectedAnswer.id
            ? (selectedAnswer.answer = "-1")
            : null
        );

        updateQuizState();
        return null;
      }

      clearSelection(parentEl);

      e.target.classList.add("question__answered");

      const questionIndex = selectedAnswers.findIndex(
        (selectedAnswer) => selectedAnswer.id === parentEl.dataset.id
      );
      selectedAnswers[questionIndex] = {
        ...selectedAnswers[questionIndex],
        answer: e.target.dataset.choice,
      };

      updateQuizState();
    })
  );

  const btnFinish = document.querySelector(".btn-finish");
  btnFinish.addEventListener("click", (e) => {
    if (!hasQuizFinished) {
      hasQuizFinished = true;
      clearInterval(intervalID);
      setQuizResult();
    }
  });
});
