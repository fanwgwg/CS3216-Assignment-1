var ReactGA = require('react-ga');

export function logPageView(username: string, path: string) {
    ReactGA.set({ user: username })
    ReactGA.pageview(path)
}

export function initGA() {
    ReactGA.initialize('UA-106049419-1');
}

export class Question {
    body: string = "";
}

export class QuestionAndAnswer {
    question: Question = null;
    answer: number = 0;
}

export class User {
    name: string = "";
    id: string = "";
    desc: string = "";
    matchScore: number = 0;
    questionAndAnswers: QuestionAndAnswer[] = [];
}

export class Group {
    name: string = "";
    id: string = "";
}

export class JsonDownloader {

    callback: Function = null;
    downloadedJson: any = {};

    constructor(jsonUrls: string[], callback: Function) {

        this.notifyOwner = this.notifyOwner.bind(this);
        this.fetchJsonContent = this.fetchJsonContent.bind(this);
        this.getDownloadedJsonObjects = this.getDownloadedJsonObjects.bind(this);

        // Begin download each contents.
        this.callback = callback;
        for (let key in jsonUrls) {
            this.fetchJsonContent(jsonUrls[key]);
        }
    }

    notifyOwner(jsonUrl: string, jsonObject: any) {
        this.callback(jsonUrl, jsonObject);
    }

    fetchJsonContent(jsonUrl: string) {
        let thisObject = this;

        // Download the locally hosted data type json file.
        fetch(jsonUrl)
            .then(function (response: Response) {
                return response.text();
            }).then(function (jsonString) {
                let parsedJsonObject = JSON.parse(jsonString);
                thisObject.downloadedJson[jsonUrl] = parsedJsonObject;
                thisObject.notifyOwner(jsonUrl, parsedJsonObject);
            });
    }

    getDownloadedJsonObjects() {
        return this.downloadedJson;
    }
}

export function creteJsonDownloader(jsonUrls: string[], callback: Function) {
    return new JsonDownloader(jsonUrls, callback);
}

// Return a list of users to display in the main page
export function getUserList(groupId: string, userId: string): Promise<any[]> {
    return new Promise<any[]>(resolve => {
        fetch("http://teamker.tk/api/userList?user_id=" + userId + "&page_id=" + groupId)
            .then(function (res: Response) {
                if (res.ok) {
                    console.log("getUserListResponse received: " + res);
                    return res.text();
                } else {
                    console.log("Unable to get user list");
                }
            }).then(function (data: any) {
                let jsonData = JSON.parse(data);
                console.log("userlist received: " + JSON.stringify(jsonData.users));
                let users = jsonData.users;

                resolve(users);
            })
    });
}

export function getQuestions(groupId: string): Promise<Question[]> {
    return new Promise<Question[]>(resolve => {
        // fetch("http://teamker.tk/api/questions?page_id=page_id")
        fetch("http://teamker.tk/api/questions?page_id=" + groupId)
            .then(function (response: Response) {
                return response.text();
            }).then(function (jsonString: any) {
                let data = JSON.parse(jsonString).questions;
                console.log("response from getQuestions: " + data);
                let questions = data.map(function (q: any) {
                    return {
                        body: "How good at you at " + q.body + " ?"
                    }
                });

                resolve(questions);
            })
    });
}

// Return true if this member is on Teamker, false otherwise
export function checkIsNewUser(userId: string, groupId: string): Promise<boolean> {
    return new Promise<boolean>(resolve => {
        console.log("checkIsNewUser");

        fetch("http://teamker.tk/api/checkUserResponse?user_id=" + userId + "&page_id=" + groupId)
            .then(function (response: Response) {
                if (response.ok) {
                    let data = response.text();
                    console.log("response from checkIsNewUser: " + data);
                    return data;
                } else {
                    console.log("undable to check if this is a new user");
                }
            }).then(function (data: any) {
                console.log("response from checkIsNewUser: " + data);
                resolve(data === "true");
            }).catch(function (error: any) {
                console.error(error);
            });
    });
}

