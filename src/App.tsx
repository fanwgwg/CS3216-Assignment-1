/// <reference path='../resources/facebook-js-sdk/index.d.ts'/>

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import * as Utilities from './Utilities';

import LoginPage from './LoginPage';
import EntryPage from './EntryPage';
import QuestionView from './QuestionView';
import LoaderPage from './LoaderPage';
import MainPage from './MainPage';
import AdminPage from './AdminPage';
import TopBar from './TopBar';

require("../resources/app.css");

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
  domain = "teamker.tk";
  // domain = "localhost";
  jsonUrls = ["api/questions"]; // hardcoded for now
  userScores: number[] = [];
  userDesc: string = "";
  numberOfQuestions: number = 0;
  userId: string = "";
  userName: string = "";
  groupId: string = "";
  user: Utilities.User = new Utilities.User();
  userList: Utilities.User[] = [];
  groupList: Utilities.Group[] = [];
  groupListInvolved: Utilities.Group[] = [];
  fetchGroupListStatus: number = -1; // -1 for haven't fetched yet, 0 for fetching, 1 for fetched

  constructor(props: AppProps) {
    super(props);

    // console.log(FB);
    // login part

    // let cookie = document.cookie.split(";");
    // let entryType = "None";
    // cookie.forEach(c => {
    //   let name = c.split('=')[0];
    //   if (name === "entryType") {
    //     let value = <EntryType>(c.split('=')[1]);
    //     entryType = value;
    //   }
    // });

    this.state = {
      login: -1,
      questions: null,
      allQuestionsAnswered: false, // set to true to display adminPage for debugging use
      unfinishedQuestionIndex: -1,
      isWaitingForUserList: false,
      entryType: "None"
    }
  }

  componentWillMount() {
    this.checkLoginState();
  }

  fetchQuestions() {
    console.log("start fetching questions");

    Utilities.getQuestions(this.groupId).then(function (questions: any) {
      console.log("questions: " + questions);
      this.setState({
        questions: questions
      });
    }.bind(this));
  }

  fetchGroupList() {
    this.fetchGroupListStatus = 0;
    Promise.all([Utilities.getGroupListInvloved(this.user.id), Utilities.getGroupList(this.user.id)])
      .then(function (data: any) {
        this.groupListInvolved = data[0];
        this.groupList = data[1];
        this.fetchGroupListStatus = 1;
        this.forceUpdate();
      }.bind(this));
  }

  checkLoginState(): void {
    // console.log(fbsdk);
    // console.log(fbsdk.checkLoginState);
    //console.log("check");
    // console.log(FB.getLoginStatus);
    FB.getLoginStatus(function (response: any) {
      console.log(response);
      if (response.status === "connected") {
        //console.log("logged in");
        FB.api('/me', function (response: any) {
          this.user.id = response.id;
          this.user.name = response.name;
          // this.userId = response.id;
          // this.userName = response.name;
          this.setState({
            login: 1
          });

          console.log('Successful login for: ' + response.name);
        }.bind(this));


        //persist to database

      } else {
        this.setState({
          login: 0
        });
      }
    }.bind(this), true);
  }

  logUserIn(): void {
    FB.login(function (response: any) {
      if (response.status == 'connected') {
        FB.api('/me', function (response: any) {
          this.user.id = response.id;
          this.user.name = response.name;
          this.setState({
            login: true
          });
          console.log('Successful login for: ' + response.name);
        }.bind(this));
      } else {
        console.log("cannot logged in");
      }
    }.bind(this), { scope: 'public_profile,user_managed_groups' });
  }

  logUserOut(): void {
    FB.logout(function (response: any) {
      document.cookie.split(";").forEach(function (c: any) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";domain=" + this.domain + ";path=/");
      }.bind(this));

      this.user = new Utilities.User();
      this.userList = [];
      this.groupList = [];

      document.cookie = "entryType=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";

      this.setState({
        login: 0,
        entryType: "None",
        questions: null,
        unfinishedQuestionIndex: -1,
        allQuestionsAnswered: false,
        isWaitingForUserList: false
      });
    }.bind(this));
  }

  onGroupEntrySelected(entry: EntryType, groupId: string): void {
    this.groupId = groupId;

    document.cookie = "entryType=" + entry;

    this.setState({
      entryType: entry
    });
  }

  updateScores(index: number, score: number): void {
    this.userScores[index] = score;
  }

  updateDesc(description: string): void {
    this.userDesc = description;
  }

  onSwitchGroupClicked(): void {
    this.fetchGroupListStatus = -1;
    this.groupList = [];
    this.groupListInvolved = [];
    this.setState({
      entryType: "None",
      questions: null,
      allQuestionsAnswered: false,
      unfinishedQuestionIndex: -1
    });
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

    if (allQuestionsAnswered && this.userDesc.length > 0) {
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
      "page_id": this.groupId,
      "user_id": this.user.id,
      "user_name": this.user.name,
      "user_desc": this.userDesc,
      "responses": this.userScores
    };

    // let data = {
    //   "page_id": 'page_id',
    //   "user_id": 'non-registered-1',
    //   "user_name": 'temp_name',
    //   "user_desc": "temp_desc",
    //   "responses": [1, 2, 3, 4, 5]
    // }

    console.log(JSON.stringify(data));

    fetch("http://teamker.tk/api/response", {
      method: "POST",
      mode: "cors",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(function (res: any) {
      if (res.ok) {
        console.log("response received: " + res);
        return res.text();
      } else {
        console.log("Unable to get user list");
      }
    }).then(function (data: any) {
      let jsonData = JSON.parse(data);
      console.log("userlist received: " + JSON.stringify(jsonData.users));
      let users = jsonData.users;

      this.userList = users.map(function (user: any) {
        let q: Utilities.QuestionAndAnswer[] = [];

        for (let i = 0; i < this.state.questions.length; i++) {
          q.push({
            question: this.state.questions[i],
            answer: user.attributes[i]
          });
        }

        return {
          name: user.name,
          id: user.id,
          desc: user.desc,
          matchScore: user.matchScore,
          questionAndAnswers: q
        };
      })

      console.log(this.userList);

      this.setState({
        isWaitingForUserList: false
      });
    }.bind(this)).catch(function (e) {
      console.log("error: unable to get user list");
    });
  }

  render() {
    let topBar: JSX.Element = null;
    let loginPage: JSX.Element = null;
    let entryPage: JSX.Element = null;
    let mainPage: JSX.Element = null;
    let adminPage: JSX.Element = null;
    let questions: JSX.Element[] = [];
    let questionPage: JSX.Element = null;
    let loaderPage: JSX.Element = null;

    topBar = <TopBar
      appTitle={this.appTitle}
      userId={this.user.id}
      userName={this.user.name}
      onLogout={this.logUserOut.bind(this)}
    />;

    if (this.state.login === 0) {
      //this.checkLoginState();
      loginPage = <LoginPage onLogin={this.logUserIn.bind(this)} />;
    } else if (this.state.entryType === "User" && !this.state.allQuestionsAnswered && !this.state.questions) {
      this.fetchQuestions();
      loaderPage = <LoaderPage message={"Please wait for a moment..."} color={"white"} containerStyle={{ height: "100vh" }} />
    }

    if (this.state.login == 1 && this.state.entryType === "None") {
      if (this.fetchGroupListStatus < 0 && this.groupList.length == 0) {
        console.log("fetch in none");
        this.fetchGroupList();
      }

      entryPage = <EntryPage
        involvedList={this.groupListInvolved}
        adminList={this.groupList}
        isLoading={this.fetchGroupListStatus <= 0}
        onGroupEntrySelected={this.onGroupEntrySelected.bind(this)}
      />;
    }

    if (this.state.login == 1 && this.state.entryType === "Admin") {
      if (this.fetchGroupListStatus < 0 && this.groupList.length == 0) {
        console.log("fetch in admin");
        this.fetchGroupList();
      } else {
        adminPage = <AdminPage user={this.user} index={0} groupList={this.groupList}
          onSwitchGroup={this.onSwitchGroupClicked.bind(this)} />;
      }
    }

    if (this.state.entryType === "User" && this.state.login == 1 && !this.state.allQuestionsAnswered && this.state.questions) {
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
          <div className={"SwitchGroupButton"} onClick={this.onSwitchGroupClicked.bind(this)}>Switch Group</div>
          {questions}
          <div className={"FinishButton"} onClick={this.onFinishButtonClicked.bind(this)}>Finish</div>
        </div>
      );
    }

    if (this.state.entryType === "User" && this.state.login == 1 && this.state.allQuestionsAnswered && this.state.isWaitingForUserList) {
      loaderPage = <LoaderPage message={"We are finding your best match now..."} color={"white"} containerStyle={{ height: "100vh" }} />
    }

    if (this.state.entryType === "User" && this.state.login == 1 && this.state.allQuestionsAnswered && !this.state.isWaitingForUserList) {
      mainPage = <MainPage userList={this.userList} onSwitchGroup={this.onSwitchGroupClicked.bind(this)} />;
    }

    return (
      <div className="App">
        {topBar}
        <div className="AppContainer">
          {loginPage}
          {entryPage}
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
