
var ntkDragg = function () {
    var event;
    var arrayList = [];
    var container;
    var containerSource;
    var containerDelete;
    var elementLast;
    var cloneNodeId = 0;
    return {
        startMoving: function (divId, evt) {
            if (!evt)
                evt = event;
            elementLast = document.getElementById(divId);
            if (elementLast.parentElement.id == containerSource.id) {
                cloneNodeId++;
                ntkDragg.startClone(elementLast.id, elementLast.id + cloneNodeId, container);
                return;
            }


            var eWs = elementLast.offsetLeft;
            var eWi = elementLast.offsetWidth;
            if (!eWs) eWs = 0;
            if (!eWi) eWi = 0;

            var eHs = elementLast.offsetTop;
            var eHi = elementLast.offsetHeight;
            if (!eHs) eHs = 0;
            if (!eHi) eHi = 0;

            var cWs = container.offsetLeft;
            var cWi = container.offsetWidth;
            if (!cWs) cWs = 0;
            if (!cWi) cWi = 0;

            var cHs = container.offsetTop;
            var cHi = container.offsetHeight;
            if (!eWs) eWs = 0;
            if (!cHi) cHi = 0;

            var cWsDelete = containerDelete.offsetLeft;
            var cWiDelete = containerDelete.offsetWidth;
            if (!cWsDelete) cWsDelete = 0;
            if (!cWiDelete) cWiDelete = 0;

            var cHsDelete = containerDelete.offsetTop;
            var cHiDelete = containerDelete.offsetHeight;
            if (!cHsDelete) cHsDelete = 0;
            if (!cHiDelete) cHiDelete = 0;


            evt = evt || window.event;
            var diffX = evt.pageX - eWs;
            var diffY = evt.pageY - eHs;
            document.onmousemove = function (evt) {
                container.style.cursor = 'move';
                evt = evt || window.event;
                var aX = evt.pageX - diffX;
                var aY = evt.pageY - diffY;
                ntkDragg.move(elementLast, aX, aY);
            }
            document.onmouseup = function (evt) {
                container.style.cursor = 'default';
                evt = evt || window.event;
                var aX = evt.pageX - diffX;
                var aY = evt.pageY - diffY;
                if (evt.pageX > cWsDelete && evt.pageX < (cWsDelete + cWiDelete) && evt.pageY > cHsDelete && evt.pageY < (cHsDelete + cHiDelete)) {
                    if (elementLast.parentNode)
                        elementLast.parentNode.removeChild(elementLast);
                    ntkDragg.valueSet(null, true);
                    document.onmousemove = function () { }
                    document.onmouseup = function () { }
                    return;
                }
                if (aX < 0) aX = 0;
                if (aY < 0) aY = 0;
                if (aX + eWi > cWi) aX = cWi - eWi;
                if (aY + eHi > cHi) aY = cHi - eHi;

                ntkDragg.move(elementLast, aX, aY);
                var a = document.createElement('script');
                document.onmousemove = function () { }
                document.onmouseup = function () { }
            }

        },
        move: function (elementLast, xpos, ypos) {
            elementLast.style.left = xpos + 'px';
            elementLast.style.top = ypos + 'px';
            ntkDragg.valueSet({ top: xpos, left: ypos });
        },
        readFromDb: function (valueList, containerId, containerDeleteId, containerSourceId, evt) {
         
            event = evt;
            containerSource = document.getElementById(containerSourceId);
            container = document.getElementById(containerId);
            containerDelete = document.getElementById(containerDeleteId);


            if (!container)
                return;
            
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }


            arrayList = valueList;
            for (var i = 0; i < arrayList.length; i++) {
                ntkDragg.startClone(arrayList[i].type, arrayList[i].id, document.getElementById(containerId), arrayList[i]);
            }
        },
        startClone: function (mainId, newId, container, setValue) {
            //if (!elementLast)
            elementLast = document.getElementById(mainId);
            if (!elementLast)
                return;
            var cln = elementLast.cloneNode(true);
            cln.id = newId;
            container.appendChild(cln);
            elementLast = document.getElementById(cln.id);
            elementLast.style.position = 'absolute';
            if (setValue) {
                ntkDragg.valueSet(setValue)
                elementLast.style.top = setValue.top + 'px';
                elementLast.style.left = setValue.left + 'px';
                elementLast.style.width = setValue.width + 'px';
                elementLast.style.height = setValue.height + 'px';
                elementLast.style.transform = ' rotate(' + setValue.rotate + 'deg)';
            }
            else
                ntkDragg.valueSet({ type: mainId, top: elementLast.clientTop, left: elementLast.clientLeft, height: elementLast.clientHeight, width: elementLast.clientWidth, rotate: 0 });
        },
        startSize: function (evt) {
            if (!evt)
                evt = event;
            if (!elementLast)
                return;
            document.onmousemove = function (evt) {
                elementLast.style.width = (evt.pageX - elementLast.offsetLeft) + 'px';
                elementLast.style.height = (evt.pageY - elementLast.offsetTop) + 'px';
                ntkDragg.valueSet({ height: (evt.pageY - elementLast.offsetTop), width: (evt.pageX - elementLast.offsetLeft) });
            }
            document.onmouseup = function () {
                document.onmousemove = function () { }
            }
        },
        startRotator: function (evt) {
            if (!evt)
                evt = event;
            if (!elementLast)
                return;
            document.onmousemove = function (evt) {
                elementLast.style.transform = 'rotate(0deg)';

                var rotate_X;
                var invert = false;

                if (invert) {
                    rotate_X = evt.pageX;
                } else if (!invert) {
                    rotate_X = evt.pageX;
                }
                //
                elementLast.style.transform = ' rotate(' + rotate_X + 'deg)';
                ntkDragg.valueSet({ rotate: rotate_X });
            }
            document.onmouseup = function () {
                document.onmousemove = function () { }
            }
        },
        startRotatorZiro: function (evt) {
            if (!evt)
                evt = event;
            if (!elementLast)
                return;
            elementLast.style.transform = 'rotate(0deg)';
            ntkDragg.valueSet({ rotate: 0 });
        },
        startRemove: function (evt) {
            if (!evt)
                evt = event;
            if (!elementLast)
                return;
            if (elementLast.parentNode)
                elementLast.parentNode.removeChild(elementLast);
            ntkDragg.valueSet(null, true);
        },
        valueGet: function () {
            return arrayList;
        },
        valueSet: function (setValue, remove) {
            var idKey = elementLast.id;

            //ntkDragg.valueSet( {  top: top, left: left, height: height, width: width, rotate: rotate });
            for (var i = 0; i < arrayList.length; i++) {
                if (arrayList[i] && arrayList[i].id === idKey) {
                    if (remove) {
                        arrayList.splice(i, 1);
                        console.log(arrayList);
                        return;
                    }
                    if (setValue) {
                        if (setValue.type)
                            arrayList[i].type = setValue.type;
                        if (setValue.top)
                            arrayList[i].top = setValue.top;
                        if (setValue.left)
                            arrayList[i].left = setValue.left;
                        if (setValue.height)
                            arrayList[i].height = setValue.height;
                        if (setValue.width)
                            arrayList[i].width = setValue.width;
                        if (setValue.rotate)
                            arrayList[i].rotate = setValue.rotate;
                    }
                    console.log(arrayList);
                    return arrayList[i];
                }
            }
            if (setValue) {
                setValue.id = idKey;
                arrayList.push(setValue);
            }
            console.log(arrayList);
        }
    }
}();