import * as React from 'react';

import * as Utilities from './Utilities';

interface UserDetailProps {
    user: Utilities.User;
    onCloseButtonClicked: Function;
}

interface UserDetailStates { }

export default class UserDetail extends React.Component<UserDetailProps, UserDetailStates> {

    componentWillMount() {
        let userList = document.getElementsByClassName("UserList") as HTMLCollectionOf<HTMLElement>;
        userList[0].style.pointerEvents = "none";
        document.body.style.overflow = "hidden";
    }

    componentWillUnmount() {
        document.body.style.overflow = "auto";
        let userList = document.getElementsByClassName("UserList") as HTMLCollectionOf<HTMLElement>;
        userList[0].style.pointerEvents = "auto";
    }

    render() {
        let index = 0;
        let answers = this.props.user.questionAndAnswers.map(x =>
            <div className={"QuestionAndAnswer"} key={index++}>
                <div className={"Question"}>{x.question.body}</div>
                <div className={"Answer"}>{x.answer}</div>
            </div>
        );

        return (
            <div className={"UserDetail"}>
                <div className={"Top"}>
                    <img className={"CloseButton"} src={require("../resources/images/close.svg")} onClick={this.props.onCloseButtonClicked.bind(this)} />
                </div>
                <img className={"Icon"} src={this.props.user.photoUrl} />
                <div className={"Answers"}>{answers}</div>
            </div>
        )
    }
}