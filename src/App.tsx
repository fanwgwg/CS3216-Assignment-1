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
require("./fbsdk.js");

interface AppProps { };

interface AppStates {
  login: boolean;
  questions: Utilities.Question[];
  currentQuestionIndex: number;
  allQuestionsAnswered: boolean;
  userId: string;
  userName: string;
};

declare function fbCheckLoginState(): any;

class App extends React.Component<AppProps, AppStates> {

  appTitle = "Teamker";
  jsonUrls = ["questions"]; // hardcoded for now
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
      currentQuestionIndex: 0,
      allQuestionsAnswered: false,
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
      FB.getLoginStatus(function (response:any) {
        if(response.status === "connected") {
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
          FB.login(function(response: any) {
            // handle the response
            if(response.status == 'connected'){
              FB.api('/me', function (response: any) {
                this.setState({
                  login: true,
                  userId: response.id,
                  userName: response.name
                });
                console.log('Successful login for: ' + response.name);
              }.bind(this));
            }else{
              console.log("not logged in");
            }
          }.bind(this), {scope: 'public_profile'}); 
        }
      }.bind(this));
      
  }

  logUserOut(): void{
    FB.logout(function(response:any){
      this.setState({
        login: false,
        userId: "",
        userName: ""
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
      
      topBar = <TopBar 
        appTitle={this.appTitle} userId={this.state.userId} 
        userName={this.state.userName} onLogout={this.logUserOut.bind(this)} />
        
      if (!this.state.login){
        loginPage = <LoginPage
        onLogin={this.checkLoginState.bind(this)}/>
      }
      
      if (this.state.login && !this.state.allQuestionsAnswered && this.state.questions) {
        questionView = <QuestionView
          question={this.state.questions[this.state.currentQuestionIndex]}
          index={this.state.currentQuestionIndex}
          onPreviousQuestionClicked={this.goToPreviousQuestion.bind(this)}
          onQuestionAnswered={this.goToNextQuestion.bind(this)}
        />
      }
  
      if (this.state.login && this.state.allQuestionsAnswered) {
        mainPage = <MainPage />
      }
  
    
    console.log(this.state.userId);
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
