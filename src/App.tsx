import * as React from 'react';
import * as ReactDOM from 'react-dom';

import * as Utilities from './Utilities';

import QuestionView from './QuestionView';
import MainPage from './MainPage';
import TopBar from './TopBar';

require("../resources/app.css");

interface AppProps { };

interface AppStates {
  questions: Utilities.Question[];
  currentQuestionIndex: number;
  allQuestionsAnswered: boolean;
};

class App extends React.Component<AppProps, AppStates> {

  appTitle = "Team Builder";
  jsonUrls = ["questions"]; // hardcoded for now
  numberOfQuestions: number = 0;

  constructor(props: AppProps) {
    super(props);

    // login part

    // fetch data
    this.fetchData();

    this.state = {
      questions: null,
      currentQuestionIndex: 0,
      allQuestionsAnswered: false
    }
  }

  fetchData() {
    console.log("start fetching data");

    let downloader = Utilities.creteJsonDownloader(this.jsonUrls,
      () => {
        let downloadedObjects = downloader.getDownloadedJsonObjects();
        let questions = downloadedObjects["questions"].questions;

        if (!questions) {
          return; // Not fully downloaded yet
        }

        this.numberOfQuestions = questions.length;

        this.setState({
          questions: questions
        });
      }
    );
  }

  goToPreviousQuestion(): void {
    let newQuestionIndex = this.state.currentQuestionIndex - 1;
    this.setState({
      currentQuestionIndex: newQuestionIndex
    });
  }

  goToNextQuestion(): void {
    let newQuestionIndex = this.state.currentQuestionIndex + 1;

    if (newQuestionIndex >= this.numberOfQuestions) {
      this.setState({
        allQuestionsAnswered: true
      });
    } else {
      this.setState({
        currentQuestionIndex: newQuestionIndex
      });
    }
  }

  render() {
    let questionView: JSX.Element = null;
    let mainPage: JSX.Element = null;

    if (!this.state.allQuestionsAnswered && this.state.questions) {
      questionView = <QuestionView
        question={this.state.questions[this.state.currentQuestionIndex]}
        index={this.state.currentQuestionIndex}
        onPreviousQuestionClicked={this.goToPreviousQuestion.bind(this)}
        onQuestionAnswered={this.goToNextQuestion.bind(this)}
      />
    }

    if (this.state.allQuestionsAnswered) {
      mainPage = <MainPage />
    }

    return (
      <div className="App">
        <TopBar appTitle={this.appTitle} />
        {questionView}
        {mainPage}
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
