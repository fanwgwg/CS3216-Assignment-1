import * as React from 'react';

interface GroupItemProps {
    groupName: String;
}

export default class GroupItem extends React.Component<GroupItemProps>{
    render() {
        return (
         <div className={"GroupName"}>{this.props.groupName}</div>
        )
    }
}