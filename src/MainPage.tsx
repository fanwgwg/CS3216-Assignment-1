import * as React from 'react';

import UserCard from './UserCard';

export default class MainPage extends React.Component {
    render() {
        let userList: JSX.Element[] = [];

        for (let i = 0; i < 50; i++) {
            let user = {
                name: "Jim Bob " + i,
                desc: "This is a description about myself",
                matchScore: 100 - i
            }

            userList.push(<UserCard key={i} user={user} index={i + 1} />)
        }

        return (
            <div className={"MainPage"}>
                <div className={"Header"}>
                    Here are our recommended match for you...
                </div>
                <div className={"UserList"}>
                    {userList}
                </div>
            </div>
        )
    };
}
