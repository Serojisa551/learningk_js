let borderShape = document.querySelector(".border");
let header = document.querySelector("header");
let indexBorderShape = 0;
let isSelecting = false;
let startX, startY;
let selectionBox = null;
let selectedElements = new Set();
let isCreatedInputColor = false;
let inputColor = document.querySelector("input");
let isDvdAnimation = false;
let animationFrameId = true;
let curorCoordinateX;
let networkSwitch  = false;

for (let el of header.children) {
    el.addEventListener("click", (e) =>  createBorderItem(e, el));
}
header.querySelector(".button-no-off").onclick = (e) => {networkSwitch = !networkSwitch, console.log("networkSwitch", networkSwitch)}
function createBorderItem(e, el) {
    let type_shape = el.classList[1];
    if (type_shape !== "button-del-all" && type_shape !== "button-no-off") {
        let borderItem = document.createElement('div');
        borderItem.classList.add('border--item');
        let borderItemRadius = document.createElement('div');
        borderItemRadius.innerHTML = 0;
        borderItemRadius.classList.add('border--shape-radius');
        let borderItemButton = document.createElement('div');
        borderItemButton.classList.add('border--button-shape');
        borderItem.appendChild(borderItemRadius);
        borderItem.appendChild(borderItemButton);
        if (type_shape === 'button-circle') {
            borderItemRadius.classList.add('border--circle-radius');
            borderItemButton.classList.add('border--button-circle');
        }
        else if (type_shape === 'button-square') {
            borderItemRadius.classList.add('border--square-radius');
            borderItemButton.classList.add('border--button-square');
        }
        else if (type_shape === 'button-triangle') {
            borderItemRadius.classList.add('border--triangle-radius');
            borderItemButton.classList.remove('border--button-shape');
            borderItemButton.classList.add('border--button-triangle');
        }

        borderShape.appendChild(borderItem);
        addEventShape()
    }
    else if (type_shape === 'button-del-all') {
        borderShape.innerHTML=""
        indexBorderShape=0

        // это не ошибка это так задумано
        animationFrameId = false;
        animationFrameId = true;
    }
}

function  addEventShape() {
    let el =  borderShape.children[indexBorderShape++];
    el.children[1].addEventListener('mousedown', (e) => {
        rotateShape(e, el)

    });
}

function rotateShape(e, shape) {
    let shapeCopy = shape
    shape = shape.children
    if (e.altKey && e.which === 2) {
        e.preventDefault()
        let rotateDegree = Number(shape[0].innerHTML)
        rotateDegree += 5
        shape[0].innerHTML = rotateDegree
        shape[1].style.transform = `rotate(${rotateDegree}deg)`;
    }
    else if (e.which === 1 && e.ctrlKey) {
        shape = shape[1].parentElement;
        let shapeStyle = Number(shape.style.zIndex);
        if (!shapeStyle) {
            shape.style.zIndex = 0;
        }
        else if (shape.style.zIndex  > 0){
            shape.style.zIndex = +shape.style.zIndex - 1;
        }
    }
    else if (e.which === 1 && e.shiftKey) {
        shape = shape[1].parentElement;
        let shapeStyle = Number(shape.style.zIndex);
        if (!shapeStyle) {
            shape.style.zIndex = 1;
        }
        else shape.style.zIndex = +shape.style.zIndex + 1;
    }

    else if (e.which === 1 && !e.shiftKey && !e.metaKey && !e.altKey) {
        if (networkSwitch) return;
        if (!isDvdAnimation) {
            animationFrameId = true;
            dvdAnimacion(shapeCopy);
            isDvdAnimation = true;
        }
        else {
            animationFrameId = false;
            isDvdAnimation = false
        }
    }

}

document.addEventListener("click", (e) => {
    if(isSelecting){
        isSelecting = false
        selectionBox.remove();
        selectionBox = null;

    }

})

borderShape.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    if (e.target !== borderShape ) return;

    isSelecting = true;
    startX = e.clientX;
    startY = e.clientY;


    selectionBox = document.createElement("div");
    selectionBox.classList.add("selection-box");
    borderShape.appendChild(selectionBox);

    selectionBox.style.left = `${startX}px`;
    selectionBox.style.top = `${startY}px`;
});


