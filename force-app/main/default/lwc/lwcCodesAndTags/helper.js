function getNewDataWithChildren(rowId, data, children){
    return data.map(function(row) {
        let hasChildrenContent = false;
        if (row.hasOwnProperty('_children') && Array.isArray(row._children) && row._children.length > 0) {
            hasChildrenContent = true;
        }
        if (row.id === rowId) {
            row._children = children;
        } else if (!row.hasChildrenContent) {
            getNewDataWithChildren(rowId, row._children, children);
        }
        return row;
    });
}

function extractParents(selectedCodeAndTag, data){
    let parentAndChildrenSubject = {};
    let allCodeAndTags = data.allCodeAndTags;
    selectedCodeAndTag.map(instance=>{
      let ancestor =   getAncestor(instance, allCodeAndTags);
      parentAndChildrenSubject[ancestor.Id] = ancestor;
      if(parentAndChildrenSubject[ancestor.Id]['_children'] === undefined){
        parentAndChildrenSubject[ancestor.Id]['_children'] = [instance];
      }else{
        parentAndChildrenSubject[ancestor.Id]['_children'].push(instance);
      }
      
    })
    return parentAndChildrenSubject;
}

function getAncestor(instance, allCodeAndTags){
    if(instance.parentId === undefined){
        return instance;
    }
    if(instance.parentId != undefined){
        let newInstance = instance;
        newInstance.parent_code_and_tag__c = instance.parentId;
        while(newInstance.parentId != undefined || newInstance.parent_code_and_tag__c != undefined){
            let newId = newInstance.parentId != undefined ? newInstance.parentId : newInstance.parent_code_and_tag__c;
            newInstance = allCodeAndTags[newId];
        }
        return newInstance;
    }
}


export {getNewDataWithChildren, extractParents};



  
    /**
     * {
     *      parent: {}
     *      children:{} 
     *  }
     * 
     * 
 Selected codes and tags ::  [{"code":"50 shades","id":"a03Dn000002e1kPIAQ","parentId":"a03Dn000002e8SSIAY","level":2,"posInSet":2,"setSize":2,"isExpanded":true,"hasChildren":true},{"code":"test manual approval","id":"a03Dn000002e308IAA","parentId":"a03Dn000002e1kPIAQ","level":3,"posInSet":1,"setSize":1,"isExpanded":false,"hasChildren":true}]
*/