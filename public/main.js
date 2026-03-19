let downMB, downLB;
let downY;
let downX;
let selectedNote;
let newStringNote;
const stringObj = document.createElementNS("http://www.w3.org/2000/svg", "svg");
let menuSelectNote;
/*
Basic funcitons, do not touch
*/

function resetBoard(){
    localStorage.setItem("board", JSON.stringify(
            {"notes":[
                    {id: 0, "title":"drag me 1", "content" : "drag me with LMB, drag all with MMB", "position" : {"x": 500, "y" : 500}, "color" : "rgb(210, 180, 140)" },
                    {id: 1,"title":"drag me 2", "content" : "drag me with LMB, drag all with MMB", "position" : {"x": 800, "y" : 800}, "color" : "rgb(210, 180, 140)" },
                    {id: 2, "title":"Connect me 1", "content" : "click the red button on top, and the button of another note", "position" : {"x": 0, "y" : 0}, "color" : "rgb(210, 180, 140)" },
                    {id: 3,"title":"Connect me 2", "content" : "click the red button on top, and the button of another note", "position" : {"x": 100, "y" : 100}, "color" : "rgb(210, 180, 140)" },
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
function newString(id){
    if (newStringNote == null) {
        
        newStringNote = id;
    }
    else{
        let newStringID;
        board = JSON.parse(localStorage.getItem("board"));
        if (!board.strings.length){newStringID = 0;}
        else (newStringID = board.strings.length)
        board.strings[board.strings.length] = {"between" : [newStringNote, id]};
        const string = document.createElementNS("http://www.w3.org/2000/svg", "line");
        string.id = String(newStringID + "s");
        const note1 = board.notes.find(n => n.id==newStringNote);
        const note2 = board.notes.find(n => n.id==id);
        string.setAttribute("x1",note1.position.x+(document.getElementById(newStringNote).clientWidth/2));
        string.setAttribute("y1",note1.position.y+20);
        string.setAttribute("x2",note2.position.x+(document.getElementById(id).clientWidth/2));
        string.setAttribute("y2",note2.position.y+20);
        string.setAttribute("style", `stroke:red;stroke-width:8;`);
        string.classList.add("strings");
        stringObj.appendChild(string);
        newStringNote = null;
        localStorage.setItem("board", JSON.stringify(board));
    }
}
function createNote(id, NewTitle, NewContent, positionX, positionY, color, colorText){
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
    note.style.transform = `translate(${positionX}px, ${positionY}px)`;
    note.style.backgroundColor = color;
    document.body.appendChild(note);
    function UpdateString(){
        for(var i = 0; i<board.strings.length;i++){
            const string = document.getElementById(String(i + "s"));
            const note1 = board.notes.find(n => n.id==board.strings[i].between[0]);
            const note2 = board.notes.find(n => n.id==board.strings[i].between[1]);
            string.setAttribute("x1",note1.position.x+(document.getElementById(board.strings[i].between[0]).clientWidth/2));
            string.setAttribute("y1",note1.position.y+20);
            string.setAttribute("x2",note2.position.x+(document.getElementById(board.strings[i].between[1]).clientWidth/2));
            string.setAttribute("y2",note2.position.y+20);
        }
    }
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
        downX, downY, "rgb(210, 180, 140)", "#000000"
    );
    board.notes[board.notes.length-1+1] = {id: newID,"title":"New Note", "content" : "Insert content here", "position" : {"x": downX, "y" : downY}, "color" : "rgb(210, 180, 140)"};
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
}

window.onload = function () {
    console.log(JSON.parse(localStorage.getItem("board")));
    if (localStorage.length == 0){
        localStorage.setItem("board", JSON.stringify(
            {"notes":[
                    {id: 0, "title":"drag me 1", "content" : "drag me with LMB, drag all with MMB", "position" : {"x": 500, "y" : 500}, "color" : "rgb(210, 180, 140)", "textColor" : "#000000" },
                    {id: 1,"title":"drag me 2", "content" : "drag me with LMB, drag all with MMB", "position" : {"x": 800, "y" : 800}, "color" : "rgb(210, 180, 140)", "textColor" : "#000000"  },
                    {id: 2, "title":"Connect me 1", "content" : "click the red button on top, and the button of another note", "position" : {"x": 0, "y" : 0}, "color" : "rgb(210, 180, 140)", "textColor" : "#000000"  },
                    {id: 3,"title":"Connect me 2", "content" : "click the red button on top, and the button of another note", "position" : {"x": 100, "y" : 100}, "color" : "rgb(210, 180, 140)", "textColor" : "#000000"  },
             ],
             
            "strings": [
            ]
                }
                
        ))
    }
    
    board = JSON.parse(localStorage.getItem("board"));
    for(var i = 0; i < (board.notes).length; i++){
        createNote(
            board.notes[i].id,
            board.notes[i].title,
            board.notes[i].content,
            board.notes[i].position.x,
            board.notes[i].position.y,
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
        string.setAttribute("x1",note1.position.x+(document.getElementById(board.strings[i].between[0]).clientWidth/2));
        string.setAttribute("y1",note1.position.y+25);
        string.setAttribute("x2",note2.position.x+(document.getElementById(board.strings[i].between[1]).clientWidth/2));
        string.setAttribute("y2",note2.position.y+25);
        string.setAttribute("style", `stroke:red;stroke-width:8;`);
        string.classList.add("string");
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
        console.log(klikk.target.closest(".string"));
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
            string.setAttribute("x1",note1.position.x+(document.getElementById(board.strings[i].between[0]).clientWidth/2));
            string.setAttribute("y1",note1.position.y+25);
            string.setAttribute("x2",note2.position.x+(document.getElementById(board.strings[i].between[1]).clientWidth/2));
            string.setAttribute("y2",note2.position.y+25);
        }
        downX = mozg.clientX;
        downY = mozg.clientY;
    }
    if(downLB){
        if(!selectedNote){return;}
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
            string.setAttribute("x1",note1.position.x+(document.getElementById(board.strings[i].between[0]).clientWidth/2));
            string.setAttribute("y1",note1.position.y+25);
            string.setAttribute("x2",note2.position.x+(document.getElementById(board.strings[i].between[1]).clientWidth/2));
            string.setAttribute("y2",note2.position.y+25);
        }
    }
})
document.addEventListener("mouseup", function(klikk){
    if(klikk.button == 1){
        downMB = false;
    }
    if(klikk.button == 0){
        downLB = false;
        selectedNote = null;
    }
});
setInterval(function() {
    board = JSON.parse(localStorage.getItem("board"));
    board.notes.forEach(note => {
        note.content = document.getElementById(note.id).querySelector("p").innerHTML;
        newTitle = document.getElementById(note.id).querySelector("h1").innerText;
        note.title = newTitle ;
    })
    localStorage.setItem("board", JSON.stringify(board));
}, 2000);