borderShape.addEventListener("mousemove", (e) => {
    if (!isSelecting) return;
    const currentX = e.clientX;
    const currentY = e.clientY;

    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);

    selectionBox.style.width = `${width}px`;
    selectionBox.style.height = `${height}px`;

    selectionBox.style.left = `${Math.min(startX, currentX)}px`;
    selectionBox.style.top = `${Math.min(startY, currentY)}px`;

    selectedElements.clear();
    document.querySelectorAll(".border--item").forEach(shape => {
        if (isElementInSelectionBox(shape, selectionBox)) {
            shape.classList.add("selected");
            selectedElements.add(shape);
        }
        else {
            shape.classList.remove("selected");
        }
    });
});


document.addEventListener("keydown", (e, el) => {changeSize(e)})

function changeSize(e) {
    selectedElements.forEach(el => {
        console.log(networkSwitch)
        if (networkSwitch) return;
        let elementFirtChild = el.children[1]
        let ElWidth = window.getComputedStyle(elementFirtChild).borderBottomWidth.split("p");
        let ElHeight = window.getComputedStyle(elementFirtChild).borderLeftWidth.split("p");
        if (["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].indexOf(e.key) !== -1 && e.shiftKey  && e.altKey){
            moveSelectedElements(e.key)
        }
        else if (e.key === "Backspace" && selectedElements.size > 0) {
            selectedElements.forEach(el => el.remove());
            selectedElements.clear();
            indexBorderShape = 0
        }
        else if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && e.shiftKey) {
            if (elementFirtChild.classList.length === 1){
                if (e.key === "ArrowLeft" ){
                    ElWidth = calc(ElWidth[0], "-")
                    ElHeight = calc(ElHeight[0], "-")
                }
                else {
                    ElWidth = calc(ElWidth[0], "+")
                    ElHeight = calc(ElHeight[0], "+")
                }
                elementFirtChild.style.borderBottomWidth = `${ElHeight}px`;
                elementFirtChild.style.borderLeftWidth = `${ElWidth}px`;
                elementFirtChild.style.borderRightWidth = `${ElWidth}px`;
            }
            else{
                if (e.key === "ArrowLeft" ){
                    ElWidth = calc(elementFirtChild.offsetWidth, "-")
                    ElHeight = calc(elementFirtChild.offsetHeight, "-")
                }
                else {
                    ElWidth = calc(elementFirtChild.offsetWidth, "+")
                    ElHeight = calc(elementFirtChild.offsetHeight, "+")
                }
                elementFirtChild.style.width = `${ElWidth}px`;
                elementFirtChild.style.height = `${ElHeight}px`;
            }
        }

        else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            if (elementFirtChild.classList.length === 1){
                if (e.key === "ArrowLeft" ){
                    ElHeight = calc(ElHeight[0], "-")
                }
                else {
                    ElWidth = calc(ElWidth[0], "+")
                }
                elementFirtChild.style.borderLeftWidth = `${ElWidth}px`;
                elementFirtChild.style.borderRightWidth = `${ElWidth}px`;
            }
            else{
                if (e.key === "ArrowLeft" ){
                    ElWidth = calc(elementFirtChild.offsetWidth, "-")
                }
                else {
                    ElWidth = calc(elementFirtChild.offsetWidth, "+")
                }
                elementFirtChild.style.width = `${ElWidth}px`;
            }
        }
        else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            if (elementFirtChild.classList.length === 1){
                if (e.key === "ArrowUp" ){
                    ElWidth = calc(ElWidth[0], "+")
                }
                else {
                    ElHeight = calc(ElHeight[0], "-")
                }
                elementFirtChild.style.borderBottomWidth = `${ElWidth}px`;
            }
            else{
                if (e.key === "ArrowUp" ){
                    ElHeight = calc(elementFirtChild.offsetHeight, "+")
                }
                else {
                    ElHeight = calc(elementFirtChild.offsetHeight, "-")
                }
                elementFirtChild.style.height = `${ElHeight}px`;
            }
        }
    })
}

function moveSelectedElements(eventKey) {
    selectedElements.forEach(element => {
        let coordinate = getParametorTransform(element);
        let coordinateX = 0;
        let coordinateY = 0;
        if (!coordinate){}
        else [coordinateX, coordinateY]= coordinate;
        switch (eventKey) {
            case "ArrowLeft":
                !element.style.transform? coordinateX = -5: coordinateX = calc(coordinateX, "-");
                break;
            case "ArrowRight":
                !element.style.transform? coordinateX = 5: coordinateX = calc(coordinateX, "+");
                break;
            case "ArrowUp":
                !element.style.transform? coordinateY = 5: coordinateY = calc(coordinateY, "-");
                break;
            case "ArrowDown":
                !element.style.transform? coordinateY = 5: coordinateY = calc(coordinateY, "+");
                break;
        }
        element.style.transform = 'translate3d(' + coordinateX + 'px,' + coordinateY + 'px, 0)';
        shapeMagnitfetEffect(element, eventKey)
    })
}

