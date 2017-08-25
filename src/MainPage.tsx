import * as React from 'react';

import UserCard from './UserCard';
import UserDetails from './UserDetails';
import * as Utilities from './Utilities';

export interface MainPageProps { }

export interface MainPageStates {
    shouldUserDetailOpen: boolean;
}

export default class MainPage extends React.Component<MainPageProps, MainPageStates> {
    userList: Utilities.User[] = [];
    currentUserIndex: number = 0;

    constructor(props: MainPageProps) {
        super(props);

        this.setUserList();

        this.state = {
            shouldUserDetailOpen: false
        }
    }

    setUserList(): void {
        let questions: Utilities.Question[] = [
            {
                "body": "How much do you know about Photoshop and design?"
            },
            {
                "body": "How much do you know about Html and CSS?"
            },
            {
                "body": "How much do you know about Javascript?"
            },
            {
                "body": "How much do you know about server side languages?"
            },
            {
                "body": "How much do you know about database?"
            }
        ];

        let questionAndAnswers: Utilities.QuestionAndAnswer[] = questions.map(x => {
            return {
                question: x,
                answer: 5
            }
        })

        for (let i = 0; i < 50; i++) {
            let user = {
                name: "Jim Bob " + i,
                desc: "This is a description about myself",
                matchScore: 100 - i,
                photoUrl: require("../resources/icons/user.svg"),
                questionAndAnswers: questionAndAnswers
            };

            this.userList.push(user);
        }
    }

    render() {
        let userCards: JSX.Element[] = [];
        let userDetails: JSX.Element = null;

        let index = 0;
        userCards = this.userList.map(x => <UserCard key={index} user={x} index={++index} onUserCardClick={this.openUserDetails.bind(this)} />);

        if (this.state.shouldUserDetailOpen) {
            let user = this.userList[this.currentUserIndex];
            userDetails = <UserDetails user={user} onCloseButtonClicked={this.closeUserDetails.bind(this)} />
        }

        return (
            <div className={"MainPage"}>
                <div className={"Header"}>
                    Here are our recommended match for you...
                </div>
                {userDetails}
                <div className={"UserList"}>
                    {userCards}
                </div>
            </div>
        )
    };

    openUserDetails(index: number): void {
        this.setState({
            shouldUserDetailOpen: true
        })

        this.currentUserIndex = index;
    }

    closeUserDetails(): void {
        this.setState({
            shouldUserDetailOpen: false
        })

        this.currentUserIndex = 0;
    }
}
