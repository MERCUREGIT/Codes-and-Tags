function extractParents(selectedCodeAndTag, allCodeAndTags){
    try {
        let parentAndChildrenSubject = {};
        selectedCodeAndTag.map((instance)=>{
                if(!instance['hasChildren']){
                    let ancestor  = getAncestor(instance,allCodeAndTags)
                    let newId = ancestor['Id'] != undefined ? ancestor['Id'] : ancestor['id'];
                    if(parentAndChildrenSubject[newId] === undefined){
                        parentAndChildrenSubject[newId] = {code: ancestor['Name'] != undefined ? ancestor['Name'] : ancestor['code'] ,id:newId };
                    }
                    if(parentAndChildrenSubject[newId]._children === undefined){
                        parentAndChildrenSubject[newId]._children = [instance];
                    }else{
                        parentAndChildrenSubject[newId]._children.push(instance);
                    }
                }
            });
        return parentAndChildrenSubject;
    } catch (error) {
        console.log(error.message)
    }
}



function generateGenialogicalBranch(ancestors, allCodeAndTags){
    ancestors.forEach((instance, index) => {
        let children = [];
        for(const key in allCodeAndTags){
            if(allCodeAndTags[key]['parent_code_and_tag__c'] === instance.id){
                children.push({code: allCodeAndTags[key]['Name'], id: allCodeAndTags[key]['Id'], parentId:allCodeAndTags[key]['parent_code_and_tag__c']})
            }
        }
       if(children.length>0) {
            ancestors[index]['_children'] = [...children]
            generateGenialogicalBranch(ancestors[index]['_children'], allCodeAndTags)
       }
    });
}

function getAncestor(instance, allCodeAndTags){
    if(instance['parentId'] === undefined && instance['parent_code_and_tag__c'] === undefined){
        return instance;
    }
    let newId = instance['parentId'] != undefined ? instance['parentId'] : instance['parent_code_and_tag__c'];
    return  getAncestor(allCodeAndTags[newId], allCodeAndTags);
}

function extractAndParseSavedParentsAndChildren(savedInstance,allCodeAndTags){
    let savedInstanceID = savedInstance['CODES_AND_TAG__r']['Id'];
    if(savedInstanceID != undefined){
        let newParsedInstance = {
            Name: savedInstance['CODES_AND_TAG__r']['Name'],
            Id: savedInstanceID,
            parentId: savedInstance['CODES_AND_TAG__r']['parent_code_and_tag__c']
        }
        return getAncestor(newParsedInstance, allCodeAndTags)
    }
}




export {extractParents, generateGenialogicalBranch,extractAndParseSavedParentsAndChildren};
