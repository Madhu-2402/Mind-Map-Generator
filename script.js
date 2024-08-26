document.addEventListener('DOMContentLoaded', function() {
    const mindmapCanvas = document.getElementById('mindmapCanvas');
    const arrowCanvas = document.getElementById('arrowCanvas');
    const addNodeBtn = document.getElementById('addNodeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const shapeSelect = document.getElementById('shapeSelect');
    const nodeContentInput = document.getElementById('nodeContent');

    let nodeCount = 0;
    let nodes = [];
    let connections = [];
    let currentNode = null;
    let selectedNodes = [];

    function createNode() {
        const node = document.createElement('div');
        node.classList.add('node', shapeSelect.value);
        node.textContent = nodeContentInput.value || `Node ${++nodeCount}`;

        node.style.top = `${Math.random() * (mindmapCanvas.clientHeight - 100)}px`;
        node.style.left = `${Math.random() * (mindmapCanvas.clientWidth - 150)}px`;

        node.dataset.nodeId = nodeCount;
        nodes.push(node);

        node.addEventListener('mousedown', function(event) {
            currentNode = node;
            offsetX = event.clientX - node.getBoundingClientRect().left;
            offsetY = event.clientY - node.getBoundingClientRect().top;

            document.addEventListener('mousemove', dragElement);
            document.addEventListener('mouseup', dropElement);
        });

        node.addEventListener('click', function() {
            if (selectedNodes.length === 0 || selectedNodes.length === 1 && selectedNodes[0] !== node) {
                selectedNodes.push(node);
                node.style.border = "2px solid red";
            }

            if (selectedNodes.length === 2) {
                createConnection(selectedNodes[0], selectedNodes[1]);
                selectedNodes.forEach(node => node.style.border = "none");
                selectedNodes = [];
            }
        });

        node.ondragstart = function() {
            return false;
        };

        mindmapCanvas.appendChild(node);
        updateArrows();
    }

    function dragElement(event) {
        if (currentNode) {
            const newX = event.clientX - offsetX;
            const newY = event.clientY - offsetY;

            const boundedX = Math.max(0, Math.min(mindmapCanvas.clientWidth - currentNode.offsetWidth, newX));
            const boundedY = Math.max(0, Math.min(mindmapCanvas.clientHeight - currentNode.offsetHeight, newY));

            currentNode.style.left = `${boundedX}px`;
            currentNode.style.top = `${boundedY}px`;

            updateArrows();
        }
    }

    function dropElement() {
        document.removeEventListener('mousemove', dragElement);
        document.removeEventListener('mouseup', dropElement);
        currentNode = null;
    }

    function createConnection(startNode, endNode) {
        connections.push({ startNode, endNode });
        updateArrows();
    }

    function updateArrows() {
        // Adjust the size of the arrowCanvas to match the mindmapCanvas
        arrowCanvas.setAttribute('width', mindmapCanvas.clientWidth);
        arrowCanvas.setAttribute('height', mindmapCanvas.clientHeight);
        arrowCanvas.innerHTML = '';

        connections.forEach(connection => {
            const { startNode, endNode } = connection;
            const startX = parseInt(startNode.style.left) + startNode.offsetWidth / 2;
            const startY = parseInt(startNode.style.top) + startNode.offsetHeight / 2;
            const endX = parseInt(endNode.style.left) + endNode.offsetWidth / 2;
            const endY = parseInt(endNode.style.top) + endNode.offsetHeight / 2;

            const arrow = document.createElementNS("http://www.w3.org/2000/svg", "line");
            arrow.setAttribute("x1", startX);
            arrow.setAttribute("y1", startY);
            arrow.setAttribute("x2", endX);
            arrow.setAttribute("y2", endY);
            arrow.setAttribute("stroke", "black");
            arrow.setAttribute("stroke-width", "2");

            arrowCanvas.appendChild(arrow);
        });
    }

    addNodeBtn.addEventListener('click', createNode);

    clearBtn.addEventListener('click', function() {
        mindmapCanvas.innerHTML = '<svg id="arrowCanvas"></svg>';
        nodes = [];
        connections = [];
        nodeCount = 0;
    });
});
