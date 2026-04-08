let downMB, downLB;
let downY;
let downX;
let selectedNote;
let resizingNote;
let newStringNote;
const stringObj = document.createElementNS("http://www.w3.org/2000/svg", "svg");
let menuSelectNote;
let startSizeX, startSizeY;
/*
Basic funcitons, do not touch
*/
function deleteString(id){
    board = JSON.parse(localStorage.getItem("board"));
    const string = document.getElementById(String(id+"s"));
    string.remove();
    board.strings.splice(id, 1);
    localStorage.setItem("board", JSON.stringify(board));
    window.location.reload();
}
function exportBoard(){
    const board = localStorage.getItem("board");
    const exportFile = new Blob([board], {type : "application/json"});
    const url = window.URL.createObjectURL(exportFile);
    const link = document.createElement("a");
    link.href = url;
    link.download = JSON.parse(board).name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}
function UpdateString(){
        for(var i = 0; i<board.strings.length;i++){
            const string = document.getElementById(String(i + "s"));
            const note1 = board.notes.find(n => n.id==board.strings[i].between[0]);
            const note2 = board.notes.find(n => n.id==board.strings[i].between[1]);
            string.setAttribute("x1",note1.position.x+(document.getElementById(board.strings[i].between[0]).clientWidth/2)+3);
            string.setAttribute("y1",note1.position.y+25);
            string.setAttribute("x2",note2.position.x+(document.getElementById(board.strings[i].between[1]).clientWidth/2)+3);
            string.setAttribute("y2",note2.position.y+25);
            let ButtonPosX = Math.min(string.getAttribute("x1"), string.getAttribute("x2"))+((Math.max(string.getAttribute("x1"), string.getAttribute("x2")) - Math.min(string.getAttribute("x1"), string.getAttribute("x2")))/2);
            let ButtonPosY = Math.min(string.getAttribute("y1"), string.getAttribute("y2"))+((Math.max(string.getAttribute("y1"), string.getAttribute("y2")) - Math.min(string.getAttribute("y1"), string.getAttribute("y2")))/2);
            const delStringButton = document.getElementById(String(i + "sd"));
            delStringButton.style.transform = `translate(${ButtonPosX-5}px, ${ButtonPosY-5}px)`;
        }
    }
function resetBoard(){
    localStorage.setItem("board", JSON.stringify(
            {
                "name": "New Board",
                "notes":[
                    {id: 0, "title":"drag me 1", "content" : "drag me with LMB, drag all with MMB", "position" : {"x": 500, "y" : 500}, "width" : 200, "height" : 160, "color" : "rgb(210, 180, 140)", "textColor" : "#000000" },
                    {id: 1,"title":"drag me 2", "content" : "drag me with LMB, drag all with MMB", "position" : {"x": 800, "y" : 800}, "width" : 200, "height" : 160, "color" : "rgb(210, 180, 140)", "textColor" : "#000000"  },
                    {id: 2, "title":"Connect me 1", "content" : "click the red button on top, and the button of another note", "position" : {"x": 300, "y" : 300},"width" : 400, "height" : 160, "color" : "rgb(210, 180, 140)", "textColor" : "#000000" },
                    {id: 3,"title":"Connect me 2", "content" : "click the red button on top, and the button of another note", "position" : {"x": 100, "y" : 100},"width" : 400, "height" : 160, "color" : "rgb(210, 180, 140)", "textColor" : "#000000" },
                ],
             
            "strings": [
            ]
                }
                
        ));
    window.location.reload();
}
function deleteNote(id){
    document.getElementById(id).remove();
    board = JSON.parse(localStorage.getItem("board"));
    board.strings = board.strings.filter((Delstring,i) => {
        const shouldDel = Delstring.between[0] == id || Delstring.between[1] == id;
        if (shouldDel){document.getElementById(String(i + "s"))?.remove();}
        return !shouldDel;
    })
    board.notes = board.notes.filter(note => note.id !== id);
    localStorage.setItem("board", JSON.stringify(board));
    window.location.reload();
}

//creating stuff

