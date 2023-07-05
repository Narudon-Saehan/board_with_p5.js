
let cw = self.innerWidth ,ch =self.innerHeight
let x=400,y=300;
let clickX,clickY,oldX,oldY,focusImg = null;
const emptySpace = 50;
let newUrlIframe = ""
let newColorTextarea = "#068FFF"
let tools={
    width:300,
    paddingX:5
}
let boardSize={
    width:1320,
    height:660,
    bottom:0.05,
}
const defaultObjImg={
    type:"IMAGE",
    obj:undefined,
    x:boardSize.width/2+tools.width,
    y:emptySpace + boardSize.height/2,
    width:200,
    height:200,
}
const defaultObjVideo={
    type:"VIDEO",
    obj:undefined,
    div:undefined,
    x:boardSize.width/2+tools.width,
    y:emptySpace + boardSize.height/2,
    width:200,
    height:200,
    padding:40,
}
const defaultObjIframe={
    type:"IFRAME",
    obj:undefined,
    div:undefined,
    x:boardSize.width/2+tools.width,
    y:emptySpace + boardSize.height/2,
    width:200,
    height:200,
    padding:40,
}
const defaultObjTextarea={
    type:"TEXTAREA",
    backgroundColor:newColorTextarea,
    obj:undefined,
    div:undefined,
    x:boardSize.width/2+tools.width,
    y:emptySpace + boardSize.height/2,
    width:200,
    height:200,
    padding:40,
    text:""
}
let objs = []

function preload() {
    createTutorial()
}

function setup(){
    createCanvas(boardSize.width+tools.width+emptySpace, boardSize.height+emptySpace*2);
    createTools()
}
function draw(){
    background("#E3F4F4");
    rectMode(CENTER)
    imageMode(CENTER)
    createBoard()
    objs.forEach((data,index)=>{
        if(data.type === defaultObjImg.type){
            data.obj.size(data.width,data.height)
            data.obj.position(data.x-round(data.obj.width/2),data.y-round(data.obj.height/2))
            image(data.obj, data.x,data.y,data.width,data.height, 0, 0, data.obj.width, data.obj.height, COVER); 
            
        }else if(data.type === defaultObjVideo.type){
            data.div.style('width', data.width+"px");
            data.div.style('height', data.height+"px");
            data.div.style('border-radius', "8px");
            data.div.style('background-color', "#DDE6ED");
            if(index === focusImg){
                data.div.style("border-width", "4px");
                data.div.style("border-style", "solid");
            }else{
                data.div.style("border-width", "0px");
            }
            data.div.position(data.x-round((data.width)/2),data.y-round((data.height/2)));

            data.obj.size(data.width-data.padding,data.height-data.padding)
            data.obj.position(data.x-round(data.obj.width/2),data.y-round(data.obj.height/2))
        }else if(data.type === defaultObjIframe.type){

            data.div.style('width', data.width+"px");
            data.div.style('height', data.height+"px");
            data.div.style('border-radius', "8px");
            data.div.style('background-color', "#DDE6ED");
            if(index === focusImg){
                data.div.style("border-width", "4px");
                data.div.style("border-style", "solid");
            }else{
                data.div.style("border-width", "0px");
            }
            data.div.position(data.x-round((data.width)/2),data.y-round((data.height/2)));

            data.obj.style('width', data.width-data.padding+"px");
            data.obj.style('height', data.height-data.padding+"px");
            data.obj.position(data.x-round((data.width-data.padding)/2),data.y-round((data.height-data.padding)/2));
        }else if(data.type === defaultObjTextarea.type){
            data.div.style('width', data.width+"px");
            data.div.style('height', data.height+"px");
            data.div.style('border-radius', "8px");
            data.div.style('background-color', data.backgroundColor);
            if(index === focusImg){
                data.div.style("border-width", "4px");
                data.div.style("border-style", "solid");
            }else{
                data.div.style("border-width", "0px");
            }
            data.div.position(data.x-round((data.width)/2),data.y-round((data.height/2)));

            data.obj.style('width', data.width-data.padding+"px");
            data.obj.style('height', data.height-data.padding+"px");
            data.obj.style('background-color', data.backgroundColor);
            data.obj.style('border', "none");
            data.obj.elt.value = data.text
            data.obj.position(data.x-round((data.width-data.padding)/2),data.y-round((data.height-data.padding)/2));
        }
    })
    if(focusImg !== null){
        strokeWeight(4);
        stroke('#354259');
        fill('rgba(0,0,0,0)')
        if(objs[focusImg].type === defaultObjImg.type){
            rect(objs[focusImg].x, objs[focusImg].y, objs[focusImg].width, objs[focusImg].height);
        }
        noStroke()
    }else{
        noStroke()
    }
    renderMove()
}  

