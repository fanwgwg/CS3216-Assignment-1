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
                answer: Math.floor(Math.random() * 9 + 1)
            }
        })

        let users = ["Li Zihan", "Ho Yi Hang", "Goh Wei Wen", "Chan Khan", "Stefano Chiesa Suryanto",
            "Lau Shi Jie", "Yip Mun Kit Bernard", "Tan Zheng Wei", "Tan Kai Meng Wilson", "Jeremy Jee De Sheng",
            "Ng Jun Wei", "Chan Jin Jia", "Chua Lin Jing", "Apoorva Ullas", "Charlton Lim", "WANG RIWU",
            "Lim Jia Yee", "Lim Ta Eu", "Aaron Ong Chong Shi", "Danielle Chan Xin Yun", "Maximilianus Kusnadi",
            "Oh Han Gyeol", "WON JUN RU DAPHNE", "Kushagra Goyal", "Curtis Tan Wei Jie", "See Soon Kiat", "See Loo Jane",
            "Alan Lee Yung Chong", "Fan Weiguang", "Bai Chuan", "Chng Hui Yie", "Ong Jing Yin", "Ng Si Kai",
            "Liew Yu Young Jovin", "Aaron Ong Chong Shi"];

        this.userList = users.map(name => {
            return {
                name: name,
                desc: "This is a description about myself",
                matchScore: Math.floor(Math.random() * 99 + 1),
                photoUrl: require("../resources/images/user.svg"),
                questionAndAnswers: questionAndAnswers
            };
        });

        this.userList.sort((a, b) => {
            return a.matchScore < b.matchScore ? 1 : -1;
        })
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
