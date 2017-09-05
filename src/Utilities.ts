export class Question {
    body: string = "";
}

export class QuestionAndAnswer {
    question: Question = null;
    answer: number = 0;
}

export class User {
    name: string = "";
    desc: string = "";
    matchScore: number = 0;
    photoUrl: string = "";
    questionAndAnswers: QuestionAndAnswer[] = [];
}

export class Group {
    name: string = "";
    id: number = null;
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

// Return true if this group is not on Teamker, true otherwise
export function isNewGroup(groupId: number): boolean {
    return true;
}

// Return the number of group members that have finished questions
export function getNumOfGroupMemberOnTeamker(groupId: number) {
    return 30;
}

// Return the number of group members
export function getNumOfGroupMember(groupId: number): number {
    return 34;
}

// Return a list of group that the user owns
export function getGroupList(userId: number): Group[] {
    let mockGroup = {
        name: "CS3216 Software Engineering in Digital Platforms",
        id: 0
    };

    let groupList: Group[] = [];

    for (let i = 0; i < 10; i++) {
        groupList.push(mockGroup);
    }

    return groupList;
}