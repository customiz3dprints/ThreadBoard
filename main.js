let downB;
let downY = 0;
let downX = 0;
let offsetX = 0;
let offsetY = 0;
document.addEventListener("mousedown", (e) => {
  if (e.button === 1) {
    e.preventDefault();
  }
});
document.addEventListener("mousedown", function(klikk){
    if(klikk.button == 1){
        downX = klikk.clientX;
        downy = klikk.clientY;
        downB = true;
    }
});
document.addEventListener("mousemove", function(mozg){
    if (!downB) {return;}
    offsetX += (mozg.clientX-downX);
    offsetY += (mozg.clientY-downY);
    const notes = document.querySelectorAll(".note");
    notes.forEach(note => {
        note.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    })
    

    downX = mozg.clientX;
    downY = mozg.clientY;
})
document.addEventListener("mouseup", function(klikk){
    if(klikk.button == 1){
        downB = false;
    }
});