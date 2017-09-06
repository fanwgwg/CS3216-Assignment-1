import * as React from 'react';

import UserDetails from "./UserDetails";
import * as Utilities from "./Utilities";

interface AdminPageProps {
    index: number;
    groupList: Utilities.Group[];
}

interface AdminPageStates {
    selectIndex: number;
    isNewGroup: boolean;
    numOfInputs: number;
    matchMostSimilar: boolean;
    shouldUserDetailsOpen: boolean;
}

export default class AdminPage extends React.Component<AdminPageProps, AdminPageStates> {
    usersOnTeamker: Utilities.User[];
    usersNotOnTeamker: Utilities.User[];
    userDetailIndex: number;

    constructor(props: AdminPageProps) {
        super(props);

        let isNewGroup = Utilities.isNewGroup(this.props.groupList[this.props.index].id);

        if (!isNewGroup) {
            let groupId = this.props.groupList[this.props.index].id;
            this.usersOnTeamker = Utilities.getGroupMembersOnTeamker(groupId);
            this.usersNotOnTeamker = Utilities.getGroupMembersNotOnTeamker(groupId);
        }

        this.state = ({
            selectIndex: this.props.index,
            isNewGroup: isNewGroup,
            numOfInputs: 3,
            matchMostSimilar: false,
            shouldUserDetailsOpen: false
        });
    }

    getMessageStyle(): string {
        if (this.state.isNewGroup) {
            return "MessageHighlight";
        } else {
            return "Message"
        }
    }

    getButtonStyle(): string {
        if (this.state.isNewGroup) {
            return "Button";
        } else {
            return "ButtonHighlight";
        }
    }

    getMessage(): string {
        if (this.state.isNewGroup) {
            return "This group is not on Teamker yet, set up by completing the form below.";
        } else {
            let numOnTeamker = this.usersOnTeamker.length;
            let numOfAllMember = this.usersNotOnTeamker.length + numOnTeamker;
            return numOnTeamker + " of " + numOfAllMember + " group members have finished the questions.";
        }
    }

    getButtonContent(): string {
        if (this.state.isNewGroup) {
            return "Confirm";
        } else {
            return "Delete this group from Teamker";
        }
    }

    getButtonMessage(): string {
        if (this.state.isNewGroup) {
            return "Once questions set up, you cannnot modify then anymore.";
        } else {
            return "All user data will be deleted from Teamker.";
        }
    }

    onAddButtonClicked(): void {
        this.setState({
            numOfInputs: this.state.numOfInputs + 1
        });
    }

    onDeleteButtonClicked(): void {
        this.setState({
            numOfInputs: this.state.numOfInputs - 1
        });
    }

    onSwitchButtonClicked(): void {
        this.setState({
            matchMostSimilar: !this.state.matchMostSimilar
        });
    }

    onGroupListClicked(index: number): void {
        let isNewGroup = Utilities.isNewGroup(this.props.groupList[index].id);

        if (isNewGroup) {
            this.usersOnTeamker = [];
            this.usersNotOnTeamker = [];
        } else {
            let groupId = this.props.groupList[this.state.selectIndex].id;
            this.usersOnTeamker = Utilities.getGroupMembersOnTeamker(groupId);
            this.usersNotOnTeamker = Utilities.getGroupMembersNotOnTeamker(groupId);
        }

        this.setState({
            isNewGroup: isNewGroup,
            selectIndex: index
        })
    }

    onUserListClicked(userDetailIndex: number): void {
        this.userDetailIndex = userDetailIndex;
        this.setState({
            shouldUserDetailsOpen: true
        });
    }

    closeUserDetails(): void {
        this.setState({
            shouldUserDetailsOpen: false
        });

        this.userDetailIndex = -1;
    }

