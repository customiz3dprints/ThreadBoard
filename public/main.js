let downMB, downLB;
let downY;
let downX;
let selectedNote;
function deleteNote(id){
    document.getElementById(id).remove();
    board = JSON.parse(localStorage.getItem("board"));
    board.notes = board.notes.filter(note => note.id !== id);
    localStorage.setItem("board", JSON.stringify(board));
}
window.onload = function () {
    console.log(JSON.parse(localStorage.getItem("board")));
    if (localStorage.length == 0){
        localStorage.setItem("board", JSON.stringify(
            {"notes":[
                    {id: 0, "title":"drag me 1", "content" : "drag me with LMB, drag all with MMB", "position" : {"x": 500, "y" : 500} },
                    {id: 1,"title":"drag me 2", "content" : "drag me with LMB, drag all with MMB", "position" : {"x": 800, "y" : 800} },
                    {id: 2, "title":"drag me 1", "content" : "drag me with LMB, drag all with MMB", "position" : {"x": 0, "y" : 0} },
                    {id: 3,"title":"drag me 2", "content" : "drag me with LMB, drag all with MMB", "position" : {"x": 100, "y" : 100} },
             ],/*
            "strings": [
                {id : 0, "between" : [0,1]},
                {id : 1, "between" : [2,3]},
            ]*/}
                
        ))
    }
    
    board = JSON.parse(localStorage.getItem("board"));
    for(var i = 0; i < (board.notes).length; i++){
        const note = document.createElement("div");
        note.classList.add("note");
        note.id = board.notes[i].id;
        const dragging = document.createElement("div");
        dragging.classList.add("noteTop");
        dragging.id = board.notes[i].id;
        note.appendChild(dragging);
        const title = document.createElement("h1");
        title.innerText = board.notes[i].title;
        title.contentEditable = true;
        note.appendChild(title);
        const content = document.createElement("p");
        content.innerHTML = board.notes[i].content;
        content.contentEditable = true;
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
        delButton.setAttribute("onclick",`deleteNote(${board.notes[i].id})`);
        note.appendChild(delButton);
        note.style.transform = `translate(${board.notes[i].position.x}px, ${board.notes[i].position.y}px)`;
        document.body.appendChild(note);
    }
    const stringObj = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    stringObj.setAttribute("width", window.innerWidth);
    stringObj.setAttribute("height", window.innerHeight);
    stringObj.classList.add("strings");
    stringObj.style.position = "absolute";
    stringObj.style.pointerEvents = "none";
    document.body.appendChild(stringObj);
    for(var i = 0; i < (board.strings).length; i++){
        const string = document.createElementNS("http://www.w3.org/2000/svg", "line");
        string.id = String(board.strings[i].id + "s")
        string.setAttribute("x1",board.notes[board.strings[i].between[0]].position.x+(document.getElementById(board.strings[i].between[0]).clientWidth/2));
        string.setAttribute("y1",board.notes[board.strings[i].between[0]].position.y);
        string.setAttribute("x2",board.notes[board.strings[i].between[1]].position.x+(document.getElementById(board.strings[i].between[1]).clientWidth/2));
        string.setAttribute("y2",board.notes[board.strings[i].between[1]].position.y);
        string.setAttribute("style", `stroke:red;stroke-width:12;`);
        string.classList.add("strings");
        stringObj.appendChild(string);
    }
    
};
document.addEventListener("mousedown", function(klikk){
    if(klikk.button == 1){
        downX = klikk.clientX;
        downY = klikk.clientY;
        klikk.preventDefault();
        downMB = true;
    }
    if(klikk.button == 0){
        downX = klikk.clientX;
        downY = klikk.clientY;
        downLB = true;
        note = klikk.target.closest(".noteTop");
        if (note){
            selectedNote = note.id
        }
    }
    if(klikk.button == 2){
        downX = klikk.clientX;
        downY = klikk.clientY;
        board = JSON.parse(localStorage.getItem("board"));
        board.notes[board.notes.length] = {id: board.notes[board.notes.length-1].id+1,"title":"drag me 2", "content" : "drag me with LMB, drag all with MMB", "position" : {"x": klikk.clientX, "y" : klikk.clientY} };
        localStorage.setItem("board", JSON.stringify(board));
        const note = document.createElement("div");
        note.classList.add("note");
        note.id = board.notes[board.notes.length-1].id;
        const dragging = document.createElement("div");
        dragging.classList.add("noteTop");
        dragging.id = board.notes[board.notes.length-1].id+1;
        const title = document.createElement("h1");
        title.innerText = board.notes[board.notes.length-1].title;
        title.classList.add("noteTop");
        title.id = board.notes[board.notes.length-1]+1;
        title.contentEditable = true;
        note.appendChild(title);
        const content = document.createElement("p");
        content.innerText = board.notes[board.notes.length-1].content;
        content.contentEditable = true;
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
        delButton.setAttribute("onclick",`deleteNote(${board.notes[board.notes.length-1]+1})`);
        note.appendChild(delButton);
        note.style.transform = `translate(${board.notes[board.notes.length-1].position.x}px, ${board.notes[board.notes.length-1].position.y}px)`;
        document.body.appendChild(note);
        localStorage.setItem("board", JSON.stringify(board));
        setTimeout(event => {
            window.location.reload();
        },1);
        
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
        board.strings.forEach(stringIndex => {
            const string = document.getElementById(String(stringIndex.id + "s"));
            string.setAttribute("x1",board.notes[board.strings[stringIndex.id].between[0]].position.x+(document.getElementById(board.strings[stringIndex.id].between[0]).clientWidth/2));
            string.setAttribute("y1",board.notes[board.strings[stringIndex.id].between[0]].position.y);
            string.setAttribute("x2",board.notes[board.strings[stringIndex.id].between[1]].position.x+(document.getElementById(board.strings[stringIndex.id].between[1]).clientWidth/2));
            string.setAttribute("y2",board.notes[board.strings[stringIndex.id].between[1]].position.y);
        })
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
        board.strings.forEach(stringIndex => {
            const string = document.getElementById(String(stringIndex.id + "s"));
            string.setAttribute("x1",board.notes[board.strings[stringIndex.id].between[0]].position.x+(document.getElementById(board.strings[stringIndex.id].between[0]).clientWidth/2));
            string.setAttribute("y1",board.notes[board.strings[stringIndex.id].between[0]].position.y);
            string.setAttribute("x2",board.notes[board.strings[stringIndex.id].between[1]].position.x+(document.getElementById(board.strings[stringIndex.id].between[1]).clientWidth/2));
            string.setAttribute("y2",board.notes[board.strings[stringIndex.id].between[1]].position.y);
        })
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
        note.title = document.getElementById(note.id).querySelector("h1").innerHTML;
    })
    localStorage.setItem("board", JSON.stringify(board));
}, 2000);
