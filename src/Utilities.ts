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

// Return true if this group is not on Teamker, true otherwise
export function isNewGroup(groupId: string): boolean {
    return true;
}

// Return the number of group members that have finished questions
export function getNumOfGroupMemberOnTeamker(groupId: string) {
    return 30;
}

// Return the number of group members
export function getNumOfGroupMember(groupId: string): number {
    return 34;
}

// Return a list of group that the user owns
export function getGroupList(userId: string): Group[]{
    let mockGroup = {
        name: "CS3216 Software Engineering in Digital Platforms",
        id: "0"
    };

    let groupList: Group[] = [];

    for (let i = 0; i < 10; i++) {
        groupList.push(mockGroup);
    }

    // return groupList;
    //console.log(userId);
    // let groupList: Group[] = [];
    // FB.api(
    //     "/me/groups",
    //     function (response: any) {
    //         if (response && !response.error) {
    //             /* handle the result */
    //             //console.log(response);
    //             for (let grp of response.data) {
    //                 groupList.push({ name: grp.name, id: grp.id });
    //             }

    //             // callback(groupList);
    //             //console.log(groupList);
    //         }
    //     }
    // );
    // console.log(groupList);

    return groupList;
}

// Return a list of group that the user owns
export function getGroupMembers(groupId: string): Member[]{
    // let mockGroup = {
    //     name: "CS3216 Software Engineering in Digital Platforms",
    //     id: 0
    // };

    // let groupList: Group[] = [];

    // for (let i = 0; i < 10; i++) {
    //     groupList.push(mockGroup);
    // }

    // return groupList;
    console.log(groupId);
    let memberList: Member[] = [];
    FB.api(
        "/" + groupId + "/members",
        function (response: any) {
            if (response && !response.error) {
                /* handle the result */
                console.log(response);
                for (let mem of response.data) {
                    console.log(mem);
                    if (!mem.administrator){
                        memberList.push({id: mem.id, name: mem.name });
                    }
                }

                // callback(groupList);
                console.log(memberList);
            }
        }
    );
    // console.log(groupList);

    return memberList;

}