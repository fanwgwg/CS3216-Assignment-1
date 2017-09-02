/// <reference path='../node_modules/@types/facebook-js-sdk/index.d.ts'/>

import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import * as FB from 'FB';

import * as Utilities from './Utilities';

import LoginPage from './LoginPage';
import QuestionView from './QuestionView';
import LoaderPage from './LoaderPage';
import MainPage from './MainPage';
import TopBar from './TopBar';

require("../resources/app.css");
require("./fbsdk.js");

interface AppProps { };

interface AppStates {
  login: boolean;
  questions: Utilities.Question[];
  allQuestionsAnswered: boolean;
  unfinishedQuestionIndex: number;
  isWaitingForUserList: boolean;
  userId: string;
  userName: string;
};

declare function fbCheckLoginState(): any;

class App extends React.Component<AppProps, AppStates> {

  appTitle = "Teamker";
  jsonUrls = ["questions"]; // hardcoded for now
  userScores: number[] = [];
  userDesc: string = "";
  numberOfQuestions: number = 0;

  constructor(props: AppProps) {
    super(props);

    // console.log(FB);
    // login part

    // fetch data
    this.fetchData();

    this.state = {
      login: false,
      questions: null,
      allQuestionsAnswered: false,
      unfinishedQuestionIndex: -1,
      isWaitingForUserList: false,
      userId: "",
      userName: ""
    }
  }

  componentDidMount() {
    //  this.checkLoginState();
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

  checkLoginState(): void {
    // console.log(fbsdk);
    // console.log(fbsdk.checkLoginState);
    console.log("check");
    // console.log(FB.getLoginStatus);
    FB.getLoginStatus(function (response: any) {
      if (response.status === "connected") {
        console.log("logged in");
        FB.api('/me', function (response: any) {
          this.setState({
            login: true,
            userId: response.id,
            userName: response.name
          });

          console.log('Successful login for: ' + response.name);
        }.bind(this));

        //persist to database

      } else {
        FB.login(function (response: any) {
          // handle the response
          if (response.status == 'connected') {
            FB.api('/me', function (response: any) {
              this.setState({
                login: true,
                userId: response.id,
                userName: response.name
              });
              console.log('Successful login for: ' + response.name);
            }.bind(this));
          } else {
            console.log("not logged in");
          }
        }.bind(this), { scope: 'public_profile' });
      }
    }.bind(this));
  }

  logUserOut(): void {
    FB.logout(function (response: any) {
      this.setState({
        login: false,
        userId: "",
        userName: ""
      });
    }.bind(this));
  }

  updateScores(index: number, score: number): void {
    this.userScores[index] = score;
  }

  updateDesc(description: string): void {
    this.userDesc = description;
  }

  onFinishButtonClicked(): void {
    let allQuestionsAnswered = true;
    for (let i = 0; i < this.numberOfQuestions; i++) {
      if (this.userScores[i] == null) {
        allQuestionsAnswered = false;

        this.setState({
          unfinishedQuestionIndex: i
        });

        break;
      }
    }

    if (allQuestionsAnswered && this.userDesc.length == 0) {
      allQuestionsAnswered = false;

      this.setState({
        unfinishedQuestionIndex: this.numberOfQuestions
      });
    }

    if (allQuestionsAnswered) {
      this.submitData();

      this.setState({
        allQuestionsAnswered: true,
        unfinishedQuestionIndex: -1,
        isWaitingForUserList: true
      });

      ReactDOM.findDOMNode(this).scrollIntoView();
      window.scrollBy(0, -60);
    }
  }

  submitData(): void {
    let data = {
      "page_id": 0,
      "user_id": this.state.userId,
      "user_name": this.state.userName,
      "user_desc": "",
      "responses": this.userScores
    }

    fetch("/user", {
      method: "POST",
      body: data
    }).then(function (res: any) {
      return res.json();
    }.bind(this)).then(function (data: any) {
      alert(JSON.stringify(data)); 
      
      // should receive a list of all the users here
      // and then update the state to show the main page
      
      /* this.setState({
        isWaitingForUserList: false
      }) */

    }.bind(this));

    // user setTimeOut for now
    setTimeout(function () {
      this.setState({
        isWaitingForUserList: false
      })
    }.bind(this), 2000);
  }

  render() {
    let topBar: JSX.Element = null;
    let loginPage: JSX.Element = null;
    let mainPage: JSX.Element = null;
    let questions: JSX.Element[] = [];
    let questionPage: JSX.Element = null;
    let loaderPage: JSX.Element = null;

    topBar = <TopBar
      appTitle={this.appTitle} userId={this.state.userId}
      userName={this.state.userName} onLogout={this.logUserOut.bind(this)} />

    if (!this.state.login){
      loginPage = <LoginPage
      onLogin={this.checkLoginState.bind(this)}/>
    }

    if (this.state.login && !this.state.allQuestionsAnswered && this.state.questions) {
      let index = 0;
      questions = this.state.questions.map(q => <QuestionView
        key={index}
        question={this.state.questions[index]}
        isUnfinished={index == this.state.unfinishedQuestionIndex}
        onQuestionAnswered={this.updateScores.bind(this)}
        onDescriptionUpdated={this.updateDesc.bind(this)}
        isDescriptionQuestion={false}
        index={index++}
      />);

      questions.push(<QuestionView
        key={index}
        question={null}
        isUnfinished={index == this.state.unfinishedQuestionIndex}
        onQuestionAnswered={this.updateScores.bind(this)}
        onDescriptionUpdated={this.updateDesc.bind(this)}
        isDescriptionQuestion={true}
        index={index} />
      );

      questionPage = (
        <div className={"QuestionPage"}>
          {questions}
          <div className={"FinishButton"} onClick={this.onFinishButtonClicked.bind(this)}>Finish</div>
        </div>
      );
    }

    if (this.state.allQuestionsAnswered && this.state.isWaitingForUserList) {
      loaderPage = <LoaderPage />
    }

    if (this.state.login && this.state.allQuestionsAnswered && !this.state.isWaitingForUserList) {
      mainPage = <MainPage />
    }

    return (
      <div className="App">
        {topBar}
        <div className="AppContainer">
          {loginPage}
          {loaderPage}
          {questionPage}
          {mainPage}
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
