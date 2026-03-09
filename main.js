let downMB, downLB;
let downY;
let downX;
let selectedNote;
window.onload = function () {
    console.log(JSON.parse(localStorage.getItem("board")));
    if (localStorage.length == 0){
        localStorage.setItem("board", JSON.stringify(
            {"notes":[
                    {id: 0, "title":"drag me 1", "content" : "drag me with LMB, drag all with MMB", "position" : {"x": 500, "y" : 500} },
                    {id: 1,"title":"drag me 2", "content" : "drag me with LMB, drag all with MMB", "position" : {"x": 800, "y" : 800} },
             ]}
        ))
    }
    board = JSON.parse(localStorage.getItem("board"));
    for(var i = 0; i < (board.notes).length; i++){
        const note = document.createElement("div");
        note.classList.add("note");
        note.id = board.notes[i].id;
        const title = document.createElement("h1");
        title.innerText = board.notes[i].title;
        note.appendChild(title);
        const content = document.createElement("p");
        content.innerText = board.notes[i].content;
        note.appendChild(content);
        note.style.transform = `translate(${board.notes[i].position.x}px, ${board.notes[i].position.y}px)`;
        document.body.appendChild(note);

    }
};
document.addEventListener("mousedown", (e) => {
  if (e.button === 1) {
    e.preventDefault();
  }
});
document.addEventListener("mousedown", function(klikk){
    if(klikk.button == 1){
        downX = klikk.clientX;
        downY = klikk.clientY;
        downMB = true;
    }
    if(klikk.button == 0){
        downX = klikk.clientX;
        downY = klikk.clientY;
        downLB = true;
        note = klikk.target.closest(".note");
        if (note){
            selectedNote = note.id
        }
    }
});
document.addEventListener("mousemove", function(mozg){
    board = JSON.parse(localStorage.getItem("board"));
    if (downMB) {
        board.notes.forEach(note => {
            note.position.x += mozg.clientX-downX; 
            note.position.y += mozg.clientY-downY; 
            this.getElementById(note.id).style.transform = `translate(${note.position.x}px, ${note.position.y}px)`;
            localStorage.setItem("board", JSON.stringify(board));
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

