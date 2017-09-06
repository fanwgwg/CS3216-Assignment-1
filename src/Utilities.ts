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
    photoUrl: string = "";
    questionAndAnswers: QuestionAndAnswer[] = [];
}

export class Member {
    id: string = "";
    name: string = "";
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
export function getUserList(userId: string): Promise<User[]> {
    let questions: Question[] = [
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

    let questionAndAnswers: QuestionAndAnswer[] = questions.map(x => {
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

    let userList = users.map(name => {
        return {
            name: name,
            id: "",
            desc: "This is a description about myself",
            matchScore: Math.floor(Math.random() * 99 + 1),
            photoUrl: require("../resources/images/user.svg"),
            questionAndAnswers: questionAndAnswers
        };
    });

    userList.sort((a: User, b: User) => {
        return a.matchScore < b.matchScore ? 1 : -1;
    });

    return new Promise<User[]>(resolve => {
        setTimeout(function () {
            resolve(userList);
        }, 1000);
    });
}


// Return true if this group is not on Teamker, true otherwise
export function checkIsNewGroup(groupId: string): Promise<boolean> {
    return new Promise<boolean>(resolve => {
        setTimeout(function () {
            resolve(Math.random() > 0.5);
        }, 1000);
    });
}

// Return a list of group members that have finished questions
export function getGroupMembersOnTeamker(groupId: string): Promise<User[]> {
    return new Promise<User[]>(resolve => {
        setTimeout(function () {
            getUserList("").then(function (data) {
                resolve(data.slice(0, 10));
            })
        }, 1000);
    });
}

// Return a list of group members that have not finished questions
export function getGroupMembersNotOnTeamker(groupId: string): Promise<User[]> {
    return new Promise<User[]>(resolve => {
        setTimeout(function () {
            getUserList("").then(function (data) {
                resolve(data.slice(10, 25));
            })
        }, 1000);
    });
}

// Return a list of group that the user owns
export function getGroupList(userId: string): Promise<Group[]> {
    return new Promise<Group[]>(resolve => {
        setTimeout(function () {
            let mockGroup = {
                name: "CS3216 Software Engineering in Digital Platforms",
                id: ""
            };

            let groupList: Group[] = [];

            for (let i = 0; i < 10; i++) {
                groupList.push(mockGroup);
            }

            resolve(groupList);
        }, 2000);
    });
}