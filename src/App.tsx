/// <reference path='../node_modules/@types/facebook-js-sdk/index.d.ts'/>

import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import * as FB from 'FB';

import * as Utilities from './Utilities';

import LoginPage from './LoginPage';
import QuestionView from './QuestionView';
import MainPage from './MainPage';
import TopBar from './TopBar';

require("../resources/app.css");
// require("./fbsdk.js");

interface AppProps { };

interface AppStates {
  login: number;
  questions: Utilities.Question[];
  currentQuestionIndex: number;
  allQuestionsAnswered: boolean;
  //userId: string;
  //userName: string;
};

declare function fbCheckLoginState(): any;

class App extends React.Component<AppProps, AppStates> {

  appTitle = "Teamker";
  jsonUrls = ["questions"]; // hardcoded for now
  numberOfQuestions: number = 0;
  userId = "";
  userName = "";

  constructor(props: AppProps) {
    super(props);

    // console.log(FB);
    // login part

    // fetch data
    this.fetchData();

    this.state = {
      login: -1,
      questions: null,
      currentQuestionIndex: 0,
      allQuestionsAnswered: false,
      //userId: "",
      //userName: ""
    }
  }

  componentWillMount() {
     this.checkLoginState();
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
      FB.getLoginStatus(function (response:any) {
        console.log(response);
        if(response.status === "connected") {
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
  
  logUserIn(): void{
    FB.login(function(response: any) {
      console.log("not connected");
      if(response.status == 'connected'){
        console.log("connected");
        FB.api('/me', function (response: any) {
          this.userId = response.id;
          this.userName = response.name;
          this.setState({
            login: true
          });
          console.log('Successful login for: ' + response.name);
        }.bind(this));
      }else{
        console.log("cannot logged in");
      }
    }.bind(this), {scope: 'public_profile'}); 
  }
  logUserOut(): void{
    FB.logout(function(response:any){
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";domain=localhost;path=/");
      });
      this.userId = "";
      this.userName = "";
      this.setState({
        login: false
      });
    }.bind(this));
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
    let topBar: JSX.Element = null;
    let loginPage: JSX.Element = null;
    let questionView: JSX.Element = null;
    let mainPage: JSX.Element = null;
      console.log("start rendering");
      topBar = <TopBar 
        appTitle={this.appTitle} userId={this.userId} 
        userName={this.userName} onLogout={this.logUserOut.bind(this)} />
     
      if (this.state.login == 0){
        //this.checkLoginState();
        loginPage = <LoginPage
        onLogin={this.logUserIn.bind(this)}/>
      }
      
      if (this.state.login == 1 && !this.state.allQuestionsAnswered && this.state.questions) {
        questionView = <QuestionView
          question={this.state.questions[this.state.currentQuestionIndex]}
          index={this.state.currentQuestionIndex}
          onPreviousQuestionClicked={this.goToPreviousQuestion.bind(this)}
          onQuestionAnswered={this.goToNextQuestion.bind(this)}
        />
      }
  
      if (this.state.login == 1 && this.state.allQuestionsAnswered) {
        mainPage = <MainPage />
      }
  
    
      
      
    console.log(this.userId);
    console.log(this);
    return (
      <div className="App">
        {topBar}
        {loginPage}
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