function newString(id){
    if (newStringNote == null) {
        newStringNote = id;
        const note1 = board.notes.find(n => n.id==newStringNote);
        const string = document.createElementNS("http://www.w3.org/2000/svg", "line");
        string.id = String("tempString");
        string.setAttribute("x1",note1.position.x+(document.getElementById(newStringNote).clientWidth/2)+3);
        string.setAttribute("y1",note1.position.y+25);
        string.setAttribute("x2",note1.position.x+(document.getElementById(newStringNote).clientWidth/2));
        string.setAttribute("y2",note1.position.y+25);
        string.setAttribute("style", `stroke:#b10000;stroke-width:8;`);
        string.classList.add("strings");
        stringObj.appendChild(string);
    }
    else{
        let newStringID;
        document.getElementById("tempString").remove();
        board = JSON.parse(localStorage.getItem("board"));
        if (!board.strings.length){newStringID = 0;}
        else {newStringID = board.strings.length}
        const note1 = board.notes.find(n => n.id==newStringNote);
        const note2 = board.notes.find(n => n.id==id);
        if(note1.id === note2.id){return;}
        board.strings[board.strings.length] = {"between" : [newStringNote, id]};
        const string = document.createElementNS("http://www.w3.org/2000/svg", "line");
        string.id = String(newStringID + "s");
        string.setAttribute("x1",note1.position.x+(document.getElementById(newStringNote).clientWidth/2)+3);
        string.setAttribute("y1",note1.position.y+25);
        string.setAttribute("x2",note2.position.x+(document.getElementById(id).clientWidth/2)+3);
        string.setAttribute("y2",note2.position.y+25);
        string.setAttribute("style", `stroke:#b10000;stroke-width:8;`);
        string.classList.add("strings");
        stringObj.appendChild(string);
        const delStringButton = document.createElement("button");
        let ButtonPosX = Math.min(string.getAttribute("x1"), string.getAttribute("x2"))+((Math.max(string.getAttribute("x1"), string.getAttribute("x2")) - Math.min(string.getAttribute("x1"), string.getAttribute("x2")))/2);
        let ButtonPosY = Math.min(string.getAttribute("y1"), string.getAttribute("y2"))+((Math.max(string.getAttribute("y1"), string.getAttribute("y2")) - Math.min(string.getAttribute("y1"), string.getAttribute("y2")))/2);
        delStringButton.style.transform = `translate(${ButtonPosX-5}px, ${ButtonPosY-5}px)`;
        delStringButton.classList.add("stringDel");
        delStringButton.id = String(string.id + "d");
        delStringButton.setAttribute("onclick", `deleteString(${newStringID})`);
        delStringButton.innerHTML= "X";
        document.body.appendChild(delStringButton);
        newStringNote = null;
        localStorage.setItem("board", JSON.stringify(board));
    }
}
function createNote(id, NewTitle, NewContent, positionX, positionY, width, height, color, colorText){
    const note = document.createElement("div");
    note.classList.add("note");
    note.id = id;
    const dragging = document.createElement("div");
    dragging.classList.add("noteTop");
    dragging.id = id;
    const stringHole = document.createElement("button");
    stringHole.classList.add("pins");
    stringHole.id = id;
    stringHole.setAttribute("onclick",`newString(${id})`);
    dragging.append(stringHole);
    note.appendChild(dragging);
    const title = document.createElement("h1");
    title.innerText = NewTitle;
    title.contentEditable = true;
    note.appendChild(title);
    const content = document.createElement("p");
    content.innerHTML = NewContent;
    content.contentEditable = true;
    content.style.color = colorText;
    note.appendChild(content);
    const delButton = document.createElement("button");
    delButton.classList.add("delButton");
    const delSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    delSVG.setAttribute("width", 22);
    delSVG.setAttribute("height", 24);
    delSVG.style.pointerEvents = "none";
    const delCan = document.createElementNS("http://www.w3.org/2000/svg", "path");
    delCan.setAttribute("d", "m15.707,11.707l-2.293,2.293,2.293,2.293c.391.391.391,1.023,0,1.414-.195.195-.451.293-.707.293s-.512-.098-.707-.293l-2.293-2.293-2.293,2.293c-.195.195-.451.293-.707.293s-.512-.098-.707-.293c-.391-.391-.391-1.023,0-1.414l2.293-2.293-2.293-2.293c-.391-.391-.391-1.023,0-1.414s1.023-.391,1.414,0l2.293,2.293,2.293-2.293c.391-.391,1.023-.391,1.414,0s.391,1.023,0,1.414Zm7.293-6.707c0,.553-.448,1-1,1h-.885l-1.276,13.472c-.245,2.581-2.385,4.528-4.978,4.528h-5.727c-2.589,0-4.729-1.943-4.977-4.521l-1.296-13.479h-.86c-.552,0-1-.447-1-1s.448-1,1-1h4.101c.465-2.279,2.485-4,4.899-4h2c2.414,0,4.435,1.721,4.899,4h4.101c.552,0,1,.447,1,1Zm-14.828-1h7.656c-.413-1.164-1.524-2-2.828-2h-2c-1.304,0-2.415.836-2.828,2Zm10.934,2H4.87l1.278,13.287c.148,1.547,1.432,2.713,2.986,2.713h5.727c1.556,0,2.84-1.168,2.987-2.718l1.258-13.282Z");
    delSVG.appendChild(delCan);
    delButton.appendChild(delSVG);
    delButton.setAttribute("onclick",`deleteNote(${id})`);
    note.appendChild(delButton);

    //resizing notes

    const resizeSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    resizeSVG.classList.add("resize");
    resizeSVG.setAttribute("width", 24);
    resizeSVG.setAttribute("height", 24);
    const resizeButton1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    resizeButton1.setAttribute("d", "M10.707,13.293c-.391-.391-1.023-.391-1.414,0l-6.175,6.175c-.187-1.134-.239-2.858,.434-4.968,.167-.526-.123-1.089-.649-1.256-.529-.167-1.089,.123-1.257,.649-1.463,4.594,.009,7.782,.072,7.916,.099,.208,.267,.376,.475,.475,.09,.042,1.551,.717,3.888,.717,1.149,0,2.512-.164,4.027-.646,.526-.167,.816-.73,.649-1.256-.168-.526-.727-.817-1.257-.649-2.112,.672-3.835,.62-4.968,.434l6.175-6.175c.391-.391,.391-1.023,0-1.414Z");
    const resizeButton2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    resizeButton2.setAttribute("d", "M13.293,10.707c.391,.391,1.023,.391,1.414,0l6.175-6.175c.187,1.134,.239,2.858-.434,4.968-.167,.526,.123,1.089,.649,1.256,.529,.167,1.089-.123,1.257-.649,1.463-4.594-.009-7.782-.072-7.916-.099-.208-.267-.376-.475-.475-.09-.042-1.551-.717-3.888-.717-1.149,0-2.512,.164-4.027,.646-.526,.167-.816,.73-.649,1.256,.168,.526,.727,.817,1.257,.649,2.112-.672,3.835-.62,4.968-.434l-6.175,6.175c-.391,.391-.391,1.023,0,1.414Z");
    resizeSVG.appendChild(resizeButton1);
    resizeSVG.appendChild(resizeButton2);
    const resizeDiv = document.createElement("div");
    resizeDiv.style.width = 24;
    resizeDiv.style.height = 24;
    resizeDiv.appendChild(resizeSVG);
    resizeDiv.classList.add("rDiv");
    note.appendChild(resizeDiv);
    note.style.transform = `translate(${positionX}px, ${positionY}px)`;
    note.style.width = width + "px";
    note.style.height = height+"px";
    note.style.backgroundColor = color;
    
    document.body.appendChild(note);
    
    addEventListener("input", UpdateString);
}