// Return true if this group is not on Teamker, true otherwise
export function checkIsNewGroup(groupId: string): Promise<boolean> {
    return new Promise<boolean>(resolve => {

        console.log("checkIsNewGroup");

        fetch("http://teamker.tk/api/checkNewGroup?page_id=" + groupId)
            .then(function (response: Response) {
                let data = response.text();
                console.log("response from checkIsNewGroup: " + data);
                return data;
            }).then(function (data: any) {
                resolve(data === "true");
            }).catch(function (error: any) {
                console.error(error);
            });
    });
}

// Return a list of group members that have finished questions
export function getGroupMembersOnTeamker(groupId: string): Promise<User[]> {
    return new Promise<User[]>(resolve => {

        console.log("getGroupMembersOnTeamker");

        fetch("http://teamker.tk/api/usersOnTeamker?page_id=" + groupId)
            .then(function (response: Response) {
                return response.text();
            }).then(function (jsonString: any) {
                let data = JSON.parse(jsonString).users;
                console.log("response from UsersOnTeamker: " + data);
                // return data;
                resolve(data);
            }).catch(function (error: any) {
                console.error(error);
            });
    });
}

// Return a list of group members that have not finished questions
export function getGroupMembersNotOnTeamker(groupId: string): Promise<User[]> {
    return new Promise<User[]>(resolve => {

        console.log("getGroupMembersNotOnTeamker");

        fetch("http://teamker.tk/api/usersNotOnTeamker?page_id=" + groupId)
            .then(function (response: Response) {
                return response.text();
            }).then(function (jsonString: any) {
                let data = JSON.parse(jsonString).users;
                console.log("response from usersNotOnTeamker: " + data);
                resolve(data);
            }).catch(function (error: any) {
                console.error(error);
            });
    });
}

export function getMembersOfGroup(groupId: string): Promise<User[]> {
    console.log("get members of a group from fb");
    return new Promise<User[]>(resolve => {
        FB.api(
            "/" + groupId + "/members",
            function (response: any) {
                let memberList: User[] = [];
                if (response && !response.error) {
                    /* handle the result */
                    for (let mem of response.data) {
                        let user = new User();
                        user.id = mem.id;
                        user.name = mem.name;
                        memberList.push(user);
                    }

                    console.log(memberList);
                }
                resolve(memberList);
            }
        );
    })
}

// Return a list of group that the user owns (this is from Facebook but not our database)
export function getGroupList(userId: string): Promise<Group[]> {
    return new Promise<Group[]>(resolve => {
        FB.api(
            "/me/groups",
            function (response: any) {
                console.log("getGroupList");
                let groupList: Group[] = [];
                if (response && !response.error) {
                    for (let grp of response.data) {
                        groupList.push({ name: grp.name, id: grp.id });
                    }
                }
                console.log("groupList: " + groupList);
                resolve(groupList);
            }
        );
    });
}

// Return a list of pages the user is involved
export function getGroupListInvloved(userId: string): Promise<Group[]> {
    console.log("check getGroupListInvolved with userId: " + userId);
    return new Promise<Group[]>(resolve => {
        fetch("http://teamker.tk/api/frontpage?user_id=" + userId)
            .then(function (response: Response) {
                return response.text();
            }).then(function (jsonString: any) {
                let data = JSON.parse(jsonString).pages;
                console.log("response from getGroupListInvolved: " + data);
                resolve(data);
            }).catch(function (error: any) {
                console.error(error);
            });
    });
}

export function buildUserList(users: any, questions: Question[]): User[] {
    let userList = users.map(function (user: any) {
        let q: QuestionAndAnswer[] = [];

        for (let i = 0; i < questions.length; i++) {
            q.push({
                question: questions[i],
                answer: user.attributes[i]
            });
        }

        return {
            name: user.name,
            id: user.id,
            desc: user.desc,
            matchScore: user.score,
            questionAndAnswers: q
        };
    });

    return userList;
}

export function popShare(): void {
    FB.ui({
        method: 'share',
        href: 'http://teamker.tk',
    }, function (response) { });
}