function createTools(){

    let positionY = emptySpace

    createSpan('Create a photo or video').position(tools.paddingX,positionY);
    positionY+=25;
    createFileInput(handleFile).addClass("form-control").style('width', tools.width-tools.paddingX*2+'px').position(tools.paddingX, positionY);
    positionY+=50;

    createSpan('Create iframe element').position(tools.paddingX,positionY);
    positionY+=25;
    createInput('').size(round(tools.width*2/3)).addClass("form-control").attribute('placeholder',"iframe url").position(tools.paddingX, positionY).input(myInputEvent);
    createButton('Create').addClass("btn btn-primary").size(round(tools.width/3)-tools.paddingX*2).position(tools.paddingX+round(tools.width*2/3), positionY).mousePressed(createIframe);
    positionY+=50;

    createSpan('Create textarea').position(tools.paddingX,positionY);
    positionY+=25;
    createColorPicker(newColorTextarea).addClass("form-control").style('width', '200px').style('height', '38px').position(tools.paddingX, positionY).input(setColorNewTextarea);
    createButton('Create').addClass("btn btn-primary").size(round(tools.width/3)-tools.paddingX*2).position(tools.paddingX+round(tools.width*2/3), positionY).mousePressed(createTextarea);


}

function createBoard(){
    fill("white")
    rect(boardSize.width/2+300,emptySpace+boardSize.height/2,boardSize.width, boardSize.height, 10);
    //rect(cw/2,ch-round(ch*boardSize.bottom)-round(ch*boardSize.height)/2, round(cw*boardSize.width), round(ch*boardSize.height), 10);
}