function calc(poerant, poerator) {
    return poerator === "+" ? Number(poerant) + 5: Number(poerant) - 5;
}

function getParametorTransform(element) {
    if (!element.style.transform) return;
    let coordinate = element.style.transform.split("(")
    coordinate = coordinate[1].split("px, ")
    coordinate = [Number(coordinate[0]), Number(coordinate[1])]
    return coordinate;
}

function shapeMagnitfetEffect(element, eventKey) {
    let coordinatElement = element.getBoundingClientRect();
    let screenWidth = innerWidth;
    let screenHeight = innerHeight;
    if (coordinatElement.left <= 10 && eventKey === "ArrowLeft") {
        let tandz = -element.offsetLeft;
        element.style.transform = `translate3d(${tandz}px, 0, 0)`;
    }
    else if (coordinatElement.right >= screenWidth - 10 && eventKey === "ArrowRight") {
        let tandz = screenWidth - element.offsetLeft - coordinatElement.width;
        element.style.transform = `translate3d(${tandz}px, 0, 0)`;
    }
    else if (coordinatElement.top <= 10 && eventKey === "ArrowUp") {
        let tandz = -element.offsetTop;
        element.style.transform = `translate3d(0, ${tandz}px, 0)`;
    }
    else if (coordinatElement.bottom >= screenHeight - 100 && eventKey === "ArrowDown") {
        let tandz = screenHeight - element.offsetTop - coordinatElement.height;
        element.style.transform = `translate3d(0, ${tandz}px, 0)`;
    }
}
function isElementInSelectionBox(element, selectionBox) {
    const elRect = element.getBoundingClientRect();
    const selRect = selectionBox.getBoundingClientRect();

    return (
        elRect.left >= selRect.left &&
        elRect.right <= selRect.right &&
        elRect.top >= selRect.top &&
        elRect.bottom <= selRect.bottom
    );
}

borderShape.addEventListener("mouseup", () => {
    if (isSelecting) {
        isSelecting = false;
        selectionBox.remove()
        selectionBox=null;
    }
});


inputColor.addEventListener("click", (e) => { selectedElements.forEach(el => changeColor(el))})

function changeColor(el) {
    el.children[0].style.color=inputColor.value
    if (el.children[1].classList.length === 1){
        el.children[1].style.borderBottomColor=inputColor.value
    }
    else{
        el.children[1].style.background=inputColor.value
    }
}

function dvdAnimacion(shape) {
    let geometricData = {};
    let currentDirection;
    let currentPosition;
    let isSerous = confirm("Are you sure you want to start the animation ?");
    if (isSelecting) {
        isSelecting = false;
        selectionBox.remove()
        selectionBox = null;
    }
    if (!isSerous) return;
    function setGeometricData() {
        let blockCordinat = shape.getBoundingClientRect();
        geometricData.logoWidth = shape.clientWidth;
        geometricData.logoHeight = shape.clientHeight;
        geometricData.screenEdgeRight = window.innerWidth - blockCordinat.x;
        geometricData.screenEdgeBottom = window.innerHeight - blockCordinat.y;
    }

    function initializeValues(cordinats) {
        setGeometricData();
        // if (cordinats){
        //     currentDirection = { x: cordinats[0], y: cordinats[1] };
        //     currentPosition = { x: 0 , y: 0 };
        // }
        // else{
            currentDirection = { x: 1, y: 1 };
            currentPosition = { x: 0 , y: 0 };
        // }
    }

    function move() {
        const newX = currentPosition.x + currentDirection.x;
        const newY = currentPosition.y + currentDirection.y;
        if (animationFrameId){
            if (newX + geometricData.logoWidth === geometricData.screenEdgeRight) {
                currentDirection.x = -1;
            } else if (newX === 0) {
                currentDirection.x = 1;
            }

            if (newY + geometricData.logoHeight === geometricData.screenEdgeBottom) {
                currentDirection.y = -1;
            } else if (newY === 0) {
                currentDirection.y = 1;
            }

            currentPosition.x = newX;
            currentPosition.y = newY;

            shape.style.transform = 'translate3d(' + newX + 'px, ' + newY + 'px, 0)';
            requestAnimationFrame(move);
        }
        // else{
        //     initializeValues([newX, newY]);
        // }
    }

    initializeValues();
    requestAnimationFrame(move);
};

