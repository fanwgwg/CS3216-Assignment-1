import * as React from 'react';

import UserCard from './UserCard';
import UserDetails from './UserDetails';
import * as Utilities from './Utilities';

export interface MainPageProps {
    userList: Utilities.User[];
    onSwitchGroup: Function;
}

export interface MainPageStates {
    shouldUserDetailOpen: boolean;
}

export default class MainPage extends React.Component<MainPageProps, MainPageStates> {
    currentUserIndex: number = -1;

    constructor(props: MainPageProps) {
        super(props);

        this.state = {
            shouldUserDetailOpen: false
        }
    }

    render() {
        Utilities.initGA();
        Utilities.logPageView("placeholder", "/main");

        let userList: JSX.Element = null;
        let userCards: JSX.Element[] = [];
        let userDetails: JSX.Element = null;

        if (this.props.userList.length > 0) {
            let index = 0;
            userCards = this.props.userList.map(x => <UserCard key={index} user={x} index={++index} onUserCardClick={this.openUserDetails.bind(this)} />);
            userList = (
                <div className={"UserList"}>
                    {userCards}
                </div>
            );
        } else {
            userList = (
                <div className={"Message"}>You are the first one in the group on Teamker.&#10;Come back later to check your match with your groupmates! </div>
            );
        }

        if (this.state.shouldUserDetailOpen) {
            let user = this.props.userList[this.currentUserIndex];
            userDetails = <UserDetails user={user} onCloseButtonClicked={this.closeUserDetails.bind(this)} />
        }

        return (
            <div className={"MainPage"}>
                <div className={"Header"}>
                    <div>Here are our recommended match for you...</div>
                    <div className={"SwitchGroupButton"} onClick={this.props.onSwitchGroup.bind(this)}>Switch Group</div>
                </div>
                {userDetails}
                {userList}
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

        this.currentUserIndex = -1;
    }
}