//custom context menu

function menuNote(){
    board = JSON.parse(localStorage.getItem("board"));
    if (!board.notes[board.notes.length-1]){newID = 0;}
    else (newID = board.notes[board.notes.length-1].id+1)
    createNote(
        newID,
        "New Note",
        "Insert content here",
        downX, downY, 200, 160, "rgb(210, 180, 140)", "#000000"
    );
    board.notes[board.notes.length-1+1] = {id: newID,"title":"New Note", "content" : "Insert content here", "position" : {"x": downX, "y" : downY}, "width" : 200, "height" : 160, "color" : "rgb(210, 180, 140)", "textColor" : "#000000"};
    localStorage.setItem("board", JSON.stringify(board));
    setTimeout(() => {
        window.location.reload();
    },1);
}
function menuDelete(){
    deleteNote(Number(menuSelectNote.id));
}
function menuColor(){
    board = JSON.parse(localStorage.getItem("board"));
    board.notes.find(n => n.id==Number(menuSelectNote.id)).color = document.getElementById("noteColor").value;
    localStorage.setItem("board", JSON.stringify(board));
    setTimeout(() => {
        window.location.reload();
    },1);
}
function menuColorText(){
    board = JSON.parse(localStorage.getItem("board"));
    board.notes.find(n => n.id==Number(menuSelectNote.id)).colorText = document.getElementById("noteColor").value;
    localStorage.setItem("board", JSON.stringify(board));
    setTimeout(() => {
        window.location.reload();
    },1);
}
document.addEventListener("contextmenu", (menu) => {
    menu.preventDefault();
})
function showMenu(posX,posY){
    const menu = document.getElementById("contextMenu");
    menu.style.transform = `translate(${posX}px, ${posY}px)`;
    menu.hidden = false;
    if (menuSelectNote) {
        document.getElementById("deleteNote").hidden = false;
        document.getElementById("setColor").hidden = false;
        document.getElementById("setColorText").hidden = false;
        document.getElementById("noteColor").hidden = false;
    }
    else{
        document.getElementById("deleteNote").hidden = true;
        document.getElementById("setColor").hidden = true;
        document.getElementById("setColorText").hidden = true;
        document.getElementById("noteColor").hidden = true;
    }
    menu.style.maxHeight=0;
    menu.style.maxHeight=null;
}

