//An simple inherit method, safe than the "ChildClass.prototype = new ParentClass();"
//It will avoid the side affect of using the "new ParentClass()" to run the logic in constuctor function.
//In fact, it only create/clone an object from an "prototype" object.
function createObyP(protoObj)
{
    var tmpO = null;
    if(Object.create)
    {
        tmpO = Object.create(protoObj);//Create an object from an prototype
    }
    else
    {
        tmpf = function(){};
        tmpf.prototype = protoObj;
        tmpO = new tmpf();
    }
    return tmpO;
};
function inheritS(childClass, parentClass)
{
    childClass.prototype = createObyP(parentClass.prototype);
    childClass.prototype.constructor = childClass;
};