/// <reference path='../node_modules/@types/facebook-js-sdk/index.d.ts'/>

import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import * as FB from 'FB';

import * as Utilities from './Utilities';

import LoginPage from './LoginPage';
import QuestionView from './QuestionView';
import LoaderPage from './LoaderPage';
import MainPage from './MainPage';
import AdminPage from './AdminPage';
import TopBar from './TopBar';

require("../resources/app.css");
// require("./fbsdk.js");

type EntryType = "User" | "Admin" | "None";

interface AppProps { };

interface AppStates {
  login: number;
  questions: Utilities.Question[];
  allQuestionsAnswered: boolean;
  unfinishedQuestionIndex: number;
  isWaitingForUserList: boolean;
  entryType: EntryType;
};

declare function fbCheckLoginState(): any;

class App extends React.Component<AppProps, AppStates> {

  appTitle = "Teamker";
  jsonUrls = ["api/questions"]; // hardcoded for now
  userScores: number[] = [];
  userDesc: string = "";
  numberOfQuestions: number = 0;
  userId: string = "";
  userName: string = "";
  userList: Utilities.User[] = [];
  groupList: Utilities.Group[] = [];

  constructor(props: AppProps) {
    super(props);

    // console.log(FB);
    // login part

    this.state = {
      login: -1,
      questions: null,
      allQuestionsAnswered: false, // set to true to display adminPage for debugging use
      unfinishedQuestionIndex: -1,
      isWaitingForUserList: false,
      entryType: "User"
    }
  }

  componentWillMount() {
    this.checkLoginState();
  }

  fetchQuestions() {
    console.log("start fetching data");

    let downloader = Utilities.creteJsonDownloader(this.jsonUrls,
      () => {
        let downloadedObjects = downloader.getDownloadedJsonObjects();

        let questions = downloadedObjects["api/questions"].questions;

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

  fetchGroupList() {
    Utilities.getGroupList("")
      .then(function (data: any) {
        this.groupList = data;
        this.forceUpdate();
      }.bind(this));
  }

  checkLoginState(): void {
    // console.log(fbsdk);
    // console.log(fbsdk.checkLoginState);
    console.log("check");
    // console.log(FB.getLoginStatus);
    FB.getLoginStatus(function (response: any) {
      console.log(response);
      if (response.status === "connected") {
        console.log("logged in");
        FB.api('/me', function (response: any) {
          this.userId = response.id;
          this.userName = response.name;
          this.setState({
            login: 1
          });

          console.log('Successful login for: ' + response.name);
        }.bind(this));


        //persist to database

      } else {
        console.log("initially not connect..wtf???")
        this.setState({
          login: 0
        });
      }
    }.bind(this), true);

  }

  logUserIn(): void {
    FB.login(function (response: any) {
      console.log("not connected");
      if (response.status == 'connected') {
        console.log("connected");
        FB.api('/me', function (response: any) {
          this.userId = response.id;
          this.userName = response.name;
          this.setState({
            login: true
          });
          console.log('Successful login for: ' + response.name);
        }.bind(this));
      } else {
        console.log("cannot logged in");
      }
    }.bind(this), { scope: 'public_profile' });
  }

  logUserOut(): void {
    FB.logout(function (response: any) {
      document.cookie.split(";").forEach(function (c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";domain=teamker.tk;path=/");
        // document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";domain=localhost;path=/");
      });

      this.userId = "";
      this.userName = "";
      this.userList = [];
      this.groupList = [];

      this.setState({
        login: 0,
        questions: null,
        unfinishedQuestionIndex: -1,
        allQuestionsAnswered: false,
        isWaitingForUserList: false
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
      "user_id": this.userId,
      "user_name": this.userName,
      "user_desc": "",
      "responses": this.userScores
    }

    fetch("/api/response", {
      method: "POST",
      body: data
    }).then(function (res: any) {
      if (res.ok) {
        Utilities.getUserList(this.userId)
          .then(function (data: any) {
            console.log("userlist received: " + data);
            this.userList = data;
            this.setState({
              isWaitingForUserList: false
            });
          }.bind(this));
      } else {
        console.log("Unable to get user list");
      }
    }.bind(this));
  }

  render() {
    let topBar: JSX.Element = null;
    let loginPage: JSX.Element = null;
    let mainPage: JSX.Element = null;
    let adminPage: JSX.Element = null;
    let questions: JSX.Element[] = [];
    let questionPage: JSX.Element = null;
    let loaderPage: JSX.Element = null;

    topBar = <TopBar
      appTitle={this.appTitle}
      userId={this.userId}
      userName={this.userName}
      onLogout={this.logUserOut.bind(this)}
    />

    if (this.state.login === 0) {
      //this.checkLoginState();
      loginPage = <LoginPage onLogin={this.logUserIn.bind(this)} />;
    } else if (!this.state.questions) {
      this.fetchQuestions();
    }

    if (this.state.login == 1 && this.state.entryType === "Admin") {
      if (this.groupList.length == 0) {
        this.fetchGroupList();
      } else {
        adminPage = <AdminPage index={0} groupList={this.groupList} />;
      }
    }

    if (!(this.state.entryType === "Admin") && this.state.login == 1 && !this.state.allQuestionsAnswered && this.state.questions) {
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

    if (this.state.entryType !== "Admin" && this.state.login == 1 && this.state.allQuestionsAnswered && this.state.isWaitingForUserList) {
      loaderPage = <LoaderPage message={"We are finding your best match now..."} color={"white"} containerStyle={{ height: "100vh" }} />
    }

    if (this.state.entryType !== "Admin" && this.state.login == 1 && this.state.allQuestionsAnswered && !this.state.isWaitingForUserList) {
      mainPage = <MainPage userList={this.userList} />;
    }

    return (
      <div className="App">
        {topBar}
        <div className="AppContainer">
          {loginPage}
          {loaderPage}
          {questionPage}
          {adminPage}
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