function createTutorial(){
    let textArea1 = {...defaultObjTextarea}
    textArea1.x = 410
    textArea1.y = 160
    textArea1.div = createDiv('')
    textArea1.text ="โปรเจคนี้จำลองเป็นไวท์บอร์ด ที่สามารถใช้ในการบันทึก การวางแผน หรือการทำงานได้ (เวอร์ชั่นทดลอง) ==>"
    textArea1.obj = createElement('textarea').addClass("form-control").input((e)=>{textArea1.text = e.target.value});
    textArea1.obj.elt.placeholder = 'write here';
    objs.push(textArea1)

    let textArea2 = {...defaultObjTextarea}
    textArea2.x = 630
    textArea2.y = 160
    textArea2.div = createDiv('')
    textArea2.text ="สามารถเคลื่อนย้าย object โดยเมาส์โดยการกดค้างไว้ที่วัตถุและขยับ (บางวัตถุต้องกดที่ขอบๆของวัตถุ) ==>"
    textArea2.obj = createElement('textarea').addClass("form-control").input((e)=>{textArea2.text = e.target.value});
    textArea2.obj.elt.placeholder = 'write here';
    textArea2.backgroundColor = "#FEFF86"
    objs.push(textArea2)

    let textArea3 = {...defaultObjTextarea}
    textArea3.x = 850
    textArea3.y = 160
    textArea3.div = createDiv('')
    textArea3.text ="หรือเคลื่อนย้าย object โดยการกดที่วัตถุแล้วกดปุ่มลูกศรหรือwasd (บางวัตถุต้องกดที่ขอบๆของวัตถุ) ==>"
    textArea3.obj = createElement('textarea').addClass("form-control").input((e)=>{textArea3.text = e.target.value});
    textArea3.obj.elt.placeholder = 'write here';
    textArea3.backgroundColor = "#9681EB"
    objs.push(textArea3)

    let textArea4 = {...defaultObjTextarea}
    textArea4.x = 1070
    textArea4.y = 160
    textArea4.div = createDiv('')
    textArea4.text ="สามารถลบ object โดยการกดที่วัตถุและกดปุ่ม backspace หรือ delete ==>"
    textArea4.obj = createElement('textarea').addClass("form-control").input((e)=>{textArea4.text = e.target.value});
    textArea4.obj.elt.placeholder = 'write here';
    textArea4.backgroundColor = "#FF6969"
    objs.push(textArea4)

    let textArea5 = {...defaultObjTextarea}
    textArea5.x = 1290
    textArea5.y = 160
    textArea5.div = createDiv('')
    textArea5.text = "สามารถสร้าง object ใหม่ได้จากแถบเครื่องมือทางด้านซ้าย โดยจะมีให้สร้างทั้งหมด 3 รูปแบบดังนี้ ==>"
    textArea5.obj = createElement('textarea').addClass("form-control").input((e)=>{textArea5.text = e.target.value});
    textArea5.obj.elt.placeholder = 'write here';
    textArea5.backgroundColor = "#FDCEDF"
    objs.push(textArea5)

    let textArea6 = {...defaultObjTextarea}
    textArea6.x = 1510
    textArea6.y = 160
    textArea6.div = createDiv('')
    textArea6.text ="1.แบบรูปภาพหรือวิดิโอ โดยการอัพโหลดไฟล์ภายในเครื่อง ตัวอย่าง\n↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓"
    textArea6.obj = createElement('textarea').addClass("form-control").input((e)=>{textArea6.text = e.target.value});
    textArea6.obj.elt.placeholder = 'write here';
    textArea6.backgroundColor = "#ECF2FF"
    objs.push(textArea6)

    let img1 = {...defaultObjImg}
    img1.x = 1510
    img1.y = 380
    img1.obj = createImg("assets/cat-animation.gif");
    objs.push(img1)

    let video1 = {...defaultObjVideo}
    video1.div = createDiv('')
    let fileVideo = createVideo("assets/cat-video2.mp4");
    fileVideo.showControls();
    video1.x = 1290
    video1.y = 380
    video1.obj = fileVideo;
    objs.push(video1)

    let textArea7 = {...defaultObjTextarea}
    textArea7.x = 1070
    textArea7.y = 380
    textArea7.div = createDiv('')
    textArea7.text ="2.แบบ iframe โดยการใส่ลิงค์ url มาสร้างเป็น iframe element ของ html (กดที่ขอบ) ตัวอย่าง\n<=="
    textArea7.obj = createElement('textarea').addClass("form-control").input((e)=>{textArea6.text = e.target.value});
    textArea7.obj.elt.placeholder = 'write here';
    textArea7.backgroundColor = "#DDF7E3"
    objs.push(textArea7)

    let iframe1 = {...defaultObjIframe}
    iframe1.x = 850
    iframe1.y = 380
    iframe1.div = createDiv('')
    iframe1.obj = createElement("iframe").attribute('src', "https://www.youtube.com/embed/dgnOr26yoTw");
    objs.push(iframe1)

    let iframe2 = {...defaultObjIframe}
    iframe2.x = 630
    iframe2.y = 380
    iframe2.div = createDiv('')
    iframe2.obj = createElement("iframe").attribute('src', "https://en.wikipedia.org/wiki/Creative_coding");
    objs.push(iframe2)

    let textArea8 = {...defaultObjTextarea}
    textArea8.x = 410
    textArea8.y = 380
    textArea8.div = createDiv('')
    textArea8.text ="3.แบบ textarea element ของ html โดยสามารถเลือกสีพื้นหลังได้ (กดที่ขอบ) ตัวอย่าง\n↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓"
    textArea8.obj = createElement('textarea').addClass("form-control").input((e)=>{textArea8.text = e.target.value});
    textArea8.obj.elt.placeholder = 'write here';
    textArea8.backgroundColor = "#E384FF"
    objs.push(textArea8)

    let textArea9 = {...defaultObjTextarea}
    textArea9.x = 410
    textArea9.y = 600
    textArea9.div = createDiv('')
    textArea9.text ="ตัวอย่าง ตัวอย่าง ตัวอย่าง ตัวอย่าง ตัวอย่าง ตัวอย่าง ตัวอย่าง ตัวอย่าง ตัวอย่าง ตัวอย่าง ตัวอย่าง ตัวอย่าง"
    textArea9.obj = createElement('textarea').addClass("form-control").input((e)=>{textArea9.text = e.target.value});
    textArea9.obj.elt.placeholder = 'write here';
    textArea9.backgroundColor = "#B4E4FF"
    objs.push(textArea9)
}

function renderMove(){
    if(focusImg !== null){
        if(keyIsPressed && (key === 'ArrowLeft' || key === 'a') && (objs[focusImg].x > tools.width + objs[focusImg].width/2)){
            objs[focusImg].x -= 1
        }
        if(keyIsPressed && (key === 'ArrowRight' || key === 'd') && (objs[focusImg].x < tools.width+boardSize.width - objs[focusImg].width/2)){
            objs[focusImg].x += 1
        }
        if(keyIsPressed && (key === 'ArrowUp' || key === 'w') && (objs[focusImg].y > emptySpace + objs[focusImg].height/2)){
            objs[focusImg].y -= 1
        }
        if(keyIsPressed && (key === 'ArrowDown' || key === 's') && (objs[focusImg].y < emptySpace + boardSize.height - objs[focusImg].height/2)){
            objs[focusImg].y += 1
        }
    }
}