window.onload = function () {
    
    const importJSON = document.getElementById("importJSON");
    importJSON.addEventListener("change", function(change){
        const file = change.target.files[0];
        if(!file){return;}
        const reader = new FileReader();
        reader.onload = function(){
            try {
                const data = JSON.parse(reader.result);
                if (!data.strings || !data.notes){
                    window.alert("Improper JSON file");
                    return;
                }
                localStorage.setItem("board", JSON.stringify(data));
                window.location.reload();
            } catch(error){
                window.alert("Error: " + error);
            }
        };
        reader.readAsText(file);
    });
    console.log(JSON.parse(localStorage.getItem("board")));
    if (localStorage.length == 0){
        localStorage.setItem("board", JSON.stringify(
            {
                "name": "New Board",
                "notes":[
                    {id: 0, "title":"drag me 1", "content" : "drag me with LMB, drag all with MMB", "position" : {"x": 500, "y" : 500},"width" : 200, "height" : 160, "color" : "rgb(210, 180, 140)", "textColor" : "#000000"},
                    {id: 1,"title":"drag me 2", "content" : "drag me with LMB, drag all with MMB", "position" : {"x": 800, "y" : 800},"width" : 200, "height" : 160, "color" : "rgb(210, 180, 140)", "textColor" : "#000000"},
                    {id: 2, "title":"Connect me 1", "content" : "click the red button on top, and the button of another note", "position" : {"x": 0, "y" : 0},"width" : 400, "height" : 160, "color" : "rgb(210, 180, 140)", "textColor" : "#000000" },
                    {id: 3,"title":"Connect me 2", "content" : "click the red button on top, and the button of another note", "position" : {"x": 100, "y" : 100},"width" : 400, "height" : 160, "color" : "rgb(210, 180, 140)", "textColor" : "#000000"},
                ],
             
            "strings": [
            ]
                }
                
        ));
    }
    
    board = JSON.parse(localStorage.getItem("board"));
    const boardTitle = document.getElementById("boardTitle");
    boardTitle.innerText = board.name;
    for(var i = 0; i < (board.notes).length; i++){
        createNote(
            board.notes[i].id,
            board.notes[i].title,
            board.notes[i].content,
            board.notes[i].position.x,
            board.notes[i].position.y,
            board.notes[i].width,
            board.notes[i].height,
            board.notes[i].color,
            board.notes[i].colorText,
        );
    }
    
    stringObj.setAttribute("width", window.innerWidth);
    stringObj.setAttribute("height", window.innerHeight);
    stringObj.classList.add("strings");
    stringObj.style.position = "absolute";
    stringObj.style.pointerEvents = "none";
    document.body.appendChild(stringObj);
    
    if(!board.strings){return;}
    for(var i = 0; i < (board.strings).length; i++){
        const note1 = board.notes.find(n => n.id==board.strings[i].between[0]);
        const note2 = board.notes.find(n => n.id==board.strings[i].between[1]);
        if(!note1 || !note2) {continue;}
        const string = document.createElementNS("http://www.w3.org/2000/svg", "line");
        string.id = String(i + "s");
        string.setAttribute("x1",note1.position.x+(document.getElementById(board.strings[i].between[0]).clientWidth/2)+3);
        string.setAttribute("y1",note1.position.y+25);
        string.setAttribute("x2",note2.position.x+(document.getElementById(board.strings[i].between[1]).clientWidth/2)+3);
        string.setAttribute("y2",note2.position.y+25);
        string.setAttribute("style", `stroke:#b10000;stroke-width:8;`);
        string.classList.add("string");
        const delStringButton = document.createElement("button");
        let ButtonPosX = Math.min(string.getAttribute("x1"), string.getAttribute("x2"))+((Math.max(string.getAttribute("x1"), string.getAttribute("x2")) - Math.min(string.getAttribute("x1"), string.getAttribute("x2")))/2);
        let ButtonPosY = Math.min(string.getAttribute("y1"), string.getAttribute("y2"))+((Math.max(string.getAttribute("y1"), string.getAttribute("y2")) - Math.min(string.getAttribute("y1"), string.getAttribute("y2")))/2);
        delStringButton.style.transform = `translate(${ButtonPosX-5}px, ${ButtonPosY-5}px)`;
        delStringButton.classList.add("stringDel");
        delStringButton.id = String(string.id + "d");
        delStringButton.setAttribute("onclick", `deleteString(${i})`);
        delStringButton.innerHTML= "X";
        document.body.appendChild(delStringButton);
        stringObj.appendChild(string);
    }
    
};
document.addEventListener("mousedown", function(klikk){
    downX = klikk.clientX;
    downY = klikk.clientY;
    if(klikk.button == 1){
        klikk.preventDefault();
        downMB = true;
    }
    if(klikk.button == 0){
        downLB = true;
        const resizeDiv = klikk.target.closest(".rDiv");
        if (resizeDiv) {
            resizingNote = resizeDiv.parentNode;
            startSizeX = resizingNote.offsetWidth;
            startSizeY = resizingNote.offsetHeight;
        }   
        note = klikk.target.closest(".noteTop");
        if (note){
            selectedNote = note.id
        }
        menu = klikk.target.closest(".menuElement");
        if (!menu){
            if (klikk.target.closest("#noteColor")){return;}
            document.getElementById("contextMenu").hidden = true;
            document.getElementById("deleteNote").hidden = true;
            document.getElementById("setColor").hidden = true;
            document.getElementById("noteColor").hidden = true;
        }
    }
    if(klikk.button == 2){
        klikk.preventDefault();
        document.getElementById("contextMenu").hidden = true;
        document.getElementById("deleteNote").hidden = true;
        document.getElementById("setColor").hidden = true;
        document.getElementById("noteColor").hidden = true;
        menuSelectNote = klikk.target.closest(".note");
        showMenu(klikk.clientX, klikk.clientY);
    }
    
});
document.addEventListener("mousemove", function(mozg){
    board = JSON.parse(localStorage.getItem("board"));
    if (downMB) {
        board.notes.forEach(note => {
            note.position.x += mozg.clientX-downX; 
            note.position.y += mozg.clientY-downY; 
            document.getElementById(note.id).style.transform = `translate(${note.position.x}px, ${note.position.y}px)`;
            localStorage.setItem("board", JSON.stringify(board));
        })
        for(var i = 0; i<board.strings.length;i++){
            const string = document.getElementById(String(i + "s"));
            const note1 = board.notes.find(n => n.id==board.strings[i].between[0]);
            const note2 = board.notes.find(n => n.id==board.strings[i].between[1]);
            string.setAttribute("x1",note1.position.x+(document.getElementById(board.strings[i].between[0]).clientWidth/2)+3);
            string.setAttribute("y1",note1.position.y+25);
            string.setAttribute("x2",note2.position.x+(document.getElementById(board.strings[i].between[1]).clientWidth/2)+3);
            string.setAttribute("y2",note2.position.y+25);
            let ButtonPosX = Math.min(string.getAttribute("x1"), string.getAttribute("x2"))+((Math.max(string.getAttribute("x1"), string.getAttribute("x2")) - Math.min(string.getAttribute("x1"), string.getAttribute("x2")))/2);
            let ButtonPosY = Math.min(string.getAttribute("y1"), string.getAttribute("y2"))+((Math.max(string.getAttribute("y1"), string.getAttribute("y2")) - Math.min(string.getAttribute("y1"), string.getAttribute("y2")))/2);
            const delStringButton = document.getElementById(String(i + "sd"));
            delStringButton.style.transform = `translate(${ButtonPosX-5}px, ${ButtonPosY-5}px)`;
        }
        downX = mozg.clientX;
        downY = mozg.clientY;
    }
    if(downLB){
        if(!selectedNote){
            if(!resizingNote){return;}
            resizingNote.style.width = Math.max(200, Number(startSizeX + ((mozg.clientX-downX)-20))) + "px"; 
            resizingNote.style.height = Math.max(160,Number(startSizeY + ((mozg.clientY-downY)-20)))+ "px";
            board = JSON.parse(localStorage.getItem("board"));
            board.notes.forEach(note => {
                if(note.id != resizingNote.id){return;}
                note.width = Math.max(200, Number(startSizeX + ((mozg.clientX-downX)-20)));
                note.height = Math.max(160,Number(startSizeY + ((mozg.clientY-downY)-20)));
            });
            localStorage.setItem("board", JSON.stringify(board));
            UpdateString();
        }
        else{
            board = JSON.parse(localStorage.getItem("board"));
            board.notes.forEach(note => {
                if(note.id != selectedNote){return;}
                note.position.x += mozg.clientX-downX; 
                note.position.y += mozg.clientY-downY; 
                this.getElementById(note.id).style.transform = `translate(${note.position.x}px, ${note.position.y}px)`;
                localStorage.setItem("board", JSON.stringify(board));
                downX = mozg.clientX;
                downY = mozg.clientY;
            })
            for(var i = 0; i<board.strings.length;i++){
                const string = document.getElementById(String(i + "s"));
                const note1 = board.notes.find(n => n.id==board.strings[i].between[0]);
                const note2 = board.notes.find(n => n.id==board.strings[i].between[1]);
                string.setAttribute("x1",note1.position.x+(document.getElementById(board.strings[i].between[0]).clientWidth/2)+3);
                string.setAttribute("y1",note1.position.y+25);
                string.setAttribute("x2",note2.position.x+(document.getElementById(board.strings[i].between[1]).clientWidth/2)+3);
                string.setAttribute("y2",note2.position.y+25);
                let ButtonPosX = Math.min(string.getAttribute("x1"), string.getAttribute("x2"))+((Math.max(string.getAttribute("x1"), string.getAttribute("x2")) - Math.min(string.getAttribute("x1"), string.getAttribute("x2")))/2);
                let ButtonPosY = Math.min(string.getAttribute("y1"), string.getAttribute("y2"))+((Math.max(string.getAttribute("y1"), string.getAttribute("y2")) - Math.min(string.getAttribute("y1"), string.getAttribute("y2")))/2);
                const delStringButton = document.getElementById(String(i + "sd"));
                delStringButton.style.transform = `translate(${ButtonPosX-5}px, ${ButtonPosY-5}px)`;
            }
        }
    }
    const tempString = document.getElementById("tempString");
    if(tempString){
        tempString.setAttribute("x2", mozg.clientX+20);
        tempString.setAttribute("y2", mozg.clientY+10);
    }
    
})
document.addEventListener("mouseup", function(klikk){
    if(klikk.button == 1){
        downMB = false;
    }
    if(klikk.button == 0){
        downLB = false;
        selectedNote = null;
        board = JSON.parse(localStorage.getItem("board"));
        resizingNote = null;
    }
});
setInterval(function() {
    board = JSON.parse(localStorage.getItem("board"));
    board.notes.forEach(note => {
        note.content = document.getElementById(note.id).querySelector("p").innerHTML;
        newTitle = document.getElementById(note.id).querySelector("h1").innerText;
        note.title = newTitle;
        note.width = parseFloat(document.getElementById(note.id).style.width);
        note.height = parseFloat(document.getElementById(note.id).style.height);
    });
    board.name = document.getElementById("boardTitle").innerText;
    localStorage.setItem("board", JSON.stringify(board));
}, 2000);
