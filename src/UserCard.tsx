import * as React from 'react';

import * as Utilities from './Utilities';

interface UserCardProps {
    user: Utilities.User;
    index: number;
}

interface UserCardStates {

}

export default class UserCard extends React.Component<UserCardProps, UserCardStates> {
    render() {
        let index: JSX.Element = null;

        switch (this.props.index) {
            case 1: {
                index = <img className={"IndexImg"} src={require("../resources/icons/1.svg")} />;
                break;
            }
            case 2: {
                index = <img className={"IndexImg"} src={require("../resources/icons/2.svg")} />;
                break;
            }
            case 3: {
                index = <img className={"IndexImg"} src={require("../resources/icons/3.svg")} />;
                break;
            }
            default: {
                index = <div className={"IndexId"}>{this.props.index}</div>;
                break;
            }
        }

        return (
            <div className={"UserCard"} >
                <div className={"NameCard"}>
                    {index}
                    <div className={"Detail"}>
                        <div className={"Top"}>
                            <img className={"Icon"} src={require("../resources/icons/user.png")} />
                            <div className={"Name"}>{this.props.user.name}</div>
                        </div>
                        <div className={"Bottom"}>{this.props.user.desc}</div>
                    </div>
                </div>
                <div className={"MatchScore"}>{this.getMatchScoreString()}</div>
            </div>
        )
    }

    getMatchScoreString(): string {
        return "Match Score: " + this.props.user.matchScore + "%";
    }
}