function mouseDragged() {
    if(focusImg !== null){
        objs[focusImg].x = oldX + mouseX - clickX
        objs[focusImg].y = oldY + mouseY - clickY
        if(objs[focusImg].x < tools.width + objs[focusImg].width/2){
            objs[focusImg].x = tools.width + objs[focusImg].width/2
        }
        if(objs[focusImg].x > tools.width+boardSize.width - objs[focusImg].width/2){
            objs[focusImg].x = tools.width+boardSize.width - objs[focusImg].width/2
        }
        if(objs[focusImg].y < emptySpace + objs[focusImg].height/2){
            objs[focusImg].y = emptySpace + objs[focusImg].height/2
        }
        if(objs[focusImg].y > emptySpace + boardSize.height - objs[focusImg].height/2){
            objs[focusImg].y = emptySpace + boardSize.height - objs[focusImg].height/2
        }
        cursor('grab')
    }
}

function mousePressed(){
    let i
    for (i = objs.length-1; i >= 0; i--) {
        if(objs[i].type !== defaultObjTextarea.type){
            if(mouseX >= objs[i].x-objs[i].width/2 && mouseX <= objs[i].x+objs[i].width/2 && mouseY <= objs[i].y+objs[i].height/2 && mouseY >= objs[i].y-objs[i].height/2){
                focusImg = i 
                clickX = mouseX
                clickY = mouseY
                oldX = objs[i].x
                oldY = objs[i].y
                cursor('grab')
                break
            }
        }else if(objs[i].type === defaultObjTextarea.type){
            if(mouseX >= objs[i].x-objs[i].width/2 && mouseX <= objs[i].x+objs[i].width/2 && mouseY <= objs[i].y+objs[i].height/2 && mouseY >= objs[i].y-objs[i].height/2){
                if(!(mouseX >= objs[i].x-(objs[i].width-objs[i].padding)/2 && mouseX <= objs[i].x+(objs[i].width-objs[i].padding)/2 && mouseY <= objs[i].y+(objs[i].height-objs[i].padding)/2 && mouseY >= (objs[i].height-objs[i].padding)/2)){
                    focusImg = i 
                    clickX = mouseX
                    clickY = mouseY
                    oldX = objs[i].x
                    oldY = objs[i].y
                    cursor('grab')
                    break
                }
            }
        }
    }
    if( i == -1){
        focusImg = null
    }
}

function mouseReleased() {
    console.log(mouseX,mouseY);
    cursor(ARROW)
}

function keyPressed() {
    if(focusImg !== null){
        if(key==="Backspace" || keyCode===8 ||  key==="Delete" || keyCode===46){
            if(objs[focusImg].type === defaultObjVideo.type || objs[focusImg].type === defaultObjIframe.type || objs[focusImg].type === defaultObjTextarea.type){
                objs[focusImg].obj.remove()
                objs[focusImg].div.remove()
            }
            objs.splice(focusImg, 1)
            focusImg = null
        }
    }

}

function handleFile(file) {
    print(file);
    if (file.type === 'image') {
        let newImg = createImg(file.data, '');
        // newImg.hide();
        let newObj = {...defaultObjImg}
        newObj.obj = newImg
        objs.push(newObj)
    //   img.hide();
    } 
    else if(file.type === "video"){
        let newDiv = createDiv('')
        let newVideo = createVideo(file.data)
        newVideo.showControls()
        let newObj = {...defaultObjVideo}
        newObj.div = newDiv
        newObj.obj = newVideo
        objs.push(newObj)

    }
    file = null
}

function myInputEvent() {
    newUrlIframe = this.value()
}

function createIframe() {
    let newDiv = createDiv('')
    let newIframe = createElement("iframe");
    newIframe.attribute('src', newUrlIframe);
    let newObj = {...defaultObjIframe}
    newObj.div = newDiv
    newObj.obj = newIframe
    objs.push(newObj)
}

function setColorNewTextarea() {
    newColorTextarea = this.value()
}

function createTextarea() {
    let newDiv = createDiv('')
    let newTextarea = createElement('textarea');
    newTextarea.addClass("form-control")
    newTextarea.elt.placeholder = 'write here';
    newTextarea.elt.value = ""
    // newTextarea.attribute('row', 3);
    let newObj = {...defaultObjTextarea}
    newObj.div = newDiv
    newObj.obj = newTextarea
    newObj.backgroundColor = newColorTextarea
    newObj.obj.input((e)=>{newObj.text = e.target.value})
    objs.push(newObj)
}