    render() {
        let mainContent: JSX.Element = null;
        let groupList: JSX.Element[] = [];
        let inputs: JSX.Element[] = [];
        let userDetails: JSX.Element = null;

        if (this.state.shouldUserDetailsOpen) {
            let user = this.usersOnTeamker[this.userDetailIndex];
            userDetails = <UserDetails user={user} onCloseButtonClicked={this.closeUserDetails.bind(this)} />
        }

        for (let i = 0; i < this.props.groupList.length; i++) {
            let groupStyle = (i == this.state.selectIndex) ? "GroupSelected" : "Group";
            groupList.push(
                <div className={groupStyle} key={i} onClick={this.onGroupListClicked.bind(this, i)}>{this.props.groupList[i].name}</div>
            );
        }

        if (this.state.isNewGroup) {
            for (let i = 0; i < this.state.numOfInputs; i++) {
                let addButton: JSX.Element = null;
                let deleteButton: JSX.Element = null;

                if (i == this.state.numOfInputs - 1) {
                    if (i < 19) {
                        addButton = (<div className={"AddButton"} onClick={this.onAddButtonClicked.bind(this)}>+</div>);
                    }

                    if (this.state.numOfInputs > 3) {
                        deleteButton = (<div className={"DeleteButton"} onClick={this.onDeleteButtonClicked.bind(this)}>-</div>);
                    }
                }

                inputs.push(
                    <form key={i}>
                        <div className={"Index"}>{i + 1}</div>
                        <input type="text" />
                        {addButton}
                        {deleteButton}
                    </form>
                );
            }

            mainContent = (
                <div className={"MainContent"}>
                    <div className={"PartA"}>
                        <div className={"Title"}>Set up question attributes</div>
                        <div className={"Explaination"}>You can set 3-20 question attributes here. Each question will be in the format “How much do you know about … ?”, and answer will be scores from 1 to 10.</div>
                        <div className={"AttributesInputs"}>{inputs}</div>
                    </div>
                    <div className={"PartB"}>
                        <div className={"Title"}>Set up matching options</div>
                        <div className={"MatchOption"}>
                            <div className={"MatchContent"}>Match members if they are</div>
                            <div className={"SwitchButton"} onClick={this.onSwitchButtonClicked.bind(this)}>
                                <div className={this.state.matchMostSimilar ? "OptionSelected" : "Option"}>most similar</div>
                                <div className={this.state.matchMostSimilar ? "Option" : "OptionSelected"}>most different</div>
                            </div>
                        </div>

                    </div>
                </div>
            );
        } else {
            let userListA: JSX.Element[] = [];
            let userListB: JSX.Element[] = [];
            let i = 0;

            userListA = this.usersOnTeamker.map(user => {
                return (
                    <div className={"User"} key={i} onClick={this.onUserListClicked.bind(this, i++)}>
                        <img className={"Photo"} src={require("../resources/images/user.svg")} />
                        <div className={"Name"}>{user.name}</div>
                    </div>
                );
            });

            i = 0;
            userListB = this.usersNotOnTeamker.map(user => {
                return (
                    <div className={"User"} key={i++}>
                        <img className={"Photo"} src={require("../resources/images/user.svg")} />
                        <div className={"Name"}>{user.name}</div>
                    </div>
                );
            });

            mainContent = (
                <div className={"MainContent"}>
                    <div className={"PartA"}>
                        <div className={"Title"}>They have answered questions</div>
                        <div className={"UserList"}>{userListA}</div>
                    </div>
                    <div className={"PartB"}>
                        <div className={"Title"}>They haven't answered questions</div>
                        <div className={"UserList"}>{userListB}</div>
                    </div>
                </div>
            );
        }

        return (
            <div className={"AdminPage"}>
                <div className={"Header"}>Hi Colin, welcome to the admin page.</div>
                {userDetails}
                <div className={"Main"}>
                    <div className={"Left"}>
                        <div className={"GroupPanel"}>
                            <div className={"LeftTitle"}>My Groups</div>
                            <div className={"GroupList"}>{groupList}</div>
                        </div>
                    </div>
                    <div className={"Right"}>
                        <div className={"Body"}>
                            <div className={this.getMessageStyle()}>{this.getMessage()}</div>
                            {mainContent}
                            <div className={"BottomButton"}>
                                <div className={this.getButtonStyle()}>{this.getButtonContent()}</div>
                                <div className={"ButtonMessage"}>{this.getButtonMessage()}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}