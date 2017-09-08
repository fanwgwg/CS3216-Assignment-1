import * as React from 'react';

import * as Utilities from './Utilities';

interface UserCardProps {
    user: Utilities.User;
    index: number;
    onUserCardClick: Function;
}

interface UserCardStates { }

export default class UserCard extends React.Component<UserCardProps, UserCardStates> {
    render() {
        let index: JSX.Element = null;

        switch (this.props.index) {
            case 1: {
                index = <img className={"IndexImg"} src={require("../resources/images/1.svg")} />;
                break;
            }
            case 2: {
                index = <img className={"IndexImg"} src={require("../resources/images/2.svg")} />;
                break;
            }
            case 3: {
                index = <img className={"IndexImg"} src={require("../resources/images/3.svg")} />;
                break;
            }
            default: {
                index = <div className={"IndexId"}>{this.props.index}</div>;
                break;
            }
        }

        return (
            <div className={"UserCard"} onClick={this.onUserCardClicked.bind(this)}>
                <div className={"NameCard"}>
                    {index}
                    <div className={"Detail"}>
                        <div className={"Top"}>
                            <img className={"Icon"} 
                             src={"http://graph.facebook.com/" + this.props.user.id + "/picture?type=square"}
                             onClick = {window.open.bind("http://www.facebook.com/"+this.props.user.id, "_blank")} />
                            <div className={"Name"}>{this.props.user.name}</div>
                        </div>
                        <div className={"Bottom"}>{this.props.user.desc}</div>
                    </div>
                </div>
                <div className={"MatchScore"}>{this.getMatchScoreString()}</div>
            </div>
        )
    }

    onUserCardClicked() {
        this.props.onUserCardClick(this.props.index - 1);
    }

    getMatchScoreString(): string {
        return "Match Score: " + this.props.user.matchScore + "%";
    }
}