import * as React from 'react';

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
}

export default class AdminPage extends React.Component<AdminPageProps, AdminPageStates> {

    constructor(props: AdminPageProps) {
        super(props);

        let isNewGroup = Utilities.isNewGroup(this.props.groupList[this.props.index].id);

        this.state = ({
            selectIndex: this.props.index,
            isNewGroup: isNewGroup,
            numOfInputs: 3,
            matchMostSimilar: false
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
            let numOnTeamker = Utilities.getNumOfGroupMemberOnTeamker(this.props.groupList[this.state.selectIndex].id);
            let numOfMember = Utilities.getNumOfGroupMember(this.props.groupList[this.state.selectIndex].id);
            return numOnTeamker + " of " + numOfMember + " group members have finished the questions.";
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
        this.setState({
            isNewGroup: isNewGroup,
            selectIndex: index
        })
    }

    render() {
        let mainContent: JSX.Element = null;
        let groupList: JSX.Element[] = [];
        let inputs: JSX.Element[] = [];

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
            mainContent = null;
        }

        return (
            <div className={"AdminPage"}>
                <div className={"Header"}>Hi Colin, welcome to the admin page.</div>
                <div className={"Main"}>
                    <div className={"Left"}>
                        <div className={"GroupPanel"}>
                            <div className={"LeftTitle"}>My Groups</div>
                            <div className={"GroupList"}>{groupList}</div>
                        </div>
                    </div>
                    <div className={"Right"}>
                        <div className={this.getMessageStyle()}>{this.getMessage()}</div>
                        <div className={"Body"}>
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