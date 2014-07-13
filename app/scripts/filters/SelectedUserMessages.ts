/// <reference path="../../bower_components/DefinitelyTyped/underscore/underscore.d.ts" />
/// <reference path="../models/IBreederProfile.ts" />
class SelectedUserMessages {
    static filter(notes:INote[], isTrash:boolean, userName:string):INote[] {
        var messages:INote[] = _.filter(notes, (note:INote)=> {
            return note.isTrash === isTrash && note.userName === userName;
        });

        return messages;
    }
}
